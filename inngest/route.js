import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { llmModel } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [llmModel], // all your functions go here
});
