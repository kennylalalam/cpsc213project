const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const stringField = {
    type: String,
    minlength: 1,
    maxlength: 5000,
};

const ExperimentSchema = new Schema({
    researcher: ObjectId,
    name: stringField,
    description: stringField,
    pay: NumberInt,
    completed: Boolean,
    criteria: [String],
});

module.exports = mongoose.model('Experiments', ExperimentSchema);
