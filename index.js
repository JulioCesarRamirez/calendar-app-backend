const express = require('express');
const { dbConnection } = require('./db/config');
const cors = require('cors');
require('dotenv').config();

const app = express();

// DB
dbConnection();

// Cors
app.use(cors());

// Static
app.use(express.static('public'));

app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
