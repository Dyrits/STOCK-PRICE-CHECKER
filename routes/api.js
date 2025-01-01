'use strict';
const crypto = require('crypto');

const likes = {}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function ({ query, ip }, response){
      const { stock, like } = query;
      if (Array.isArray(stock)) {
        const stockData = [];
        const stocks = stock.map(symbol => {
          likes[symbol] = likes[symbol] || new Set();
          like && likes[symbol].add(anonymize(ip));
          return { symbol, count: likes[symbol].size };
        });
        const average = Math.round(stocks.reduce((sum, { count }) => sum + count, 0) / stocks.length);
        for (const { symbol, count } of stocks) {
          const { latestPrice } = await api.get(symbol);
          stockData.push({ stock: symbol, price: latestPrice, rel_likes: count - average + Number(count >= average) });
        }
        response.json(stockData);
      } else {
        likes[stock] = likes[stock] || new Set();
        like && likes[stock].add(anonymize(ip));
        const { latestPrice } = await api.get(stock);
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
