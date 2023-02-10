const express = require("express");

const dotenv = require('dotenv')

const cookieParser = require("cookie-parser");

const app = express();

const mongoose = require("mongoose");

const cors = require("cors");


dotenv.config()

mongoose.Promise = global.Promise;

mongoose.set("strictQuery", false);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Database connected sucessfully ");
    })
    .catch((error) => {
        console.log("Database could not connected: " + error);
    });

app.use(express.json());

app.use(cors());

app.use(cookieParser());

const cpmpressPdfRoute = require('./routes/compresspdf.route')


app.use('/api/compresspdf', cpmpressPdfRoute)

app.get("*", (req, res) => {
    res.send("Not-found!");
});

// start the server
const port = process.env.PORT || 4010;
app.listen(port, () => {
    console.log("Server is running on port " + port);
});

app.use((err, req, res, next) => {
    console.log(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
