var express = require ('express')
var routes = require('./routes')
var http = require('http')
var path = require ('path')
var urlencoded = require ('url')
var bodyparser = require ('body-parser')
var logger = require ('logger')
var methodoveride = require('method-override')
var nano = require('nano')('http://localhost:5948')

var db=nano.use('address')
var app=express()
app.set('port',process.env.PORT || 3000)
app.set('views',path.join(__dirname,'views'))
app.set('view engine','jade')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded)
app.use(methodoveride())
app.use(express.static(path.join(__dirname,'public')))

app.get('/',routes.index)
app.post('/createdb',(req,res)=>{
    nano.db.create(req.body,dbname,(err)=>{
        if(err){
            res.send("Error in create db"+req.body.dbname)
            return
        }
        res.send("database"+req.body.dbname+"created success!!")

    })
})
app.post('/new_contact',(req,res)=>{
    var name=req.body.name
    var phone = req.body.phone
    db.insert({name:name,phone:phone,crazy:true},phone,(err,body,header)=>{
        if(err){
            res.send("Error creating contact")
            return

        }
        res.send("contact saved")
    })
})


app.post('/view_contact',(req,res)=>{
    var alldoc = "Allowing the contacts"
    db.get(req.body.phone,{revs_info:true},(err,body)=>{
        if(!err){
            console.log(body)
        }
        if(body){
            alldoc += "name: "+body.name+"<br/>phone : "+body.phone
        }
        else{
            alldoc = "No Records"
        }
        res.send(alldoc)
    })
})

app.post('/delete_contact',(req,res)=>{
    db.get(req.body.phone,{revs_info:true},(err,body)=>{
        if(!err){
            db.destroy(req.body.phone,body._rev,(err,body)=>{
                if(err){
                    res.send("error delete contact")
                }
            })
            res.send("Contacts delete sucess !!")
        }
    })
})

http.createServer(app).listen(app.get('port'),()=>{
    console.log("listening port"+app.get('port') )
})


