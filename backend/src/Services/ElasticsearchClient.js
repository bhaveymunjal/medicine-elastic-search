const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const client = new Client({
  node: process.env.ELASTIC_SEARCH_URL,
  auth: {
    apiKey: process.env.ELASTIC_SEARCH_API_KEY,
  },
});

module.exports = client;
