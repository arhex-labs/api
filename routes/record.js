const express = require('express')
const recordRouter = express.Router()
const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')

const authenticateUser = (req, res, next) => {
    let connect = dbo.getDb()
    connect.collection("tokens").findOne({ api_key: req.body.api_key, secret_key: req.body.secret_key }, (err, result) => {
        if (err) throw err
        if (result == null) {
            res.send("Invalid api_key or secret_key")
        } else {
            delete req.body.api_key
            delete req.body.secret_key
            next()
        }
    })
}


recordRouter.route('/').get(function (req, res) {
    res.send("ARHEX API")
})

recordRouter.route('/user').post(authenticateUser, (req, response) => {
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

recordRouter.route('/user/:id').get(authenticateUser, (req, res) => {
    let connect = dbo.getDb()
    connect.collection("users").findOne({ _id: ObjectId(req.params.id) }, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})

recordRouter.route('/user/:id').delete(authenticateUser, (req, res) => {
    let connect = dbo.getDb()
    connect.collection("users").deleteOne({ _id: ObjectId(req.params.id) }, (err, response) => {
        if (err) throw err
        res.json(response)
    })
})

recordRouter.route('/user/:id').put(authenticateUser, (req, res) => {
    let connect = dbo.getDb()
    let data = {
        $set: req.body
    }
    connect.collection("users").updateOne(authenticateUser, { _id: ObjectId(req.params.id) }, data, (err, response) => {
        if (err) throw err
        res.json(response)
    })
})

module.exports = recordRouter