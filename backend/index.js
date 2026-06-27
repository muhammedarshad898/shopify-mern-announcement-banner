const express = require("express");
const dotenv = require("dotenv");
const mongoose=require('mongoose')
const route=require('./Routes/route')
const cors=require('cors')

dotenv.config();

const app = express();
app.use(cors())

app.use(express.json());
app.use(route)

app.get("/", (req, res) => {
  res.send("Express server is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.DATABASE).then(()=>{
  console.log("server is connected to mongodb")
}).catch(err=>{
  console.log(err)
})