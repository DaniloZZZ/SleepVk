/*eslint eqeqeq: ["warn", "smart"]*/

import request from 'request'

export default class DataProvider {
    constructor(ts){
        this.timespan = ts
        if (ts!== undefined ){
            this.setUpper(new Date())
        }
        console.log("condtructing new Provider with mask:",ts)
    }
    
    upper  = new Date()
    lower = new Date().setDate(this.upper.getDate()-1)

    loadRecords() {
        return getSleep('records')
            .then(records => {
                this.records = records;
                console.log("loadchain: got records", records.length)
            }).then(() => { this.initStats() })
    }

    loadUsers() {
        return getSleep('users')
            .then(users => {
                if (typeof (users.map) !== 'undefined') {
                    this.users = users.map((u, i) => { u['value'] = i; return u });
                    console.log("loadchain: got Users", this.users.length)
                }
                else {
                    console.error("API Returned users thats not an array", users)
                }
            })
    }

initStats() {
    if (this.records !== undefined) {
        this.Stats = new StatisticsExtractor(this.records)
        return this.Stats
    } else {
        console.error("trying to extract stats without data")
    }
}
    setUpper(upper){
            let ts = this.timespan
            if (ts.length !== 5) {
                throw new Error("Timespan map must be array 5 elements long. Not this:",ts)
            }
            this.lower = new Date(upper.getFullYear() - ts[0],
                upper.getMonth() - ts[1],
                upper.getDate() - ts[2],
                upper.getHours() - ts[3],
                upper.getMinutes() - ts[4])
            this.upper = upper

    }

    get_users() {
        return this.users;
    }
    getUserRecords(user) {
        console.log("data: providing user records...")
        if (this.records !== undefined) {
            this.Stats.user_id = user.id;
            let records = this.Stats.summarizeData(this.lower,this.upper)
            let len = records.length ? records.length : 0
            console.log("provided records len ", len)
            return records
        } else {
            console.log("trying to extract stats without data")
            return []
        }
    }
}

class StatisticsExtractor {
    constructor(data){
        this.data = data
    }

    MINUTES_BETWEEN=5
    valueKey ='online'
    labelKey = 'date'
    user_id = 131968259
    pointsCount  = 24
    ordersBase={
        'minute': [5, 10, 15, 20, 30],
        'hour': [1, 2, 3, 4, 6, 8, 12],
        'day': [1, 3, 5, 7, 14],
        'month': [1, 2,3, 6],
        'year':[1,3]
    }

    extractUser(user_id){
        var res = []
        this.data.forEach(d=>{
            let user_found = d.records.filter(u => u.id === user_id)
            if (user_found.length > 0) {
                var user = user_found[0]
                res.push({
                    [this.valueKey]: user[this.valueKey],
                    [this.labelKey]: d[this.labelKey]
                })
            } 
        })
        return res
    }

    summarizeData(lower, upper) {
        var uData = this.extractUser(this.user_id)
        var labelAr = uData.map(d=>d[this.labelKey])
        var valueAr = uData.map(d => d[this.valueKey])
        var len = labelAr.length
        console.log("stats: Summarizing",lower,upper)
        lower = lower ? lower : new Date(labelAr[0]).getTime()
        upper = upper ? upper : new Date(labelAr[len - 1]).getTime()

        // Get nice splitted date points (integer weeks, days)
        var points = this.niceSplit(lower,upper,this.pointsCount)
        var summary = [] // for resulting values array
        let n = 0
        // going to start of desired span
        let nthDate = new Date(labelAr[n])
        while (nthDate < points[0]) {
            nthDate = new Date(labelAr[n])
            n++
        }
        // find firt records excisting 
        let idx = 0
        while(nthDate>points[idx]){
            summary[idx] = NaN;
            idx++
            // No data!
            if(idx===points.length){
                return []
            }
        }
        // if was Nan, first non-null point will display ugly like _ \._
        if (idx > 0) {summary[idx - 1] = 0}
        // get sum of values for each splitted point
        for (let i=idx;i<points.length;i++){
            let p2 = points[i]
            // if theres no records given timespan
            let sum =0
            // sum data up to next point of nice split
            while(nthDate<=p2){
                sum+=valueAr[n]
                n++
                nthDate = new Date(labelAr[n])
            }
            summary[i] =sum*this.MINUTES_BETWEEN
        }
        // format to appropriate form
        console.log(summary)

        return summary.map((v, i) => {
            return {
                [this.labelKey]: points[i],
                [this.valueKey]: summary[i]
            }
        })
    }

