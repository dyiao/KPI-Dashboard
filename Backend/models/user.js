const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocal = require('passport-local')

const UserSchema = new Schema({

})

UserSchema.plugin(passportLocal)


module.exports = mongoose.model("User", UserSchema)