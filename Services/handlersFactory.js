const asyncHandler = require("express-async-handler")
const ApiError = require("../Utils/apiError")

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params
        const document = await Model.findByIdAndDelete(id)
        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 400))
        }
        res.status(204).send()
    })


exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {

        const document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!document) {
            // res.status(404).json({ msg: `No Brand for this id ${id}` })
            return next(new ApiError(`No document for this id ${id}`, 400))
        }
        res.status(200).json({ data: document })
    })
