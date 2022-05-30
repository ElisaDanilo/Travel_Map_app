const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const app = express();
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");


dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL, 
    {useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(()=>{
console.log("MongoBD connected");

}).catch(err=>console.log(err));

app.use(cors())
app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(8800,()=>{
    console.log("Backend server is working");
})