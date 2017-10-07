var request = require("request")
var fs = require('fs');
var cronJob = require('cron').CronJob;
var db = require('./db.js')
var express = require("express")
const logger = require('./logger.js')

const dbg = logger.debug.worker
const log = logger.debug.worker

var app = express();

const apID = 6098753;
const PORT = 1500;

const my_id =131968259
const friend_url = "https://api.vk.com/method/friends.get"
const users_get = "https://api.vk.com/method/users.get"
var friends = [35509813,131968259,18071208,186959066,286857904]

var job = new cronJob(' */5  * *  *  *',Main);

db.connect()
db.getUsersIds()
.then((ids)=>{
    log.trace("got user ids from DB. Length:"+ids.length)
    friends=ids
})
.then(()=>{job.start()})
.catch((err)=>{
    log.error(err)
})

log.info("admin control server listening on port "+PORT+"...")
app.listen(PORT)

function Main(){
    qs = {
        "user_ids": friends, // TODO: should be no more than 100
        "fields": ["photo50", "online"]
    }
    vkRequestMaker(users_get, qs).then(body => {
        log.trace("users.get request done.")
        now = new Date();
        let usr_array = body.response;
        record = {
            date: now,
            records: usr_array.map(u => {
                return {
                    id: u.id,
                    "online": u.online
                };
            })
        }
        db.saveRecord(record)

    }).catch((error) => {
        log.error(error)
    })
}


function vkRequestMaker(url, query, token) {
    if (token == null) {
        var token = loadlocaltoken(); // load API token from filesystem
    }
    query["access_token"] = token;
    query.v = "5.68"
    return new Promise((resolve, reject) => {
        // Make an http to search api
        request({ url: url, qs: query }, function (err, res, body) {
            //console.log("req returned:",body," url:",url);
            if (err) { reject(err); }
            else {
                // parse response
                var answ = JSON.parse(body);
                if (answ.error == null) {
                    // if request succesfull, resolve promice with _items_ of search
                    resolve(answ);
                } else {
                    // if Vk api returned an error, reject promice
                    reject(answ.error);
                }
            }
        });
    });
}

app.get('/newuser',(req,res)=>{
    log.info("recieved signal to update users. Getting from DB...")
    db.getUsersIds()
    .then((user_ids)=>{
        res.send("OK");
        friends = user_ids;
        log.trace("got user Ids. Length:" + ids.length)
    }).catch((err)=>{
        res.send(err)
        log.error(err)
    })
})

function loadlocaltoken() {
    return fs.readFileSync('../../.vktoken').slice(0, -1).toString();
}