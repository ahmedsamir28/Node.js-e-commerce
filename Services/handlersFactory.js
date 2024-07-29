const asyncHandler = require('express-async-handler');
const ApiError = require('../Utils/apiError');
const ApiFeatures = require('../Utils/apiFeatures');
const reviewModel = require('../Models/reviewModel');


exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndDelete(req.params.id);
        if (!document) {
            return next(
                new ApiError(`No document for this id ${req.params.id}`, 404)
            );
        }


        await document.deleteOne();
        // Calculate the average ratings and the number of ratings after removing the document
        if (Model === reviewModel) {
            await document.constructor.calcAverageRatingsAndQuantity(document.product);
        }

        res.status(204).send();
    });

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!document) {
            return next(new ApiError(`No document for this id ${req.params.id}`, 404));
        }

        //Trigger "save" event when update document 
        document.save()
        res.status(200).json({ data: document });
    });

exports.createOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const newDocument = await Model.create(req.body);
        res.status(201).json({ data: newDocument });
    });

exports.getOne = (Model, populationOpt) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params
        // 1) Build query 
        let query = Model.findById(id)
        if (populationOpt) {
            query = query.populate(populationOpt)
        }

        // 2) Execute query 
        const document = await query
        if (!document) {
            // res.status(404).json({ msg: `No Brand for this id ${id}` })
            return next(new ApiError(`No document for this id ${id}`, 400))
        }
        res.status(200).json({ data: document })
    }

    )


exports.getAll = (Model, modelName = '') =>
    asyncHandler(async (req, res, next) => {
        let filter = {}
        if (req.filterObj) { filter = req.filterObj }

        // Build Query
        const documentCounts = await Model.countDocuments()
        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
            .pagination(documentCounts)
            .filter()
            .search(modelName)
            .limitFields()
            .sort();
        const { mongooseQuery, paginationResult } = apiFeatures
        const documents = await mongooseQuery;
        res.status(200).json({ results: documents.length, paginationResult, data: documents })

    })

