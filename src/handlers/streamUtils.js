import { Transform } from "stream"
import createError from "http-errors"

export const filter = (fn, options = {}) =>
    new Transform({
        objectMode: true,
        ...options,

        transform(chunk, encoding, callback) {
            try {
                const parsed = JSON.parse(chunk)
                const take = parsed.filter(fn)
                return callback(null, true ? JSON.stringify(take) : undefined)
            } catch (error) {
                return callback(error)
            }
        }
    })

export const del = (fn, options = {}) =>
    new Transform({
        objectMode: true,
        ...options,

        transform(chunk, encoding, callback) {
            try {
                const parsed = JSON.parse(chunk)
                const take = parsed.filter(fn)
                // if match delete user here
                const result = take.length > 0 ? "Deleted" : createError(404, "id does not match")
                return callback(null, take.length > 0 ? "Deleted" : "No id match")
            } catch (error) {
                return callback(error)
            }
        }
    })
