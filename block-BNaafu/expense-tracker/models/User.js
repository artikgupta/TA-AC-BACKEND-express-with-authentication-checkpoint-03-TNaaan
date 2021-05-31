var mongoose =require("mongoose");

var bcrypt = require("bcrypt")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:{type:String, required:true},
    password:{type:String},
    age:{type:Number},
    phone:{type:Number},
    country:{type:String},
    email: { type: String, required: true, unique: true},
    github: {
      name: String,
      username: String,
      image: String
    },
    google: {
      name: String,
      image: String
    },
    providers: [String] 
  })

  UserSchema.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
      bcrypt.hash(this.password, 10, (err, hashed) => {
        if (err) next(err);
        this.password = hashed;
        return next();
      });
    } else {
      next();
    }
  });
  
  UserSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
      return cb(err, result);
    });
  };

  var User = mongoose.model('User', UserSchema);

  module.exports = User;