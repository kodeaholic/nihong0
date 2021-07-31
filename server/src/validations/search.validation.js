const Joi = require('joi');

const search = {
    body: Joi.object().keys({
        search: Joi.string().required(),
    }),
};

module.exports = {
    search,
};

