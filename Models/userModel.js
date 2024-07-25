const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: [true, 'name required']
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: true,
        lowercase: true
    },
    phone: String,
    profileImg: String,
    password: {
        type: String,
        required: [true, 'password required'],
        minlength: [6, 'Too short password']
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,


    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const setImageURL = (doc) => {
    if (doc.profileImg) {
        const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
        doc.profileImg = imageUrl;
    }
};
userSchema.post("init", (doc) => {
    setImageURL(doc);
});
userSchema.post("save", (doc) => {
    setImageURL(doc);
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})
module.exports = mongoose.model('User', userSchema)