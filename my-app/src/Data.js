import request from 'request'

function getSleep(endpiont){
    var API_URL = "http://cotr.me:4568/vk/"
    return new Promise((resolve, reject) => {
        request({ headers: { origin: "http://cotr.me:3000" }, url: API_URL + endpiont }, function (err, res, body) {
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
export default class DataProvider {
    users = []
    Stats = new StatisticsExtractor()
    records = []

    load =getSleep('records')
        .then(records => {
            this.records = records;
            console.log("got records",records)
        })
        .then(()=>{return getSleep('users')})
        .then(users => {
            this.users = users.map((u, i) => { u['value'] = i; return u });
            console.log("got Users",this.users)
        })

    get_users() {
        return this.users;
    }
    get_records() {
        return this.records;
    }

}
class StatisticsExtractor {
    constructor(){
        
        let upper = new Date(2017,9,5)
        console.log(upper)
        console.log(this.niceSplit(new Date(2017,9,25).getTime(),upper.getTime(),5))
    }
    
    ordersBase={
        'minute': [5, 10, 15, 20, 30],
        'hour': [1, 2, 3, 4, 6, 8, 12],
        'day': [1, 3, 5, 7, 14],
        'month': [1, 2,3, 6],
        'year':[1,3]
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