    composeOrders() {
        var orders = []
        Object.keys(this.ordersBase).forEach((key, i) => {
            this.ordersBase[key].forEach((r) => {
                orders.push({
                    type: i,
                    rank: r
                })
            })
        })
        return orders
    }

    niceSplit(lower, upper, max_nums) {
        //swap datas if incorrect order
        if (lower > upper) {
            let t = lower
            lower = upper
            upper = t
        }
        var lower_date= new Date(lower)
        var orders = this.composeOrders()
        for (var idx in orders) {
            var points =  []
            let order = orders[idx]
            let head = lower_date
            let num = 0
            let rank = order.rank
            let exceeded = false;
            let t = order.type
            //count number of jordan cells of given order in range
            while(head.getTime()<=upper){
                points[num] = head
                head = new Date(
                    rank * kr(t, 4) + head.getFullYear(),
                    rank * kr(t, 3) + head.getMonth(),
                    rank * kr(t, 2) + head.getDate(),
                    rank * kr(t, 1) + head.getHours(),
                    rank * kr(t, 0) + head.getMinutes(),
                    lower_date.getSeconds(),
                    lower_date.getMilliseconds()
                )
                //console.log(head, head.getTime(),upper,new Date(upper))
                // Do not count by hours ranges that last months
                // Limitation: max range = max order*max_n
                if (num > max_nums) {
                    exceeded  = true;
                    break;
                }
                num++;
            }
            if(!exceeded){
               this.best_order = order
               break;
            }
        }
        // calculate offset to closest nice point 
        let t = this.best_order.type
        let rank = this.best_order.rank
        let nv = Math.floor((kr(t, 4) * lower_date.getFullYear() +
                        kr(t, 3) * lower_date.getMonth() +
                        kr(t, 2) * lower_date.getDate() +
                        kr(t, 1) * lower_date.getHours() +
                        kr(t, 0) * lower_date.getMinutes())
                        / rank) * rank
        
        let new_lower = new Date(
            hvs(4 - t) * (nv * kr(t, 4) + nkr(t, 4) * lower_date.getFullYear()),
            hvs(3 - t) * (nv * kr(t, 3) + nkr(t, 3) * lower_date.getMonth()),
            hvs(2 - t) * (nv * kr(t, 2) + nkr(t, 2) * lower_date.getDate()),
            hvs(1 - t) * (nv * kr(t, 1) + nkr(t, 1) * lower_date.getHours()),
            hvs(0 - t) * (nv * kr(t, 0) + nkr(t, 0) * lower_date.getMinutes()),
            0,0
        )
        let offset = new_lower-lower
        // return offsetted data
        if (points.length > 1) {
            return points.map(v=>{return new Date(v.getTime()+offset)})
        }else{
            console.log("Too small data range",lower,upper)
            return [lower,upper]
        }
    }
}

function getSleep(endpiont){
    console.log("data:Setting a request for "+endpiont)
    var HOSTNAME = window.location.host.slice(-1)
    var API_URL = "http://cotr.me:4568/vk/"
    return new Promise((resolve, reject) => {
        request({ headers: { origin: "http://"+HOSTNAME+":3000" }, url: API_URL + endpiont }, function (err, res, body) {
            // Make an http to search api
            if (err) { reject(err); }
            else {
                // parse response
               var answ = JSON.parse(body);
                if (answ.error == null) {
                    // if request succesfull, resolve promice with _items_ of search
                    resolve(answ);
                } else {
                    // if api returned an error, reject promice
                    reject(answ.error);
                }
            }
        })
    })
}
function hvs(a){
    // A Heaviside
    if(a>=0){
        return 1
    }
    else {
        return 0
    }
}

function nkr(i,j){
    if (i !== j) {
        return 1
    }else{
        return 0
    }
}
function kr(i,j){
    // A Kroneker delta
    if(i===j){
        return 1
    }else{
        return 0
    }
}