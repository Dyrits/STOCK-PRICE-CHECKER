'use strict';
const crypto = require('crypto');
const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const file = join(__dirname, "../data", process.env.NODE_ENV === "test" ? "test-likes.json" : "likes.json");

function read() {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function write(likes) {
  const $likes = {};
  for (const [key, value] of Object.entries(likes)) {
    $likes[key] = Array.from(value);
  }
  writeFileSync(file, JSON.stringify($likes, null, 2));
}


module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function ({ query, ip }, response){
      console.log(query, ip);
      let { stock, like } = query;
      like = like === "true";
      const likes = read();
      if (Array.isArray(stock)) {
        const stockData = [];
        const stocks = stock.map(symbol => {
          likes[symbol] = Array.isArray(likes[symbol]) ? new Set(likes[symbol]) : new Set();
          like && likes[symbol].add(anonymize(ip));
          return { symbol, count: likes[symbol].size };
        });
        const difference = stocks[0].count - stocks[1].count;
        for (const { symbol, count } of stocks) {
          const { latestPrice } = await api.get(symbol);
          stockData.push({ stock: symbol, price: latestPrice, rel_likes: symbol === stocks[0].symbol ? difference : -difference });
        }
        write(likes);
        response.json({ stockData });
      } else {
        likes[stock] = Array.isArray(likes[stock]) ? new Set(likes[stock]) : new Set();
        like && likes[stock].add(anonymize(ip));
        const { latestPrice } = await api.get(stock);
        write(likes);
        response.json({ stockData: { stock, price: latestPrice, likes: likes[stock].size } });
      }
    })
};

const api = {
  async get(symbol) {
    const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`);
    return await response.json();
  }
}

function anonymize(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

