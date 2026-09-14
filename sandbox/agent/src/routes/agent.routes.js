import { Router } from "express";
import fs from 'fs'
import path from 'path'

const router = Router()

const WORKING_DIR = "/workspace"

/**
 * @route http://sandboxId.agent.localhost/list-files
 * @method GET
 * @description this route will display all the files in the /worksapce folder
 */
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

/**
 * @route http://sandboxId.agent.localhost/read-files?files=filepath
 * @method GET
 * @description this route will read the content of the specified files
 */
router.get("/read-files", async (req, res) => {
    const files = req.query.files

    if (!files) {
        return res.status(400).json({
            message: "No files specified"
        })
    }

    const fileList = files.split(",") // files=test1.txt,text2.txt

    const result = await Promise.all(
        fileList.map(async (fileName) => {
            const filePath = path.join(WORKING_DIR, fileName)
            try {

                const content = await fs.promises.readFile(filePath, "utf-8")
                return { [filePath.replace(WORKING_DIR, "")]: content }
            } catch (err) {
                return { [filePath.replace(WORKING_DIR, "")]: `error while reading file: ${err.message}` }
            }
        }))

    res.status(200).json({
        message: "Files read successfully",
        files: result
    })
})

/**
 * @route http://sandboxId.agent.localhost/update-files
 * @method PATCH
 * @body updates: file, content
 * @description this route will update the content of the specified files
 */

router.patch("/update-files", async (req, res) => {

    const { updates } = req.body

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            message: "Invalid updates format"
        })
    }

    const result = await Promise.all(
        updates.map(async ({ file, content }) => {
            const filePath = path.join(WORKING_DIR, file)
            try {
                await fs.promises.writeFile(filePath, content, "utf-8")
                return { [filePath.replace(WORKING_DIR, "")]: "File updated successfully" }
            } catch (err) {
                return { [filePath.replace(WORKING_DIR, "")]: `error while updating file: ${err.message}` }
            }
        })
    )

    res.status(200).json({
        message: "Files updated successfully",
        files: result
    })
})

/**
 * @route http://sandboxId.agent.localhost/delete-files?files=filepath
 * @method DELETE
 * @body params: files with , seprated
 * @description this route will delete the specified files
 */

router.delete("/delete-files", async (req, res) => {
    const files = req.query.files

    if (!files) {
        return res.status(400).json({
            message: "No files specified"
        })
    }

    const fileList = files.split(",")

    const result = await Promise.all(
        fileList.map(async (fileName) => {
            const filePath = path.join(WORKING_DIR, fileName)

            try {
                await fs.promises.unlink(filePath)
                return { [filePath.replace(WORKING_DIR, "")]: "File deleted successfully" }
            } catch (err) {
                return { [filePath.replace(WORKING_DIR, "")]: `error while deleting file: ${err.message}` }
            }
        })
    )

    return res.status(200).json({
        message: "Files deleted successfully",
        files: result
    })
})

export default router