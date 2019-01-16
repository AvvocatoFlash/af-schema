const bcrypt = require('bcrypt-nodejs');
const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let twilioCallbackSchema = mongoose.Schema({
        json:           { type: String },
        created_at:    { type: Date, default: Date.now }
    });

    twilioCallbackSchema.pre('save', function(next) {
        if (!this.isNew) return next();
        if(!this.created_at) this.created_at = Date.now();
        next();
    });

    return  mongoose.model('twilioCallback', twilioCallbackSchema);
};
