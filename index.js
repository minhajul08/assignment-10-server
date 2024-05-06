const express = require ('express');
const cors = require ('cors');
require ('dotenv').config ();
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const app = express ();
const port = process.env.PORT || 5000;

// middleware
app.use (cors ());
app.use (express.json())
// added some desing


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.01tlpf1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const TouristCollection =client.db ('Tourist').collection ('touristSpot');
   

    app.post ('/addTouristSpot', async (req,res)=>{
      const tourist = req.body
      console.log (tourist)
      const result = await TouristCollection.insertOne (tourist)
      res.send (result);
    })
     
    app.get ('/addTouristSpot', async (req,res) => {
      const cursor = TouristCollection.find ()
      const result = await cursor.toArray ();
      res.send (result)
     })
     
     app.get ("/myList/:email", async (req,res) => {
       console.log (req.params.email)
       const result = await TouristCollection.find ({email:req.params.email}).toArray ();
       res.send (result)
     })
     
     app.get ("/spots/:id", async (req,res) => {
      console.log (req.params.id)
      const result = await TouristCollection.findOne ({_id: new ObjectId (req.params.id), 
      });
      console.log (result)
      res.send (result)
     })

     app.put ("/update/:id", async (req,res) => {
       const id = req.params.id;
       const filter = {_id: new ObjectId (id)}
       const options ={upset:true};
       const spotUpdated = req.body;
      const updated = {
        $set: {
          spot: spotUpdated .spot,
          country : spotUpdated.country,
          season: spotUpdated.season,
          cost : spotUpdated.cost,
          location : spotUpdated.location,
          description : spotUpdated.description,
          visitor : spotUpdated.visitor,
          time : spotUpdated.time,
          name : spotUpdated.name,
          email : spotUpdated.email,
           photo: spotUpdated.photo,

        }
      }
      const result = await TouristCollection.updateOne (filter, updated, options);
      res.send (result);

     })


     app.delete ('/delete/:id',async (req,res) => {
      const result = await TouristCollection.deleteOne ({_id: new ObjectId (req.params.id)})
      console.log (result);
      res.send (result)
     })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get ('/', (req,res)=> {
    res.send ("assignment 10 server is Running")
})

app.listen (port, () => {
    console.log (`Assignment 10 server is running on port, ${port}`)
})