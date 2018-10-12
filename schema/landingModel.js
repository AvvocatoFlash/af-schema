const bcrypt = require('bcrypt-nodejs');
const pick = require('lodash.pick');
require('./comuniModel');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let landingSchema = mongoose.Schema({
        type: { type: String, enum: ['PPC', 'Organic'] },
        metaTitle: {type: String},
        metaDescription: {type: String},
        title: {type: String},
        subtitle: {type: String},
        permalink: { type: String, require: true, unique: true },
        position: {type: Number},
        content: {type: String},
        isProvince: {type: Boolean}, // new landing by province
        label: {type: String},//to remove
        seo: {type: String}, //to remove
        footerLabel: {type: String},
        iconLabel: {type: String},
        isSEO: {type: Boolean, default: false},
        isHome: {type: Boolean, default: false},
        // ppc_category: { type: String, enum: ['Milano', 'Roma'] },
        isCategory: {type: Boolean, default: false},
        isSAM: {type: Boolean, default: false}, //to remove
        isSpecial: {type: Boolean, default: false},//to remove
        isActive: {type: Boolean, default: true},
        isVerify: {type: Boolean, default: false},
        testimonials: {type: Array, default: [] },
        clone: {type:Boolean},
        related: [{ type: mongoose.Schema.Types.ObjectId, field: "_id" }],
        getContent: [{ type: mongoose.Schema.Types.ObjectId, field: "_id" }],
        comune: { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'comuni' },
        specialisations: [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'spiecializzazione' }],
        updated_at: {type: Date, default: Date.now},
        created_at: {type: Date, default: Date.now}
    });

    landingSchema.pre('save', function (next) {
        if (!this.isNew) return next()
        if (!this.created_at) this.created_at = Date.now();
        if (!this.updated_at) this.updated_at = Date.now();
        next();
    });

    landingSchema.pre('update', function (next) {
        if (!this.updated_at) this.updated_at = Date.now();
        next();
    });

    landingSchema.methods = {

        /**
         * Filter Keys
         * @return {Object} Custom Keys
         */
        publicFilterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'iconLabel', 'permalink');

            return filtered;
        },

        /**
         * Filter Keys
         * @return {Object} Custom Keys
         */
        footerFilterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'footerLabel', 'permalink');

            return filtered;
        },

    };

    return mongoose.model('landing', landingSchema);

};


