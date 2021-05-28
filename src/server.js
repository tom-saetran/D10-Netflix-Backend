import cors from "cors"
import fs from "fs-extra"
import uniqid from "uniqid"
import express from "express"
import createError from "http-errors"
import listEndpoints from "express-list-endpoints"

import { loggerJSON } from "./handlers/files.js"
import { errorBadRequest, errorForbidden, errorNotFound, errorDefault } from "./handlers/errors.js"
import mediaRouter from "./endpoints/media.js"

const server = express()
const port = process.env.PORT || 1234

// ##### Initial Setups #####
const whitelist = [process.env.FRONTEND_DEV_URL, process.env.FRONTEND_PROD_URL]
const corsOptions = {
    origin: (origin, next) => {
        try {
            if (whitelist.indexOf(origin) !== -1) {
                next(null, true)
            } else {
                next(createError(400, "Cross-Site Origin Policy blocked your request"), true)
            }
        } catch (error) {
            next(error)
        }
    }
}

server.use(express.json())
server.use(cors(corsOptions))

// ##### Global Middleware #####
const logger = async (req, res, next) => {
    const content = await fs.readJSON(loggerJSON)

    content.push({
        method: req.method,
        resource: req.url,
        query: req.query,
        body: req.body,
        _id: uniqid(),
        _timeStamp: new Date()
    })

    await fs.writeJSON(loggerJSON, content)
    next()
}
server.use(logger)

// ##### Routes #####
server.use("/media", mediaRouter)

// ##### Error Handlers #####
server.use(errorBadRequest)
server.use(errorForbidden)
server.use(errorNotFound)
server.use(errorDefault)

// ##### Start Server #####
server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("server is running on port: ", port)
})
