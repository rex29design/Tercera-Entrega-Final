const express = require("express")
const { Router } = express
const Product = require("../models/product")

const products = Router()

const db = new Product("productos.json")


//Get data products
products.get('/', (req, res) => {
    db.getData()
        .then( data => res.render('products', { data } ))
        .catch(e => {
            console.log(e);
            res.send('Error to load data')
        })
})
    
//Save products
products.post('/', (req, res) => {
    db.save(req.body)
        .then(() => res.redirect("user-login.html"))
        .catch(e => {
            console.log(e);
            res.send('Error to save')
        })
})



module.exports = products