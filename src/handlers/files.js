import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, createReadStream, createWriteStream, readFile } = fs

const mediaJSON = join(dirname(fileURLToPath(import.meta.url)), "../data/media.json")
export const readMediaStream = () => createReadStream(mediaJSON)
export const writeMediaStram = () => createWriteStream(mediaJSON, { flags: "a" })

export const loggerJSON = join(dirname(fileURLToPath(import.meta.url)), "../log.json")
