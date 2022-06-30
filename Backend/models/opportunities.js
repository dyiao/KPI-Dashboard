const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const flagSchema = new Schema({
    strict: false
})

const subflagSchema = new Schema({
    strict: false
})

const highlightSchema = new Schema({
    name: String,
    value: String
})

const stepSchema = new Schema({
    order: Number,
    label: String,
    value: String
})

const logicValueSchema = new Schema({
    label: String,
    value: String,
    unit: String,
    logic: String
})

const OpportunitySchema = new Schema({
    _id: String,
    createdAt: Date,
    docCreatedDate: {
        $date: Date
    },
    flagSchema,
    highlights: [
        highlightSchema
    ],
    isActive: String,
    logicValue: [
        logicValueSchema
    ],
    opp_type: String,
    opportunity_id: String,
    siteId: String,
    startedAt: Date,
    state: String,
    stateChanged: String,
    steps: [
        stepSchema
    ],
    sub_flags: subflagSchema,
    title: String,
    updatedAt: Date
})

module.exports = mongoose.model("Opportunity", OpportunitySchema);