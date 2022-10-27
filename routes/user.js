const express = require("express")
const { Router } = express
const bcrypt = require("bcrypt")
const User = require("../models/user")

const users = Router()

users.post("/register", (req, res) => {
    const {username, password} = req.body
    const user = new User({username, password})
    user.save(err => {
        if(err){
            res.render("error")
        } else {
            res.render("user-registered")
        }
    })
})

users.post("/authenticate", (req, res) => {
    const {username, password} = req.body
    User.findOne({username}, (err, user) => {
        if(err){
            res.render("error")
        } else if(!user){
            res.render("error")
        } else {
            user.isCorrectPassword(password, (err, result) => {
                if (err){
                    res.render("error")
                } else if(result){
                    res.redirect("/user-login.html")
                } else {
                    res.render("error")
                }
            })
        }
    })
})

module.exports = users