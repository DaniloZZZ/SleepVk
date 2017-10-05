import request from 'request'
import React,{Component} from 'react';

export default class DataProvider {
    constructor(ts){
        if (ts!= undefined ){
            if (ts.length != 5) {
                throw new Error("Timespan map must be array 5 elements long. Not this:",ts)
            }
            let now = new Date()
            this.lower = new Date(now.getFullYear() - ts[0],
                now.getMonth() - ts[1],
                now.getDate() - ts[2],
                now.getHours() - ts[3],
                now.getMinutes() - ts[4])
            this.upper = now
        //this.initStats = this.initStats.bind(this)
        }
    }
    
    upper  = new Date()
    lower = new Date().setDate(this.upper.getDate()-1)

    load =getSleep('records')
        .then(records => {
            this.records = records;
            console.log("got records",records)
        })
        .then(()=>{return getSleep('users')})
        .then(users => {
            if (typeof(users.map) != 'undefined' ) {
                this.users = users.map((u, i) => { u['value'] = i; return u });
                console.log("got Users", this.users)
            }
            else{
                console.log("Returned not an array",users)
            }
        }).then(()=>{this.initStats()})

    initStats() {
        if (this.records != undefined) {
            this.Stats = new StatisticsExtractor(this.records)
            return this.Stats
        } else {
            console.log("trying to extract stats without data")
        }
    }

    get_users() {
        return this.users;
    }
    getUserRecords(user) {
        console.log("from getUsrRecs: DataProvider.recs",this.records)
        if (this.records != undefined) {
            this.Stats.user_id = user.id;
            return this.Stats.summarizeData(this.lower,this.upper)
        } else {
            console.log("trying to extract stats without data")
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
    pointsCount  = 10
    ordersBase={
        'minute': [5, 10, 15, 20, 30],
        'hour': [1, 2, 3, 4, 6, 8, 12],
        'day': [1, 3, 5, 7, 14],
        'month': [1, 2,3, 6],
        'year':[1,3]
    }

    extractUser(user_id){
        return this.data.map(d=>{
            let user = d.records.filter(u => u.id == user_id)[0]
            return {
                [this.valueKey]: user[this.valueKey],
                [this.labelKey]: d[this.labelKey]
            }
        })
    }

    summarizeData(lower,upper){
        var uData = this.extractUser(this.user_id)
        var labelAr = uData.map(d=>d[this.labelKey])
        var valueAr = uData.map(d => d[this.valueKey])
        var len = labelAr.length
        console.log("Summarizing",lower,upper)
        var lower = lower ? lower : new Date(labelAr[0]).getTime()
        var upper = upper ? upper : new Date(labelAr[len - 1]).getTime()

        var points = this.niceSplit(lower,upper,this.pointsCount)
        var summary = []
        let n = 0
        points.forEach((p,i)=>{
            let p1 = points[i]
            let p2 = points[(i+1)]
            let sum = 0
            let nthDate = new Date(labelAr[n])
            while(nthDate<p2){
                nthDate = new Date(labelAr[n])
                sum+=valueAr[n]
                n++
            }
            summary[i] =sum*this.MINUTES_BETWEEN
        })

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
        var best_order
        var orders = this.composeOrders()
        for (var idx in orders) {
            var points =  new Array()
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
               best_order = order
               console.log("found best order",order)
               break;
            }
        }
        // calculate offset to closest nice point 
        let t = best_order.type
        let rank = best_order.rank
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
            console.log(points)
            return points.map(v=>{return new Date(v.getTime()+offset)})
        }else{
            console.log("Too small data range",lower,upper)
            return [lower,upper]
        }
    }
}

function getSleep(endpiont){
    var HOSTNAME = window.location.host.slice(-1)
    var API_URL = "http://"+"cotr.me"+":4568/vk/"
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