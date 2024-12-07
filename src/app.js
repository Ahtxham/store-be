require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const GeneralHelper = require('#Services/GeneralHelper.js');
const routes = require('./Routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static files
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));

// Routes
app.use('/', routes);

// Error Handling
app.use(errorHandler.notFound);
app.use(errorHandler.internalServerError);

module.exports = app;
