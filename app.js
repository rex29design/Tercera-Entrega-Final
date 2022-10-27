const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const users = require("./routes/user")
const products = require("./routes/products")
const Product = require("./models/product")
const Cart = require("./models/cart")
const shoppingCart = require("./routes/cart")
require("dotenv").config()

//Pino
const logger = require("pino")()
logger.level = "info"
//

const app = express()
const db = new Product("productos.json")
const dcart = new Cart("mycart.json")

// EJS config:
app.set("views", "./views")
app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
//-----------

app.use(express.static(path.join(__dirname, "public")))

//DOTENV:
const mongo_uri = process.env.MONGO_URI
const PORT = process.env.PORT || 8080
//-----------

//MongoDB:
mongoose.connect(mongo_uri,function(err) {
    if (err) {
        throw err
    } else {
        logger.info("Successfully connected to DB");
    }
})
//----------

//Routes:

app.use("/", users)

app.use("/products", products)

app.use("/cart", shoppingCart)

//Update product
app.post('/update-products', (req, res) => {
    console.log(req)
    db.update(req.body)
        .then(() => res.redirect('/products'))
        .catch(e => {
            logger.error("There was an error",e);
            res.send('Error to save')
        })
})

//Get product by Id
app.get("/update/:id", async(req, res) => {
    const data = await db.getOneData(req.params.id)
    res.render("form_update", {data})
})


//Delete product
app.post("/delete-products", (req, res) => {
    db.deleteById(req.body.id)
        .then(() => res.redirect("/products"))
        .catch(e => {
            logger.error("There was an error",e);
            res.send("Error to delete")
        })
})
//Delete product from Cart
app.post("/delete-from-cart", (req, res) => {
    dcart.deleteById(req.body.id)
        .then(() => res.redirect("/cart"))
        .catch(e => {
            logger.error("There was an error",e);
            res.send("Error to delete")
        })
})
//Thank You Page - Checkout
app.get("/checkout", (req, res) => {
    res.render("checkout-mail")
})

//----------

//Server:
server = app.listen(PORT, () => {
    logger.info("Server running...");
})
server.on("error", e => {
    logger.error("There was an error",e);
})