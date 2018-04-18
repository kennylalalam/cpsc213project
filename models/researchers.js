const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const stringField = {
    type: String,
    minlength: 1,
    maxlength: 100,
};

const ResearcherSchema = new Schema({
    email: {
        type: String,
        minlength: 1,
        maxlength: 50,
        lowercase: true,
        unique: true,
    },
    name: stringField,
    institution: stringField,
    hashed_password: stringField,
});

ResearcherSchema.pre('save', function userPreHook(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('hashed_password')) return next();

    // generate a salt
    return bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password using our new salt
        return bcrypt.hash(user.hashed_password, salt, (err2, hash) => {
            if (err2) return next(err2);

            // override the cleartext password with the hashed one
            user.hashed_password = hash;
            return next();
        });
    });
});

ResearcherSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.hashed_password, (err, isMatch) => {
        console.log('isMatch = ', isMatch);
        if (err) return cb(err);
        return cb(null, isMatch);
    });
};

ResearcherSchema.statics.count = cb => this.model('Researchers')
    .find({}, cb);

module.exports = mongoose.model('Researchers', ResearcherSchema);
