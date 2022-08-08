const express = require('express')
const recordRouter = express.Router()
const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')

const authenticateUser = (req, res, next) => {
    if (req.body.key == "hello") {
        next()
    } else {
        res.send("Key Required")
    }
}


recordRouter.route('/').get(function (req, res) {
    res.send("ARHEX API")
})

recordRouter.route('/user').post((req, response) => {
    let connect = dbo.getDb();
    let data = req.body
    connect.collection("users").insertOne(data, (err, res) => {
        if (err) {
            throw err
        }
        response.json(res)
    })
})

recordRouter.route('/user').get(authenticateUser, (req, res) => {
    let connect = dbo.getDb()
    connect.collection("users").find({}).toArray((err, result) => {
        if (err) throw err
        res.json(result)
    })
})

recordRouter.route('/user/:id').get((req, res) => {
    let connect = dbo.getDb()
    connect.collection("users").findOne({ _id: ObjectId(req.params.id) }, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})

recordRouter.route('/user/:id').delete((req, res) => {
    let connect = dbo.getDb()
    connect.collection("users").deleteOne({ _id: ObjectId(req.params.id) }, (err, response) => {
        if (err) throw err
        res.json(response)
    })
})

recordRouter.route('/user/:id').put((req, res) => {
    let connect = dbo.getDb()
    let data = {
        $set: req.body
    }
    connect.collection("users").updateOne({ _id: ObjectId(req.params.id) }, data, (err, response) => {
        if (err) throw err
        res.json(response)
    })
})

module.exports = recordRouter