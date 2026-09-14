import { Router } from "express";
import fs from 'fs'
import path from 'path'

const router = Router()

const WORKING_DIR = "/workspace"

router.get("/list-files", async (req, res) => {
    const listFiles = async (dir, baseDir) => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true })
        const files = []

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            const relativePath = path.relative(baseDir, fullPath)

            if (entry.isDirectory() && ["node_modules", "dist", ".git"].includes(entry.name)) continue

            if (entry.isDirectory()) {
                files.push(...(await listFiles(fullPath, baseDir)))
            } else {
                files.push(relativePath)
            }
        }
        return files
    }

    try {
        const files = await listFiles(WORKING_DIR, WORKING_DIR)
        res.status(200).json({
            message: "Files listed successfully",
            files
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error listing files",
            error: err.message
        })
    }
})

export default router