const express = require('express');

const cors = require('cors');

const colors = require('colors');

const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

const connectDB = require('./config/db');

const userRoutes = require('./routes/user');

const cloudinary = require('cloudinary').v2;

const productRoutes = require('./routes/product');

 const cartRoutes = require('./routes/cart');

 const addressRoutes = require('./routes/address');

 const orderRoutes = require('./routes/order');

 const axios = require('axios');





dotenv.config();
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});





const app = express();
const url=`https://e-commerce2-8v6l.onrender.com`
const interval=8080

function reloadWebsite(){
  axios
  .get(url)
  .then((response)=>{
    console.log("Website reloaded successfully")
  })
  .catch((error)=>{
    console.log("Error reloading website",error.message)
  })
}
setInterval(reloadWebsite,interval)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());






app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', addressRoutes);
app.use('/api', orderRoutes);






const port = process.env.PORT || 8080;

app.listen(port, () => {

  console.log(`Server is running on port ${port}`.bgYellow);

});