mongoose=require('mongoose')
Shemas = require('./Shemas.js')
var logger = require('./logger.js').db

var Record
var User
var Row
var connected = false
var a=1;
connect = function(){
        //connecting local mongodb database named test
        var db = mongoose.connect('mongodb://127.0.0.1:27017/sleepvk');
        //testing connectivity

        Record = db.model('Record', Shemas.recordSh)
        User = db.model('User',Shemas.userSh)
        Row = db.model('Row',Shemas.rowSh)

        mongoose.connection.once('connected', function () {
                connected = true
               logger.info("Database connected successfully")
        });
}

module.exports={
    connect:connect,
    Record:Record,
    User:User,
    Row:Row,
    // ----Records----
    saveRecord: function (record) {
        logger.trace("saving record...")
        Record.create(record,(err,rec)=>{
            if(err){
                logger.error(err)
            }
            else{
                logger.trace("successfully saved")
            }
        })
    },

    deleteAllRecords:function(label){
        if(label="Yes, delete them"){
            return new Promise((resolve, reject) => {
                logger.warn("Holy f*cking shit! removing all records!")
                Record.remove({}, (err, recs) => {
                    if (err) {
                        logger.error(err)
                        reject(err)
                    }
                    resolve(recs)
                })
            })
        }
    },

    getRecords:function(from,to){
        f=  new Date(from)
        t = new Date(to)
        return new Promise((resolve,reject)=>{
            Record.find({date:{$gte:f,$lte:t}},(err,recs)=>{
                if(err) {
                    logger.error(err)
                    reject(err)
                }
                resolve(recs)
            })
        })
    },
    getAllRecords:function(){
        return new Promise((resolve,reject)=>{
            Record.find({},(err,recs)=>{
                if(err) {
                    logger.error(err)
                    reject(err)
                }
                resolve(recs)
            })
        })
    },

    // ----Users----
    saveUser:function(user,owerwrite=true){
        logger.trace("saving user...")
        User.remove({ id: user.id }).then((err) => {
                User.create(user, (err1, rec) => {
                    if (err1) logger.error(err1)

                    else {
                        logger.trace("successfully saved")
                    }
                })
        })
    },

    getUsersIds:function(){
        return new Promise((resolve, reject) => {
            logger.trace("Gettting ids of users...")
            User.find({}).select('id').exec((err, users) => {
                if (err) {
                    logger.error(err)
                    reject(err)
                }
                resolve(users.map((e)=>e.id))
            })
        })
    },

    // ----Rows----
    saveRow:function(row){
        logger.trace("saving row...")
        Row.create(row,(err,rec)=>{
            if(err){
                logger.error(err)
            }
            else{
                logger.trace("successfully saved")
            }
        })

    }
}