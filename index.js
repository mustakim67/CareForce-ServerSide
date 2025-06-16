const dotenv=require('dotenv').config();
const express= require("express");
const app=express();
const cors=require("cors");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.SECRET_KEY}@cluster0.xqfap2z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


app.use(cors());
app.use(express.json());


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

     const UserCollection = client.db('CareDB').collection('users');
     const PostCollection = client.db('CareDB').collection('posts');

      app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await UserCollection.insertOne(newUser);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const result = await UserCollection.find().toArray();
            res.send(result);
        });

        //send post to datbase
         app.post('/posts', async (req, res) => {
            const newPost = req.body;
            const result = await PostCollection.insertOne(newPost);
            res.send(result);
        })
        //get searched post from database 
        app.get('/posts', async (req, res) => {
            const search = req.query.search;
            const query = search? { postTitle: { $regex: search, $options: 'i' } }: {};
            const result = await PostCollection.find(query).toArray();
            res.send(result);
        });
        //delete post from database
        app.delete('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await PostCollection.deleteOne(query);
            res.send(result);
        })
        //update post in database
        app.patch('/posts/:id', async (req, res) => {
            const id = req.params.id;
        
            const filter = { _id: new ObjectId(id) };
            const updatedInfo = req.body;
            if (updatedInfo.deadline) {
        updatedInfo.deadline = new Date(updatedInfo.deadline);
    }
             console.log("Updating ID:", id);
            console.log("Update Data:", updatedInfo);
            const updatedDoc = {
                $set: updatedInfo
            }
            const result = await PostCollection.updateOne(filter, updatedDoc);
           
            res.send(result);
        })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}


run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("This is CareForce Server");
})

app.listen(port,()=>{
    console.log("Server is running at the port : ",port);
})
