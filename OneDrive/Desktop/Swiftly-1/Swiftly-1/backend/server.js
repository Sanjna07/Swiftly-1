const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 REPLACE WITH YOUR ACTUAL LINK
 mongoose.connect("mongodb+srv://admin:admin123@cluster.hao7ajf.mongodb.net/?appName=Cluster")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send("API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const parkingRoutes = require('./routes/parkingroutes');

app.use('/api/parking', parkingRoutes);