const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PredictSchema = new Schema({
    values: [
        [
            Number
        ]
    ],
    fields: [
        [
            // unsure about this part, might need fix
            String
        ]
    ]
})

const WarningQueueSchema = new Schema({
    prediction_time: Date,
    prediction_expiration_time: Date,
})

const WarningHistorySchema = new Schema({
    prediction_life: Number,
    onset_criterion: Number,
    offset_criterion: Number,
    consecutive_upset_predictions: Number,
    consecutive_normal_predictions: Number,
    warning_queue: [WarningQueueSchema],
    // warning_queue:[{}]  leave this out unstrict rn, add back when sure what's inside
    current_prediction: {
        prediction_time: Number,
        prediction_expiration_time: Number
    }
}, { strict: false })

const PredictionSchema = new Schema({
    _id: String,
    categories: [
        String
    ],
    createdAt: {
        type: Date
    },
    docCreatedDate: {
        $date: {
            type: Date
        }
    },
    flags: [
        {
            flag: String,
            status: String,
            label: String,
            threshold: String,
            expires: Date,
            onset: Date,
            inputToFP: String,
            prediction: [PredictSchema],
            warningHistory: [WarningHistorySchema],
            error: String,
            score: Number,
            outputFromFP: String
        }
    ],
    overall_flag: Number,
    status: String
}, { strict: false })

module.exports = mongoose.model("Prediction", PredictionSchema);
