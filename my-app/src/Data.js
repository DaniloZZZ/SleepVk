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