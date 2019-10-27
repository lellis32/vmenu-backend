'use strict'

import cors from 'cors';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import errorHandler from 'errorhandler';
import superagent from 'superagent';


const app = express();
const router = express.Router();

// env variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("Mongo URI: " + MONGODB_URI);

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {
    dbName: 'mydb'
}).catch(error => console.log(error));
mongoose.set('debug', true);

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json(),cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(errorHandler());

require('../models/user');
require('../middleware/passport');
app.use(require('../routes'));

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        errors: {
        message: err.message,
        error: {},
        },
    });
});

export const start = () => {
  app.listen(PORT, () =>{
    console.log(`Listening on port: ${PORT}`)
  })
}

export const stop = () => {
  app.close(PORT, () => {
    console.log(`Shut down on port: ${PORT}`)
  })
}