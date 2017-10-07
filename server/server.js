var request = require("request")
var express = require("express")
var fs = require('fs');
const db = require('./db.js')
const logger = require('./logger.js')

const log = logger.server
const dbg = logger.debug.server

var PORT = 4568;
var app = express();
var urs;

const users_get = "https://api.vk.com/method/users.get"

log.info(" API Server lisetening in port " + PORT);
app.listen(PORT);

log.info("Connecting to DB")
db.connect()

USERS = []
log.info("Getting user_ids from db, then details from vk")
db.getUsersIds()
    .then((user_ids) => {
        dbg.trace("got userids from DB. count"+user_ids.length)
        return vkRequestMaker(users_get, { user_ids: user_ids.join(','), fields: "photo_100" })
    })
    .then((vk) => {
        log.info("Got " + JSON.stringify(vk.response.length) + " users")
        USERS = vk.response
    }).catch((err)=>{ 
        log.error(err)
        handleNoUsers(err)
    })

// ***----Web Server stuff----***
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.get('/newusers',(req,res)=>{
    log.info("setting new users")
    try{
        var user_ids = JSON.parse(req.query.users)
        if(typeof(user_ids)!=='object'){
            throw new TypeError("Invalid users param >"+req.query.users+
            "< Provide an array. parsed "+user_ids+"typeof"+typeof(user_ids) )
        }
        var len = user_ids.length
    }catch (err){
        log.error(err)
        res.send("Check passed params. must be array")
        return
    }
    vkRequestMaker(users_get, {user_ids: user_ids, fields:'photo_100' })
    .then((vk)=>{
        dbg.trace("vk answer",vk)
        log.info("Got " + vk.response.length + " users. Saving them to db")
        vk.response.forEach((usr,i)=>{
            db.saveUser(usr)
        })
        res.send("OK")
    })
    .catch((err)=>{
        log.error(err)
        res.send(err)
    })
})

app.get('/vk/records',(req,res)=>{
    log.info("sendig requested records...")
    // use either provided or today
    let to = req.query.to || new Date().getTime()
    // use either provided or 2 days day before "to"
    two_day_before = new Date()
    two_day_before.setDate(new Date(to).getDate()-2)
    let from = req.query.from || two_day_before.getTime()
    db.getRecords(from,to)
        .then((records)=>{
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(records));
            log.trace("sent requested record")
        })
        .catch((err)=>{
            res.send(err)
            log.error(err)
        })
})

app.get('/vk/users',(req,res)=>{
    res.send(JSON.stringify(USERS))
    log.info("Sent users")
})

handleNoUsers = function(){
        log.info("Couldnt initialize users list. Serving default user ")
        USERS =  [{
            "id": 131968259,
            "first_name": "Данил",
            "last_name": "Лыков",
            "city": {
            "id": 628,
            "title": "Запорiжжя"
            },
            "photo_100": "https://pp.userap...fe2/a2OABgQFiNw.jpg",
            "verified": 0
            }]
}

app.get('/', function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        res.send("Hello little spy");
    }
    catch (e) { res.send(e) }
});

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

function loadlocaltoken() {
    return fs.readFileSync('../../.vktoken').slice(0, -1).toString();
}