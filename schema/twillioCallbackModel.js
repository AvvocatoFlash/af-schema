const bcrypt = require('bcrypt-nodejs');
const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let twillioHookSchema = mongoose.Schema({
        json:           { type: Object },
        created_at:    { type: Date, default: Date.now }
    });

    twillioHookSchema.pre('save', function(next) {
        if (!this.isNew) return next();
        if(!this.created_at) this.created_at = Date.now();
        next();
    });

    return  mongoose.model('twillioHook', twillioHookSchema);
};
