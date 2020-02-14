const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']

    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Need your password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // Validation ต้องการ แค่ true / false เพื่อตรวจสอบว่าสิ่งที่เรากำลัง validate ถูกต้องหรือไม่
            // This only works on CREATE and SAVE !!!    
            validator: function (el) {
                return el === this.password
            },
            message: 'Password are not the same!.'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'role is either:  user or admin'
        },
        default: 'user'
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;

    next()
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangeAt = Date.now() - 1000
    next()
})

// Check password login (candidatePassword) as same as password in database(userPassword)
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTimestamp) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(
            this.passwordChangeAt.getTime() / 1000, 10
        )

        return JWTimestamp < changedTimestamp
    }

    // False means NOT changed
    return false
}

const Users = mongoose.model('Users', userSchema)

module.exports = Users