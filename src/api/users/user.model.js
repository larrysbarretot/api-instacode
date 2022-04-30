const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { validationPassword, setError } = require('../../helpers/utils');

const schema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        emoji: {
            type: String,
            required: true
        },
        codes: [{type: Schema.Types.ObjectId, ref:'Code'}],
        favCodes: [{type: Schema.Types.ObjectId, ref:'Code'}],
    },
    {
        timestamps: true
    }
)

schema.pre('save', function(next) {
    if (!validationPassword(this.password)) {
        return next(setError(400, 'La contraseña no es válida'));
    }
    this.password = bcrypt.hashSync(this.password, 12);
    next();
})

module.exports = mongoose.model('users', schema);