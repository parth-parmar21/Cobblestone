import { Router } from "express";
import { v7 as uuid } from 'uuid'
import { createPod } from "../kubernetes/pod.js";
import { createService } from "../kubernetes/service.js";

const router = Router()

router.post("/start", async (req, res) => {
    const sandboxId = uuid()
    console.log(sandboxId);
    
    await Promise.all([
        createPod(sandboxId),
        createService(sandboxId)
    ])

    return res.status(201).json({
        message: "Sandbox started successfully",
        success: true,
        sandboxId,
        previewUrl: `http://${sandboxId}.preview.localhost`
    })
})

export default router