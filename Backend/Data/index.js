const mongoose = require('mongoose');
const Prediction = require("../models/predictions")
const Opportunity = require("../models/opportunities")
const Status = require("../models/status")

const allData = [];
// month loop here if needed
for (let i = 1; i <= 26; i++) {
    const daily = require(`../../Data/Jan 30/UpsetMLData/UpsetMLDebugDetails_2022-01-${(i < 10) ? ("0" + i) : i}.json`)
    allData.push(...daily);
}

const allStatus = [];
for (let i = 1; i <= 26; i++) {
    const daily = require(`../../Data/Jan 30/assetStatusOutput/assetStatusOutput_2022-01-${(i < 10) ? ("0" + i) : i}.json`)
    allStatus.push(...daily);
}

const allOpportunity = [];
for (let i = 1; i <= 26; i++) {
    const daily = require(`../../Data/Jan 30/opportunities/opportunityScoreOutput_2022-01-${(i < 10) ? ("0" + i) : i}.json`)
    allOpportunity.push(...daily);
}

// mongoose.connect('mongodb://localhost:27017/capstone-data');

mongoose.connect("mongodb+srv://IBMCapstone:IBMCapstoneAdmin@ibmcapstone.7naqx.mongodb.net/IBMCapstone?retryWrites=true&w=majority");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: Could not connect to MongoDB"));

db.once("open", () => {
    console.log("Database connected");
});

const loadData = async () => {
    await Prediction.deleteMany({});
    await Status.deleteMany({});
    await Prediction.insertMany(allData);
    await Status.insertMany(allStatus);
    await Opportunity.deleteMany({});
    await Opportunity.insertMany(allOpportunity);
}

loadData()
    .then(() => {
        console.log("added data to db")
    })


