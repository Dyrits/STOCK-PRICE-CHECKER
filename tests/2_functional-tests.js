const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

/*
Viewing one stock: GET request to /api/stock-prices/
Viewing one stock and liking it: GET request to /api/stock-prices/
Viewing the same stock and liking it again: GET request to /api/stock-prices/
Viewing two stocks: GET request to /api/stock-prices/
Viewing two stocks and liking them: GET request to /api/stock-prices/
 */

suite('Functional Tests', function() {
  // The tests will update the likes object in the routes/api.js file but using the same IP address for all requests.

  after(function (done) {
    // Reset likes.json file to default
    const { writeFileSync } = require("fs");
    const { join } = require("path");
    writeFileSync(join(__dirname, "../data", "test-likes.json"), JSON.stringify({}, null, 2));
    done();
  });

  it("Viewing one stock: GET request to /api/stock-prices/", function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: 'GOOG' })
      .end(function(error, response){
        assert.equal(response.status, 200);
        assert.property(response.body, 'stockData');
        assert.property(response.body.stockData, 'stock');
        assert.property(response.body.stockData, 'price');
        assert.property(response.body.stockData, 'likes');
        done();
      });
  });

  it("Viewing one stock and liking it: GET request to /api/stock-prices/", function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: 'GOOG', like: true })
      .end(function(error, response){
        assert.equal(response.status, 200);
        assert.property(response.body, 'stockData');
        assert.property(response.body.stockData, 'stock');
        assert.property(response.body.stockData, 'price');
        assert.property(response.body.stockData, 'likes');
        assert.equal(response.body.stockData.likes, 1);
        done();
      });
  });

  it("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: 'GOOG', like: true })
      .end(function(error, response){
        assert.equal(response.status, 200);
        assert.property(response.body, 'stockData');
        assert.property(response.body.stockData, 'stock');
        assert.property(response.body.stockData, 'price');
        assert.property(response.body.stockData, 'likes');
        assert.equal(response.body.stockData.likes, 1);
        done();
      });
  });

  it("Viewing two stocks: GET request to /api/stock-prices/", function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: ['GOOG', 'AAPL'] })
      .end(function(error, response){
        assert.equal(response.status, 200);
        assert.isArray(response.body.stockData);
        assert.property(response.body.stockData[0], 'stock');
        assert.property(response.body.stockData[0], 'price');
        assert.property(response.body.stockData[0], 'rel_likes');
        assert.property(response.body.stockData[1], 'stock');
        assert.property(response.body.stockData[1], 'price');
        assert.property(response.body.stockData[1], 'rel_likes');
        done();
      });
  });

  it("Viewing two stocks and liking them: GET request to /api/stock-prices/", function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: ['GOOG', 'AAPL'], like: true })
      .end(function(error, response){
        assert.equal(response.status, 200);
        assert.isArray(response.body.stockData);
        assert.property(response.body.stockData[0], 'stock');
        assert.property(response.body.stockData[0], 'price');
        assert.property(response.body.stockData[0], 'rel_likes');
        assert.property(response.body.stockData[1], 'stock');
        assert.property(response.body.stockData[1], 'price');
        assert.property(response.body.stockData[1], 'rel_likes');
        assert.equal(response.body.stockData[0].rel_likes, 0);
        assert.equal(response.body.stockData[1].rel_likes, 0);
        done();
      });
  });
});
