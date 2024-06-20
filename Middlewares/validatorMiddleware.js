const { validationResult } = require('express-validator');

const validatorMiddleware =(req, res, next) => {
     // 2-middleware => catch errors from rules is exist
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }

module.exports = validatorMiddleware
