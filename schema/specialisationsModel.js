const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let spiecializzazioneSchema = mongoose.Schema({
        name:          { type: String },
        position:      { type: Number },
        isActive:      { type: Boolean, default: true },
        created_at:    { type: Date, default: Date.now }
    });

    spiecializzazioneSchema.pre('save', function(next) {
        if (!this.isNew) return next()
        if(!this.created_at) this.created_at = Date.now();
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    spiecializzazioneSchema.pre('update', function(next) {
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    spiecializzazioneSchema.methods = {

        /**
         * Filter Keys
         * @return {Object} Custom Keys
         */
        filterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, 'name', 'position');

            return filtered;
        }
    };

    return mongoose.model('spiecializzazione', spiecializzazioneSchema);
};

