const fs = require("fs");
const csv = require("csv-parser");
const client = require("../Services/ElasticsearchClient");

async function uploadData() {
  await client.indices.create(
    {
      index: "medicines",
      body: {
        mappings: {
          properties: {
            id: { type: "integer" },
            name: { type: "text"},
            price: { type: "float" },
            is_discontinued: { type: "boolean" },
            manufacturer_name: { type: "text" },
            type: { type: "text" },
            pack_size_label: { type: "text" },
            short_composition1: { type: "text" },
            short_composition2: { type: "text" },
          },
        },
      },
    },
    { ignore: [400] }
  );

  fs.createReadStream(`${__dirname}/../Data/indian_medicine_data.csv`)
    .pipe(csv())
    .on("data", async (row) => {
      const formattedRow = {
        id: parseInt(row.id, 10),
        name: row.name,
        price: parseFloat(row["price(₹)"]),
        is_discontinued: row.Is_discontinued.toLowerCase() === "yes",
        manufacturer_name: row.manufacturer_name,
        type: row.type,
        pack_size_label: row.pack_size_label,
        short_composition1: row.short_composition1,
        short_composition2: row.short_composition2,
      };

      await client.index({
        index: "medicines",
        id: formattedRow.id,
        body: formattedRow,
      });
    })
    .on("end", () => {
      console.log("CSV data has been uploaded to Elasticsearch.");
    });
}

uploadData().catch(console.error);
