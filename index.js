const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.DB_PASS;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("product-seling");
    const productCollection = db.collection("products");

    // ✅ POST API – ফর্ম থেকে ডাটা আসবে আর DB-তে যাবে
    app.post("/addProduct", async (req, res) => {
      try {
        const product = {
          ...req.body,
          date: new Date().toLocaleDateString("en-US"),
        };

     

        const result = await productCollection.insertOne(product);
        res
          .status(201)
          .json({ message: "Product added", productId: result.insertedId });
      } catch (error) {
    
        res.status(500).json({ message: "Failed to add product" });
      }
    });

    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;
  
      try {
        const product = await productCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send(product);
      } catch (err) {
        res.status(500).send({ message: "Product not found" });
      }
    });

    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

   
  } catch (error) {
    
  }
}
// GET product by id
// gdsgdgh

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
