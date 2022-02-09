const express = require('express')
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose')
//Import Routes
const authRoutes = require('./routes/userRouter')
const postRoutes = require('./routes/post')

dotenv.config();

//Connect to DB
mongoose.connect(process.env.Database, { useNewUrlParser: true }, () =>
 console.log('Connected to DB!')
 );

//Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user', authRoutes);
app.use('/api/post', postRoutes );

app.listen(process.env.PORT, ()=> console.log('Server running'));

