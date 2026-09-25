import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { listFiles, readFiles, updateFiles } from "./tools.js";

const model = new ChatOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: "openrouter/free",
    temperature: 1,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1"
    }
});


export const agent = createAgent({
    model,
    tools: [
        listFiles,
        readFiles,
        updateFiles
    ]
})