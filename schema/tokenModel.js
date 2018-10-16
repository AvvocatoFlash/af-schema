const speakeasy = require('speakeasy');
require('mongoose');
require('./lawyerModel');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let tokenSchema = mongoose.Schema({
        value:   { type: Number, default: 0 },
        lawyer:  { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
        type:    { type: String },
        updated_at: { type: Date, default: Date.now },
        created_at: { type: Date, default: Date.now }
    });

    tokenSchema.pre('save', (next) => {

        if (!this.isNew) return next();

        if (!this.created_at) {
            this.created_at = Date.now();
        }

        next();
    });

    tokenSchema.statics = {

        generateLogin: async (UserId) => {

            const secretKey = speakeasy.generateSecret({length: 20});

            const tokenModel = this.model('token').create({
                value: secretKey.base32,
                type: 'auth',
                lawyer: UserId,
            });

            return tokenModel;
        }
    };

    return mongoose.model('token', tokenSchema);

};

