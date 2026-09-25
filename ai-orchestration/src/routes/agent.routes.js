import { Router } from 'express'
import { agent } from "../agent/code.agent.js";

const router = Router()

router.post("/invoke", async (req, res) => {

    const { message, projectId } = req.body

    res.writeHead(200, { 
        "Content-Type": "text/event-stream" ,
        "cache-control": "no-cache" ,
        "connection": "keep-alive" 
    })

    const writer = (text) => res.write(text)

    try {
        const response = await agent.stream(
            {
                messages: [
                    {
                        role: "User",
                        content: message
                    }
                ]
            },
            {
                context: {
                    projectId,
                    writer
                },
                streamMode: "custom"
            }
        )

        for await (const chunk of response) {
            console.log(chunk);
            res.write(`data: ${chunk}\n\n`)
        }

        res.end()   
    } catch (err) {
        console.error(`Error occurred while invoking agent: ${err.message}`);
        if (res.headersSent()) {
            res.end();
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
})

export default router