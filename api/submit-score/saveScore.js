module.exports = async function (context, req) {
  const name = req.body?.name || "Anonymous";
  const score = req.body?.score || 0;

  context.log("Saving score for", name, score);

  // In production, save to a real database.
  context.res = {
    status: 200,
    body: {
      message: `Score saved for ${name}`,
      score: score
    }
  };
};
