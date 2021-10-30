// Require Express Js
const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectId;
// Port setup
const port = process.env.PORT || 8080;
// Cors require
const cors = require('cors');
// Require mongoDB
const { MongoClient } = require('mongodb');
// Configure dotenv
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// user : saif_rakib_1
// pass : BWfA9Jvzimtowak1

// Connect with mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzt4u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Create a new mongo client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connection in mongo
async function run() {
    try {
      await client.connect();
      const database = client.db("tourItems");
      const servicesCollection = database.collection("services");
      const orderCollection = database.collection("orders")
      // add services
      app.post("/addService", async(req,res) => {
          const result = await servicesCollection.insertOne(req.body);
          res.json(result);
      })

        //  Get all services
        app.get("/allServices", async (req, res) => {
            const allServices = await servicesCollection.find({}).toArray();
            res.json(allServices);
        });

         // GET Single Service
         app.get('/allServices/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        // Get order information
        app.post('/orders',async (req,res) => {
           const result = await orderCollection.insertOne(req.body);
           res.json(result);
           console.log(result);
        })

          //  Get all order
          app.get("/orders", async (req, res) => {
            const allOrders = await orderCollection.find({}).toArray();
            res.json(allOrders);
        });
         // GET Single order
         app.get('/orders/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const order = await orderCollection.findOne(query);
          res.json(order);

      })

        //UPDATE API
        app.put('/orders/:id', async (req, res) => {
          const id = req.params.id;
          const updatedOrder = req.body;
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                  status: updatedOrder.status
                  
              },
          };
          
          const result = await orderCollection.updateOne(filter, updateDoc, options)
          console.log('updating', id)
          res.json(result)
          console.log(req.body.status);
      })

              // Delete order
              app.delete('/deleteOrder/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = await orderCollection.deleteOne(query);
                res.json(result);
                console.log(result);
            })
      

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})