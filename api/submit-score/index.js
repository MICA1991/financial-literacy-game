const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  const name = req.body?.name || "Anonymous";
  const score = req.body?.score || 0;

  const connectionString = process.env.AzureStorageConnectionString;
  const tableName = "Scores";

  try {
    const tableClient = TableClient.fromConnectionString(connectionString, tableName);

    const entity = {
      partitionKey: "scores",
      rowKey: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      score,
      timestamp: new Date().toISOString()
    };

    await tableClient.createEntity(entity);

    context.res = {
      status: 200,
      body: { message: `Score saved for ${name}`, score }
    };
  } catch (err) {
    context.log("Azure Table Storage error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to save score." }
    };
  }
};
