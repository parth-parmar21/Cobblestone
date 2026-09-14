import express from 'express'
import morgan from 'morgan'

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.json({ message: "Agent is running" })
})

import agentRouter from './routes/agent.routes.js'
app.use('/', agentRouter)


export default app