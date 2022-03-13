import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'

import express from 'express'
import dbConnect from './config/dbConnect.js'
const PORT = process.env.PORT
const app = express()

import auth_routes from "./routes/auth.js"

//connect to database
dbConnect()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}));

//all the middles now
app.use('/api/v1/auth',auth_routes)


app.get('/',(req,res) =>{
    console.log("Hey there Action hands backend  is up and running")
    res.json({
        success:"lets Donate",
        token:"donate xxx"
    })
})

app.post('/',(req,res) =>{
    console.log("Post  to Action Hands")
   //processorEngine()
    console.log("...........................................................................")
    //console.log(req)
    console.log(req.body)
    
    res.json({
        success:"lets Donate",
        token:"donate xxx"
    })
})

try {
    app.listen(process.env.PORT || PORT,(req,res) =>{
        console.log(`Server is running on port: ${PORT}`)
    })

} catch (error) {
    console.log("Something went Wrong .. Shutting down the server ....")
    process.exit(1)
    
}









