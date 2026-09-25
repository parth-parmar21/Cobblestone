import axios from 'axios'
import { tool } from 'langchain'
import * as z from "zod"

export const listFiles = tool(
    async ({ }, config) => {
        const writer = config.writer
        
        writer("Using list files tool to list files in project directory... \n")
        const response = await axios.get(`http://sandbox-service-${config.context.projectId}:3000/list-files`)

        writer(`Files listed successfully... \n Files: ${response.data.join(', ')} \n`)
        return JSON.stringify(response.data.files)
    },
    {
        name: "listFiles",
        description: "List all files in the project directory. This tool is used to retrieve a list of all files in the project directory.",
        schema: z.object({})
    }
)

export const readFiles = tool(
    async ({files = []}, config) => {
        const writer = config.writer
        
        writer("Using read files tool to read files in project directory... \n")
        const response = await axios.get(`http://sandbox-service-${config.context.projectId}:3000/read-files?files=${files.join(',')}`)


        writer(`Files read successfully... \n Files: ${response.data.join(', ')} \n`)
        return JSON.stringify(response.data)
    },
    {
        name: "readFiles",
        description: "Read all files in the project directory. This tool is used to retrieve the contents of all files in the project directory.",
        schema: z.object({
            files: z.array(z.string()).describe("This list of files absolute paths to read. These should be files that were listed using the list_files tool or created later.")
        })
    }
)

export const updateFiles = tool(
    async ({ files }, config) => {
        const writer = config.writer
        
        writer(`Updating specific file ${files.map((f) => `- ${f.file}`).join(', ')} \n`)
        const response = await axios.patch(`http://sandbox-service-${config.context.projectId}:3000/update-files`, { updates: files })


        writer(`Files updated successfully... \n Files: ${response.data.join(', ')} \n`)
        return JSON.stringify(response.data)
    },
    {
        name: "updateFiles",
        description: "Update all files in the project directory. This tool is used to modify the contents of existing files in the project directory.",
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("The absolute path of the file to update."),
                content: z.string().describe("The new content for the file, the content should support json format.")
            })).describe("The list of files to update and their new contents")
        })
    }
)