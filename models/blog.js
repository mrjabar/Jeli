const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Title Validator
const titleLengthChecker = (title) => {
    if (!title) {
        return false;
    } else {
        if (title.length < 5 || title.length > 50) {
            return false;
        } else {
            return true;
        }
    }
};

const alphaNumericTitleChecker = (title) => {
    if (!title) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title);
    }
};

const titleValidators = [
    {
        validator: titleLengthChecker,
        message: 'Title must be at least 5 characters, but no more than 50'
    },
    {
        validator: alphaNumericTitleChecker,
        message: 'Title must be alphanumeric'
    }
];

// Body Validator
const bodyLengthChecker = (body) => {
    if (!body) {
        return false;
    } else {
        if (body.length < 5 || body.length > 500) {
            return false;
        } else {
            return true;
        }
    }
};

const bodyValidators = [
    {
        validator: bodyLengthChecker,
        message: 'Email must be at least 5 characters, but no more than 500'
    }
];

// Comment Validator
const commentLengthChecker = (comment) => {
    if (!comment[0]) {
        return false;
    } else {
        if (comment[0].length < 1 || comment[0].length > 200) {
            return false;
        } else {
            return true;
        }
    }
};

const commentValidators = [
    {
        validator: commentLengthChecker,
        message: 'Comment may not exceed 200 characters'
    }
];

const blogSchema = new Schema({
    title: { 
        type: String,
        required: true,
        validate: titleValidators
    },
    body: { 
        type: String, 
        required: true, 
        unique: true,
        validate: bodyValidators
    },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array },
    dislikes: { type: Number, default: 0 },
    dislikedBy: { type: Array },
    comments: [
        {
            comment: { 
                type: String,
                validate: commentValidators
            },
            commentator: { type: String},
        }
    ],
});

module.exports = mongoose.model('Blog', blogSchema);