const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { cache } = require('../database/redis');
const app = require('../../app'); // Assuming your Express app is exported from 'app.js'
const Movie = require('../models/movies');

const { expect } = chai;

chai.use(chaiHttp);

describe('Movies API', () => {
  before((done) => {
    // Connect to a test database
    mongoose.connect('mongodb://localhost/testDB', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
      done();
    });
  });

  after((done) => {
    // Disconnect from the test database after tests
    mongoose.disconnect(() => {
      done();
    });
  });

  beforeEach((done) => {
    // Clear the database and cache before each test
    Movie.deleteMany({}, (err) => {
      cache.del('movies');
      done();
    });
  });

  describe('POST /movies', () => {
    it('should create a new movie', (done) => {
      chai.request(app)
        .post('/movies')
        .send({ title: 'Inception', genre: 'Sci-Fi', year: 2010 })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.equal('Inception');
          expect(res.body.genre).to.equal('Sci-Fi');
          expect(res.body.year).to.equal(2010);
          done();
        });
    });

    it('should return an error for missing title or genre', (done) => {
      chai.request(app)
        .post('/movies')
        .send({ year: 2010 }) // Missing title and genre
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body.error_code).to.equal('BAD_REQUEST');
          expect(res.body.error).to.equal('title or genre is missing!');
          done();
        });
    });
  });

  describe('GET /movies', () => {
    it('should get all movies from the database', (done) => {
      // Assuming you have a Movie record in the database
      const movie = new Movie({ title: 'Inception', genre: 'Sci-Fi', year: 2010 });
      movie.save((err, savedMovie) => {
        chai.request(app)
          .get('/movies')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0].title).to.equal('Inception');
            expect(res.body[0].genre).to.equal('Sci-Fi');
            expect(res.body[0].year).to.equal(2010);
            done();
          });
      });
    });

    it('should retrieve movies from cache on subsequent requests', (done) => {
      // Assuming you have a Movie record in the database
      const movie = new Movie({ title: 'Inception', genre: 'Sci-Fi', year: 2010 });
      movie.save((err, savedMovie) => {
        chai.request(app)
          .get('/movies')
          .end((err, firstRes) => {
            expect(firstRes).to.have.status(200);
            expect(firstRes.body).to.be.an('array');
            expect(firstRes.body).to.have.lengthOf(1);
            expect(firstRes.body[0].title).to.equal('Inception');
            expect(firstRes.body[0].genre).to.equal('Sci-Fi');
            expect(firstRes.body[0].year).to.equal(2010);

            // Modify the movie in the database
            Movie.findByIdAndUpdate(savedMovie._id, { year: 2021 }, { new: true }, (err, updatedMovie) => {
              chai.request(app)
                .get('/movies')
                .end((err, secondRes) => {
                  expect(secondRes).to.have.status(200);
                  expect(secondRes.body).to.be.an('array');
                  expect(secondRes.body).to.have.lengthOf(1);
                  expect(secondRes.body[0].title).to.equal('Inception');
                  expect(secondRes.body[0].genre).to.equal('Sci-Fi');
                  expect(secondRes.body[0].year).to.equal(2010); // Still old data from cache

                  done();
                });
            });
          });
      });
    });
  });

  describe('PATCH /movies/:id', () => {
    it('should update an existing movie', (done) => {
      const movie = new Movie({ title: 'Inception', genre: 'Sci-Fi', year: 2010 });
      movie.save((err, savedMovie) => {
        chai.request(app)
          .patch(`/movies/${savedMovie._id}`)
          .send({ year: 2021 })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.title).to.equal('Inception');
            expect(res.body.genre).to.equal('Sci-Fi');
            expect(res.body.year).to.equal(2021);
            done();
          });
      });
    });

    it('should return an error if movie is not found', (done) => {
      chai.request(app)
        .patch('/movies/nonexistent-id')
        .send({ year: 2021 })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('Movie not found.');
          done();
        });
    });
  });

  describe('DELETE /movies/:id', () => {
    it('should delete an existing movie', (done) => {
      const movie = new Movie({ title: 'Inception', genre: 'Sci-Fi', year: 2010 });
      movie.save((err, savedMovie) => {
        chai.request(app)
          .delete(`/movies/${savedMovie._id}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.title).to.equal('Inception');
            expect(res.body.genre).to.equal('Sci-Fi');
            expect(res.body.year).to.equal(2010);
            done();
          });
      });
    });

    it('should return an error if movie is not found', (done) => {
      chai.request(app)
        .delete('/movies/nonexistent-id')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('Movie not found.');
          done();
        });
    });
  });
});
