var db = require('./db.js')
var lg = require("./logger.js").debug.db
db.connect()

var user = {
	date:1,
	records:[{id:1,online:1}]
}
db.saveRecord(user)
db.deleteAllRecords("Yes, delete them").
then(db.getAllRecords).
then((rcs)=>{
	lg.fatal(JSON.stringify(rcs))})

