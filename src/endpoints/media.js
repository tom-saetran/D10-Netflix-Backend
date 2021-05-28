import multer from "multer"
import express from "express"
import { pipeline } from "stream"
import createError from "http-errors"
import { v2 as cloudinary } from "cloudinary"
import { filter, del } from "../handlers/streamUtils.js"
import { readMediaStream } from "../handlers/files.js"
import { mediaValidator, reviewValidator } from "../handlers/validators.js"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const mediaRouter = express.Router()

//Get All medias
mediaRouter.get("/", (req, res, next) => {
    try {
        pipeline(
            readMediaStream(),
            filter(media => (req.query.Title ? media.Title.toLowerCase().includes(req.query.Title) : media)),
            filter(media => (req.query.Year ? media.Year === req.query.Year : media)),
            filter(media => (req.query.imdbID ? media.imdbID === req.query.imdbID : media)),
            filter(media => (req.query.Type ? media.Type === req.query.Type : media)),
            res,
            error => (error ? createError(500, error) : null)
        )
    } catch (error) {
        next(error)
    }
})

//Get Single media
mediaRouter.get("/:id", (req, res, next) => {
    try {
        pipeline(
            readMediaStream(),
            filter(media => media._id === req.params.id),
            res,
            error => (error ? createError(500, error) : null)
        )
    } catch (error) {
        next(error)
    }
})

//Post new media
mediaRouter.post("/", mediaValidator, async (req, res, next) => {
    try {
        res.status(201).send("Created")
    } catch (error) {
        next(error)
    }
})

//Update media
mediaRouter.put("/:id", mediaValidator, async (req, res, next) => {
    try {
        res.status(200).send("Updated")
    } catch (error) {
        next(error)
    }
})

// Delete media
mediaRouter.delete("/:id", async (req, res, next) => {
    try {
        pipeline(
            readMediaStream(),
            del(media => media._id === req.params.id),
            res,
            error => (error ? createError(500, error) : null)
        )
    } catch (error) {
        next(error)
    }
})

// Download media as PDF
mediaRouter.get("/:id/asPDF", (req, res, next) => {
    try {
        res.setHeader("Content-Disposition", `attachment; filename=${req.params.id}.pdf`)
        pipeline(generatePDFStream(), res, error => (error ? createError(500, error) : null))
    } catch (error) {
        next(error)
    }
})

// Post review to media
mediaRouter.post("/:id/review", reviewValidator, (req, res, next) => {
    try {
        res.status(201).send("Created")
    } catch (error) {
        next(error)
    }
})

// Delete review from media
mediaRouter.delete("/:id/review", (req, res, next) => {
    try {
        res.status(405).send("Deleted")
    } catch (error) {
        next(error)
    }
})

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "media"
    }
})

const upload = multer({
    storage: cloudinaryStorage
}).single("cover")

mediaRouter.post("/:id/cover", upload, (req, res, next) => {
    try {
        console.log(req.file)
        res.status(200).send("OK")
    } catch (error) {
        next(error)
    }
})

export default mediaRouter
