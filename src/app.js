const env = require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// helpers
const GeneralHelper = require('#Services/GeneralHelper.js');
// Required Routes
const authRoutes = require('#Routes/Auth.js');
const fileRoutes = require('#Routes/File.js');
const itemRoutes = require('#Routes/Item.js');
const stockRoutes = require('#Routes/Stock.js');
const orderRoutes = require('#Routes/Order.js');
const tableRoutes = require('#Routes/Table.js');
const userRoutes = require('#Routes/User.js');
const roleRoutes = require('#Routes/Role.js');
const categoryRoutes = require('#Routes/Category.js');
const migrationRoutes = require('#Routes/Migration.js');
const contactRoute = require('#Routes/Contact.js');
const recieptsRoute = require('#Routes/Reciept.js');
const dealsRoute = require('#Routes/Deal.js');

// Middlewears
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use(morgan('dev'));
app.use('/Uploads', express.static('Uploads'));
app.use('/Assets', express.static('Assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes which should handle requests
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/users', userRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/contact', contactRoute);
app.use('/api/reciepts', recieptsRoute);
app.use('/api/deals', dealsRoute);

// Default Route When nothing matches
app.use((req, res, next) => {
  const error = new Error('The route you are trying to access does not exist.');
  error.status = 404;
  next(error);
});

// handle internal server error
app.use((error, req, res, next) => {
  if (req.body.fileName) {
    GeneralHelper.deleteFileHelper(req.body.fileName);
  }

  res.status(error.status || 500);
  res.json({
    metadata: {
      responseCode: 500,
      success: false,
      message: 'Something went wrong, internal server error',
    },
    payload: {
      message: error.message,
      stack: error.stack.toString().split(/\r\n|\n/),
    },
  });
});

module.exports = app;
