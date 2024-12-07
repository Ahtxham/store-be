
const express = require('express');
const router = express.Router();

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

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

router.use('/api/auth', authRoutes);
router.use('/api/file', fileRoutes);
router.use('/api/items', itemRoutes);
router.use('/api/stocks', stockRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/tables', tableRoutes);
router.use('/api/users', userRoutes);
router.use('/api/role', roleRoutes);
router.use('/api/migration', migrationRoutes);
router.use('/api/contact', contactRoute);
router.use('/api/reciepts', recieptsRoute);
router.use('/api/deals', dealsRoute);

module.exports = router;