const dotenv=require('dotenv');
const express= require("express");
const app=express();
const cors=require("cors");
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("This is CareForce Server");
})

app.listen(port,()=>{
    console.log("Server is running at the port : ",port);
})