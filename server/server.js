const debug = require('debug')('App:server');
const createError = require('http-errors');
const errorHandler = require('./middleware/error');
const express = require('express');
                require('express-async-errors');

              
const config = require('config');
const bodyParser= require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Joi = require('joi');
      Joi.objectid= require('joi-objectid')(Joi);

const app =  express();

const User = require('./Routes/user');
const Book = require('./Routes/book')

mongoose.connect(config.get('dbhost'), {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>{
            debug("successfully connected to mongobd" );
        })
        .catch(err => debug('failed to connect', config.get('dbhost')))


app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(bodyParser.json())
app.use(cookieParser());


app.use('/api', User)
app.use('/api', Book)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  }); 
  
  // error handler
app.use(errorHandler);

const port = process.env.PORT || 3001
app.listen(port, ()=>{
    debug(`App running at ${port}`)
})



  