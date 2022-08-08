const express = require('express')
// const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config({ path: "./config.env" })
const app = express()
const dbo = require('./db/conn')
var port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.use(require('./routes/record'))

app.listen(port, () => {
    dbo.connetDb(function (err) {
        if (err) {
            console.error(err)
        }
    })
    console.log(`Server Started: http://localhost:${port}`)
})