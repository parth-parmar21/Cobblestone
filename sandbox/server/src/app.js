import "dotenv/config"
import express from 'express'
import morgan from "morgan"

const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/api/_status/healthz", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.get("/api/_status/readyz", (req, res) => {
    res.status(200).json({ status: "Ready" });
});

export default app