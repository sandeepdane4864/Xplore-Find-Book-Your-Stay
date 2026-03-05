const Joi = require('joi');
const listing = require('./models/listing');
const user = require('./models/user');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow("", null)
        }).optional()
    }).required()
});

module.exports.userSchema = Joi.object({
    user: Joi.object({
        firstName: Joi.string()
            .min(2)
            .max(30)
            .required(),

        lastName: Joi.string()
            .min(2)
            .max(30)
            .required(),

        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),

        email: Joi.string()
            .email()
            .required(),

        profilePicture: Joi.string()
                .uri()
                .allow("", null),


        phone_no: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
                "string.pattern.base": "Phone number must be 10 digits"
            }),

        gender: Joi.string()
            .valid("Male", "Female", "Other")
            .required(),

        DOB: Joi.date()
            .less("now")
            .required(),

        password: Joi.string()
            .min(6)
            .max(30)
            .required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        author: Joi.string().required(),
        rating: Joi.number()
            .min(1)
            .max(5)
            .required(),
        comment: Joi.string()
            .min(5)
            .max(500)
            .required()
    }).required()
}); 

