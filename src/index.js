const { server } = require('./server');
const { connectToDatabase } = require('./db');
const { setupSocket } = require('./socket');

// Database setup
connectToDatabase();
// Server setup
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log('\x1b[35m%s\x1b[0m', `Serving on port ${port}`);
});
// Socket setup
setupSocket(server);
