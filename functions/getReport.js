// functions/getReport.js
const { CosmosClient } = require("@azure/cosmos");
const client = new CosmosClient({
  endpoint: process.env.COSMOS_URI,
  key:      process.env.COSMOS_KEY
});
const container = client
  .database(process.env.COSMOS_DB)
  .container(process.env.COSMOS_CONTAINER);

exports.handler = async (event) => {
  try {
    const rID = event.queryStringParameters?.rID;
    if (!rID) {
      return { statusCode: 400, body: "Missing rID" };
    }

    const { resource: report } = await container
      .item(rID, rID)
      .read();

    return {
      statusCode: 200,
      body:       JSON.stringify(report)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body:       JSON.stringify({ error: err.message })
    };
  }
};
