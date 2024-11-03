const client = require("../Services/ElasticsearchClient");

const getAllMedicines = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const from = (page - 1) * size;

  try {
    const result = await client.search({
      index: "medicines",
      body: {
        query: {
          match_all: {},
        },
      },
      from: from,
      size: size,
    });

    res.json({
      page,
      size,
      total: result.hits.total.value,
      medicines: result.hits.hits.map((hit) => hit._source),
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ error: "Failed to fetch medicines" });
  }
};

const getMedicineById = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const result = await client.get({
      index: "medicines",
      id: id,
    });
    console.log("Elasticsearch response:", result);
    if (!result.found) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    res.json(result._source);
  } catch (error) {
    console.error("Error fetching medicine:", error);
    res.status(500).json({ error: "Failed to fetch medicine" });
  }
};

const searchMedicines = async (req, res) => {
  const { query } = req.query;
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const from = (page - 1) * size;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // const result = await client.search({
    //   index: "medicines",
    //   body: {
    //     query: {
    //       multi_match: {
    //         query: query,
    //         fields: ["name"],
    //       },
    //     },
    //   },
    //   from: from,
    //   size: size,
    // });
    const result = await client.search({
      index: "medicines",
      body: {
        query: {
          bool: {
            should: [
              { prefix: { name: query } },
              { match: { name: query } },
            ],
          },
        },
      },
      from: from,
      size: size,
    });
    

    res.json({
      page,
      size,
      total: result.hits.total.value,
      medicines: result.hits.hits.map((hit) => hit._source),
    });
  } catch (error) {
    console.error("Error searching medicines:", error);
    res.status(500).json({ error: "Failed to search medicines" });
  }
};

module.exports = {
  getAllMedicines,
  getMedicineById,
  searchMedicines,
};
