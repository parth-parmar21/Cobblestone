import express from 'express'
import morgan from 'morgan'
import {createProxyMiddleware} from 'http-proxy-middleware'
const app = express()
app.use(morgan('dev'))

app.use("/_status/healthz", (req, res) => {
    res.status(200).json({message: "OK"})
})

app.use("/_status/readyz", (req, res) => {
    res.status(200).json({message: "OK"})
})

const proxies = {}

const getProxy = (sandboxId) => {
    if (!proxies[sandboxId]) {
        proxies[sandboxId] = createProxyMiddleware({
            target: `http://sandbox-service-${sandboxId}`,
            changeOrigin: true,
            ws: true
        })
    }
    return proxies[sandboxId]
}

app.use("/", (req, res, next) => {
    const host = req.headers.host
    const sandboxId = host.split('.')[0]

    return getProxy(sandboxId)(req, res, next)
});

export default app