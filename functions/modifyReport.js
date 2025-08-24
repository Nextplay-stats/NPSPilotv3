// functions/modifyReport.js
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
    // parse form‐encoded body
    const formData = qs.parse(event.body);
    const rID      = formData.rID;
    if (!rID) {
      return { statusCode: 400, body: "Missing rID" };
    }

    // assemble updated document
    const updated = {
      id:           rID,                    // must match existing Cosmos id
      rID:          rID,
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

    const { resource: replaced } = await container
      .item(rID, rID)
      .replace(updated);

    return {
      statusCode: 200,
      body:       JSON.stringify(replaced)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body:       JSON.stringify({ error: err.message })
    };
  }
};
