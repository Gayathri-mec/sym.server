const express=require('express')
const bodyparser=require('body-parser')
const mysql=require('mysql2')
const cors = require('cors')
const app=express()
app.use(cors())
app.use(express.json())

const port = 2020

const database=mysql.createConnection({
    host:"localhost",
    database:"symposium",
    user:"root",
    password:"12345"
})
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

database.connect(()=>{
    console.log('database is connected')
})


app.listen(port,(err)=>{
    console.log("web is connecting")
})
app.get('/list',async(req,res)=>{
    const sql="select*from information"
    database.query(sql,(err,records)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(records==0){
            res.status(404).json({message:"no records are there"})
            return
        }
        res.status(200).json({records})

    })

})


//put
app.put('/change/:id',async(req,res)=>{
    const{fristname,lastname,email,phonenumber,curr_year,college}=req.body
    const sql="update information set fristname=?,lastname=?,email=?,phonenumber=?,curr_year=?,college=? where id=?;"
    database.query(sql,[fristname,lastname,email,phonenumber,curr_year,college,req.params.id],(err,records)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }

        res.status(200).json({message:"updated"})
        return
    })
})
app.put('/change/:id',async(req,res)=>{
    const sql="UPDATE information SET fristname=?,lastname=?,email=?,phonenumber=?,curr_year=?,college=? where id=?;"
    const id =req.params.id
    database.query(sql,[req.body.fristname,req.body.lastname,req.body.email,req.body.phonenumber,req.body.curr_year,req.body.college,id],
        (err,result)=>{
    if(err) return res.json({Message:"Error"})
    return res.json(result)
       })
})


//post

app.post('/new',async(req,res)=>{
    const{fristname,lastname,id,email,phonenumber,curr_year,college}=req.body
    const sql="insert into information values(?,?,?,?,?,?,?)"
    database.query(sql,[fristname,lastname,id,email,phonenumber,curr_year,college],(err,records)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }

        res.status(200).json({message:"result.students has added"})
    
    })
})

//delete

app.delete('/remove/:key',async(req,res)=>{
    const sql="delete from information where id=?"
    database.query(sql,[req.params.key],(err,ack)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(ack.affectedrows==0){
            req.status(404).json({message:"records not found"})
        }

        res.status(200).json({message:"details has deleted"})
    })
})