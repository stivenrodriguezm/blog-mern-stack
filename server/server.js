const express = require('express')
const app = express()
const expressValidator = require('express-validator')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const cors = require('cors')
const routes = require('./routes/routes')
const usersRoutes = require('./routes/usersRoutes')
const blogRoutes = require('./routes/blogRoutes')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
require('dotenv').config()

PORT = process.env.PORT || 5000

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("DB connected"))

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
})
//middlewares
app.use(expressValidator())
app.use(morgan('dev'))
//app.use(express.json())
app.use(bodyparser.json())
app.use(cors())


//routes
app.use("/", routes)
app.use("/auth", usersRoutes)
app.use("/blog", blogRoutes)

app.listen(PORT, console.log(`Connected on port ${PORT}`))