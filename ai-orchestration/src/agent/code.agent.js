import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from '@langchain/groq'
import { createAgent } from "langchain";
import { listFiles, readFiles, updateFiles } from "./tools.js";

console.log();

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b"
});


export const agent = createAgent({
    model,
    tools: [
        listFiles,
        readFiles,
        updateFiles
    ]
}).withConfig({
    recursionLimit: 30
})