var express = require('express');
var router = express.Router();

var User = require("../models/User")
var Income = require("../models/Income")


router.get("/create", (req,res,next)=>{
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
      if(err && !user) return next(err);
      return res.render("createIncome")
    })
})


router.post("/create", (req, res, next)=>{
    const {userId} = req.session;
  User.findById(userId, (err, user) => {
    if(err) return next(err);
    Income.create(req.body, (err, income) => {
      Income.findByIdAndUpdate(
        income.id,
        { $push: { referenceToUser: user.id } },
        { new: true },(err, income) => {
          if (err) return next(err);
         res.redirect("/onboarding")
        }
      )
    });
  })
})


// edit


router.get("/:id/edit", (req,res,next)=>{
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
    if(err) return next(err);
    let id = req.params.id;
    Income.findById(id,(err, income)=>{
      if(err) return next(err)
      res.render("updateIncome", {income})
    })
  })
  })

  router.post("/:id/edit", (req,res,next)=>{
    const {userId} = req.session;
    User.findById(userId, (err, user) => {
      if(err) return next(err);
    let id = req.params.id;
    Income.findByIdAndUpdate(id, req.body, { new: true }, (err, income) => {
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
    Income.findByIdAndDelete(id,(err, income)=>{
      if(err) return next(err)
      res.redirect("/onboarding")
    })
  })
  })



module.exports = router;
