var mongoose =require("mongoose");

const Schema = mongoose.Schema

const ExpenseSchema = new Schema({

category :String,
amount:Number,
referenceToUser:{ type: Schema.Types.ObjectId, ref: 'User' },
},{timestamps:true})



var Expense = mongoose.model('Expense', ExpenseSchema);

  module.exports = Expense;