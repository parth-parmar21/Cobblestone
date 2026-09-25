import express from 'express'
import morgan from 'morgan'

const app = express()
app.use(morgan("dev"))
app.use(express.json())

app.get("/_status/healthz", (req, res) => {
    res.status(200).json({ status: "healthy" })
})

app.get("/_status/readyz", (req, res) => {
    res.status(200).json({ status: "ready" })
})

import agentRouter from './routes/agent.routes.js'

app.use("/api/ai", agentRouter)

export default app