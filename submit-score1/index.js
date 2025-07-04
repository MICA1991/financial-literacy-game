module.exports = async function (context, req) {
  const name = req.body?.name || "Anonymous";
  const score = req.body?.score || 0;

  context.res = {
    status: 200,
    body: {
      message: `Score received for ${name}`,
      score: score
    }
  };
};