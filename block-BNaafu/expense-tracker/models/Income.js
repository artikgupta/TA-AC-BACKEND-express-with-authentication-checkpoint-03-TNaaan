var mongoose =require("mongoose");

const Schema = mongoose.Schema

const ImcomeSchema = new Schema({

source :String,
amount:Number,
referenceToUser:{ type: Schema.Types.ObjectId, ref: 'User' },
}, {timestamps:true})


var Income = mongoose.model('Income', ImcomeSchema);

  module.exports = Income;