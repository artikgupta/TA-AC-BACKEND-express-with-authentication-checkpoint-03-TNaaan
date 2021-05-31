var express = require('express');
var router = express.Router();

var User = require("../models/User")
var Expense = require("../models/Expense")


router.get("/create", (req,res,next)=>{
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
      if(err) return next(err);
      return res.render("createExpense")
    })
})

router.post("/create", (req, res, next)=>{
    const {userId} = req.session;
  User.findById(userId, (err, user) => {
    if(err) return next(err);
    Expense.create(req.body, (err, expense) => {
      Expense.findByIdAndUpdate(
        expense.id,{$push:{referenceToUser:user.id}},
        {new:true}, (err, expense)=>{
          console.log(err, req.body);
          if (err) return next(err);
          res.redirect('/onboarding');
        }
      )
    });
  })
})



router.get("/:id/edit", (req,res,next)=>{
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
    if(err) return next(err);
    let id = req.params.id;
    Expense.findById(id,(err, expense)=>{
      if(err) return next(err)
      res.render("updateExpense", {expense})
    })
  })
  })

  router.post("/:id/edit", (req,res,next)=>{
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
      if(err) return next(err);
    let id = req.params.id;
    Expense.findByIdAndUpdate(id, req.body, { new: true }, (err, expense) => {
      if (err) next(err);
      res.redirect('/onboarding');
    })
  })
  })


  router.get("/:id/delete", (req,res,next)=>{
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
    if(err) return next(err);
    let id = req.params.id;
    Expense.findByIdAndDelete(id,(err, income)=>{
      if(err) return next(err)
      res.redirect("/onboarding")
    })
  })
  })




module.exports = router;
