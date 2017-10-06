var request = require("request")
var express = require("express")
var fs = require('fs');

var app = express();
var cronJob = require('cron').CronJob;

var PORT = 4568;
var apID = 6098753;

data =loadData()
data_h = {}
console.log("Server lisetening in port " + PORT);
app.listen(PORT);

try{
     JSON.parse(fs.readFileSync('./data/users.json'))
}
catch (err){
var friends = [35509813,131968259,18071208,186959066,286857904]
}
var job = new cronJob(' */5  * *  *  *',Main);
job.start();

var saving = new cronJob('  */15 * *  *  *', handleData);
saving.start();
const my_id =131968259
const friend_url = "https://api.vk.com/method/friends.get"
const users_get = "https://api.vk.com/method/users.get"
/*
vkRequestMaker(
		friend_url,{
		"user_id":my_id,
		"count":10,
		})
*/


function Main(){
    qs = {
        "user_ids": friends,
        "fields": ["photo50", "online"]
    }
    
    vkRequestMaker(users_get, qs).then(body => {
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
        data.push( record);
     //   console.log("data",data,"record",record)
    })

    console.log("Record done. Data:",data)
}

function handleData(){
    saveData(data)
    keys = Object.keys(data);
/*

    var MINUTES_BETWEEN = 5
    var now = new Date()
    var numberOfRecs = 60 / MINUTES_BETWEEN;
    keys.forEach(k => {
        data_h[k] = []
        date = new Date(now.getFullYear(), now.getMonth(), now.getMonth(), now.getHours()+1)
        console.log(date)
        recs = Math.floor(now.getMinutes()/MINUTES_BETWEEN)
        console.log("recs",recs)
        data_h[k].push({
            date:date,
            "online":sum(data[k].slice(-recs))*MINUTES_BETWEEN
        })
        for (h = 0; h < 24-now.getHours(); h++) {
            mins_online = 0;
            date = new Date(now.getFullYear(), now.getMonth(), now.getMonth(), now.getHours()-h)
            
            recs_hour = data[k].slice((-h-1)*numberOfRecs-recs,-h*numberOfRecs-recs) 
            mins_online = sum(recs_hour) * MINUTES_BETWEEN
            data_h[k].push({
                date: date,
                "online": mins_online
            })
            //console.log("mins",mins_online,"date",date,"sliced",recs_hour,(-h-1)-recs,-h-recs)
        }
    })*/
    console.log("data",data)
}

function sum(arr){
    if(arr.length==0){
        return  0;
    }else{
        return arr.reduce((a,b)=>a+b)
    }
}

function loadData(){
    try{
    const now  = new Date()
    const fileName = now.getMonth()+"m-"+now.getDate()+"d" + ".json"
    return JSON.parse(fs.readFileSync('./data/raw/'+fileName))
    }
    catch (err){
        console.log(err)
        return [];
    }
}

function saveData(data) {
    keys = Object.keys(data)
    const now  = new Date()
    const fileName = now.getMonth()+"m-"+now.getDate()+"d" + ".json"
    console.log("writing data to file" + fileName + ". length", data.length)
    fs.writeFileSync('./data/raw/'+fileName, JSON.stringify(data))
}

function appendData(data) {
    try {
        var old = JSON.parse(fs.readFileSync('./data.json'))
        keys = Object.keys(old)

        keys.forEach((k) => {
            old[k] = old[k].concat(data[k])
        })
        saveData(old)
    }
    catch (err) {
        console.log("error opening", err);
        console.log("overwriring data")
        saveData(data)
    }
}

// ***---VK---***

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
    return fs.readFileSync('../.vktoken').slice(0, -1).toString();
}

// ***----Web Server stuff----***
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.get('/', function (req, res) {
//    logger.info(req.query);
    try {
        console.log("giving html")
        res.set('Content-Type', 'text/html');
        res.send(fs.readFileSync('index.html')+JSON.stringify(data));
    }
    catch (e) { res.send(e) }
});

app.get('/vk/records',(req,res)=>{
    console.log("sendig records")
    res.send(JSON.stringify(data));
})

app.get('/vk/users',(req,res)=>{
    try {
        vkRequestMaker(users_get,{user_ids:friends,fields:"photo_100"}).then((users)=>{
            console.log("Giving users data")
            res.set('Content-Type', 'text/html');
            res.send(JSON.stringify(users.response));
        })
    }
    catch (e) { res.send(e) }
})