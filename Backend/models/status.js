const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FlagSchema = new Schema({
    _id: String,
    statusId: String,
    assetId: String,
    name: String,
    category: String,
    category_label: String,
    createdAt: {
        type: Date
    },
    docCreatedDate: {
        $date: {
            type: Date
        }
    },
    countSinceUpset: Number,
    dateLastUpset: Date,
    onset: Date,
    flag: Number,
    flagBeforePersist: Number,
    persist: String,
    threshold: String
})


const StatusSchema = new Schema({
    _id: String,
    assetId: String,
    category: String,
    createdAt: Date,
    docCreatedDate: {
        $date: {
            type: Date
        }
    },
    flags: [FlagSchema],
    name: String,
    overall_flag: Number,
    statusId: String
})

module.exports = mongoose.model("Status", StatusSchema);