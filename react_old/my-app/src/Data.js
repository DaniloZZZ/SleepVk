import request from 'request'

export default class DataProvider {
    users = []

    records = []

    API_URL = "http://cotr.me:4568/vk/"

    load = this.getSleep('users')
        .then(users => {
            this.users = users.map((u, i) => { u['value'] = i; return u });
            console.log(this.users)
        })
        .then(getSleep('records'))
        .then(records => {
            this.records = records;
        })

    get_users() {
        return this.users;
    }
    get_records() {
        return this.records;
    }

    getSleep(endpoint){
        return new Promise((resolve, reject)=>{
            request({ headers: { origin: "http://cotr.me:3000" }, url: this.API_URL + endpiont }, function (err, res, body) {
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
}