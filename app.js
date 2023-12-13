const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const moviesRouter = require('./src/routes/movies');
const connectToDatabase = require('./src/database/mongoose');
const authenticateRequest = require('./src/middleware/authMiddleware');
const PORT = process.env.PORT || 3000;

// Connect to the database
connectToDatabase();

const app = express();

app.use(bodyParser.json());

// Use the authentication middleware
app.use(authenticateRequest);

app.use('/movies', moviesRouter);
app.get('/', (req, res) => {
    res.send({
        service: "movie-management-svc",
        status: true
    });
});

app.listen(PORT, () => {
    console.log(`*`.repeat(30));
    console.log(`Server is running on port ${PORT}`);
    console.log(`*`.repeat(30));
});
