const express = require('express');
const router = express.Router();
const Movie = require('../models/movies');
const { cache } = require('../database/redis');

// Create
router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    // Clear cache
    cache.del('movies');

    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read
router.get('/', async (req, res) => {
  try {
    // Check if data is in the cache
    const cachedData = await cache.get('movies');
    if (cachedData) {
      console.log('Data retrieved from cache');
      return res.json(cachedData);
    }

    // If not in cache, fetch from database
    const movies = await Movie.find().lean();

    // Store data in cache
    cache.set('movies', movies);

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 *  Patch API to update the Movie using id
 *  Note: 
 *  To handle concurrency, I have used transactions to lock the records during an update. 
 *  This prevents other transactions from modifying the same records concurrently.
 */
router.patch('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const movie = await Movie.findById(req.params.id).session(session);

    if (!movie) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Movie not found.' });
    }

    // Modify movie data here

    await movie.save({ session });

    // Clear cache
    cache.del('movies');

    await session.commitTransaction();
    session.endSession();

    res.json(movie);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});


// Delete
router.delete('/:id', async (req, res) => {
  try {
    // remove the cached data
    const movie = await Movie.findByIdAndDelete(req.params.id);

    // Clear cache
    cache.del('movies');

    res.json(movie);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;

