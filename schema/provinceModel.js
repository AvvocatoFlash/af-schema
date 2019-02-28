// https://github.com/matteocontrini/comuni-json
const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    const provinceSchema = mongoose.Schema({
        name:    { type: String },
        permalink:     { type: String, unique: true, trim: true },
        codice:  { type: String },
    });

    provinceSchema.methods = {

        /**
         * Filter Keys
         * @return {Object} Custom Keys
         */
        filterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, 'name', 'permalink', 'codice');

            return filtered;
        }
    };

    return mongoose.model('province', provinceSchema);
};