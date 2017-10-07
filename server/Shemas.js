var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = {
    recordSh: new Schema({
        date: Date,
        records: [{ id: Number, online: Boolean }],
    }),

    userSh: new Schema({
        id: {type:Number,unique:true},
        photo_100: String,
        first_name: String,
        last_name:String,
        is_registered: { type: Boolean, default: false },
        token: { type: String, default: "" },
    }),
    rowSh: new Schema({
        id: Number,
        startDate: Date,
        count: Number,
        isSleep: Boolean,
    })
}