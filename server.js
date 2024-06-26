require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connection = require('./db_config');
const userRoute = require('./routes/user');


const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user',userRoute);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});