const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, index: true },
  genre: { type: String, index: true },
  year: { type: Number, index: true }
});

module.exports = mongoose.model('Movie', movieSchema);
