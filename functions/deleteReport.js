// functions/deleteReport.js
const { CosmosClient } = require("@azure/cosmos");
const qs                  = require("querystring");

const client = new CosmosClient({
  endpoint: process.env.COSMOS_URI,
  key:      process.env.COSMOS_KEY
});
const container = client
  .database(process.env.COSMOS_DB)
  .container(process.env.COSMOS_CONTAINER);

exports.handler = async (event) => {
  try {
    const formData = qs.parse(event.body);
    const rID      = formData.rID;
    if (!rID) {
      return { statusCode: 400, body: "Missing rID" };
    }

    await container
      .item(rID, rID)
      .delete();

    return {
      statusCode: 204,
      body:       ""
    };
  } catch (err) {
    return {
      statusCode: 500,
      body:       JSON.stringify({ error: err.message })
    };
  }
};
