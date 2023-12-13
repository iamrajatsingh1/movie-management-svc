const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, index: true },
  genre: { type: String, index: true },
  year: { type: Number, index: true },
  version: { type: Number, default: 0 },
});

module.exports = mongoose.model('Movie', movieSchema);
