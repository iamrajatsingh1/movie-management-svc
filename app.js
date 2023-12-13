const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const moviesRouter = require('./src/routes/movies');
const connectToDatabase = require('./src/database/mongoose');
const authenticateRequest = require('./src/middleware/authMiddleware');
const PORT = process.env.PORT || 3000;

// Connect to the database
connectToDatabase();

const app = express();

// Enable CORS for a specific origin
const corsOptions = {
    origin: 'https://movie-management-dashboard.com', //example FE url
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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
