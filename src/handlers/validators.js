import { body } from "express-validator"

export const mediaValidator = [
    body("Title").exists().withMessage("Name is a mandatory field!").isString().withMessage("Wrong type, expected String"),
    body("Year")
        .exists()
        .withMessage("Year is a mandatory field!")
        .isLength({ min: 4, max: 4 })
        .withMessage("Must be 4 digits!")
        .isInt({ min: 1900, max: 2025 })
        .withMessage("Wrong type, expected Number between 1900 and 2025 inclusive"),
    body("imdbID").exists().withMessage("imdbID is a mandatory field!").isString().withMessage("Wrong type, expected String"),
    body("Type").exists().withMessage("Type is a mandatory field!").isString().withMessage("Wrong type, expected String"),
    body("Poster").exists().withMessage("Poster is a mandatory field!").isURL().withMessage("Wrong type, expected URL")
]

export const reviewValidator = [
    body("comment")
        .exists()
        .withMessage("Comment is a mandatory field!")
        .isString()
        .withMessage("Wrong type, expected String")
        .isLength({ min: 20 })
        .withMessage("Comments must be a minimum of 20 characters!"),
    body("rate")
        .exists()
        .withMessage("Rate is a mandatory field!")
        .isInt({ min: 1, max: 5 })
        .withMessage("Wrong type, expected Number between 1 and 5 inclusive")
        .isLength({ min: 1, max: 1 })
        .withMessage("Rate must be exactly one digit"),
    body("elementId").exists().withMessage("ElementId is a mandatory field!").isString().withMessage("Wrong type, expected String")
]
