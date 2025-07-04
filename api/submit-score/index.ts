import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { user, score } = req.body || {};

  if (!user || score == null) {
    context.res = {
      status: 400,
      body: "Missing user or score",
    };
    return;
  }

  // You can extend this to save to database or log to table storage
  context.log(`User ${user} submitted score ${score}`);

  context.res = {
    status: 200,
    body: { message: "Score received successfully!" },
  };
};

export default httpTrigger;
