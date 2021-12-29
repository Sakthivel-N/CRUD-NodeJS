const res = require("express/lib/response")
const nano = require("nano")

exports.create = (req,res)=>{
    nano.db.create(req.body.dbname,(err)=>{
        if(err){
            res.send("Eroor creating DB")
            return
        }
        res.send("DB connected")
    })
}