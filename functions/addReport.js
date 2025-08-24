// functions/addReport.js
const { CosmosClient } = require("@azure/cosmos");
const { v4: uuidv4 }     = require("uuid");
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
    // parse form‐encoded body
    const formData = qs.parse(event.body);
    const newReport = {
      id:           uuidv4(),             // Cosmos DB id
      rID:          uuidv4(),             // your own ID field
      rType:        formData.rType,
      rDesc:        formData.rDesc,
      rComments:    formData.rComments,
      rAppGroupID:  formData.rAppGroupID,
      rReportID:    formData.rReportID,
      rIcon:        formData.rIcon,
      rClass:       formData.rClass,
      rAccessMode:  Number(formData.rAccessMode),
      rStatus:      Number(formData.rStatus),
      rTags:        formData.rTags,
      rCategory:    formData.rCategory,
      rGroups:      Array.isArray(formData["rGroups[]"])
                     ? formData["rGroups[]"]
                     : formData["rGroups[]"]
                     ? [formData["rGroups[]"]]
                     : []
    };

    const { resource: created } = await container.items.create(newReport);

    return {
      statusCode: 201,
      body:       JSON.stringify(created)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body:       JSON.stringify({ error: err.message })
    };
  }
};
