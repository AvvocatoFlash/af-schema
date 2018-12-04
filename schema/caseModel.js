require('./adminModel');
require('./userModel');
require('./lawyerModel');
require('./comuniModel');
require('./specialisationsModel');

const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    const buySchema = mongoose.Schema({
        lawyer:        { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
        created_at:    { type: Date, default: Date.now }
    });

    let caseSchema = mongoose.Schema({
        fullname:      { type: String },
        read:          { type: Boolean, default: false },
        user:          { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'user' },
        time:          { type: String, enum: [1, 2, 3, 4] },
        type:          { type: String, enum: [1, 2, 3, 4] },
        view:          { type: String, enum: [1, 2] },
        step:          { type: String, enum: [1, 2, 3] },
        description:   { type: String },
        specialisations:  [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'spiecializzazione' }],
        province:      { type: Array },
        comune:        { type: Array },
        location: { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'comuni' },
        mobile:        { type: String },
        email:         { type: String },
        title:         { type: String },
        status:        { type: Boolean, default: false },
        patrocinio:    { type: Boolean, default: false },
        partnerStatus: { type: Boolean, default: false },
        sold:          { type: Boolean },
        partners:      [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' }],
        content:       { type: String },
        credit:        { type: Number },
        selected:      { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
        buy:           [buySchema],
        note:          { type: String },
        urgent:        { type: Boolean, default: false },
        approved:      { type: Boolean, default: false },
        declined:      { type: Boolean, default: false },
        reminder:      { type: Boolean, default: false },
        reminderData:  { type: Date },
        archived:      { type: Boolean },
        removed:        [{
            lawyer_id:   { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
            date:      { type: Date }
        }],
        author_id:     { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'admin' },
        posted_at:     { type: Date },
        expired_at:    { type: Date },
        updated_at:    { type: Date, default: Date.now },
        created_at:    { type: Date, default: Date.now }
    });

    // view
    // 1 request user case
    // 2 lawyer cases app

    //step
    // 1 not do legal action
    // 2 other lawyer
    // 3 user did not choosed yet

    caseSchema.pre('save', function(next) {
        if (!this.isNew) return next();
        if(!this.created_at) this.created_at = Date.now();
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    caseSchema.pre('update', function(next) {
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    caseSchema.methods = {

        /**
         * Filter Keys
         * @return {Object} Custom Keys
         */
        minFilterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'comune', 'description', 'time', 'mobile', 'email', 'view', 'created_at');

            return filtered;
        },

        customerFilterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'fullname', 'declined', 'description', 'comune', 'created_at', 'buy', 'selected', 'title', 'specialisations', 'user', 'mobile', 'email', 'time', 'status');

            return filtered;
        },

        purchasedFilterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'fullname', 'declined', 'selected', 'posted_at', 'patrocinio', 'urgent', 'buy', 'selected', 'title', 'content', 'comune', 'specialisations', 'user', 'mobile', 'email', 'time', 'status', 'credit');

            return filtered;
        },

        searchFilterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'declined', 'sold', 'alert', 'posted_at', 'patrocinio', 'urgent', 'title', 'content', 'comune', 'specialisations', 'credit');

            return filtered;
        }
    };

    return mongoose.model('case', caseSchema);
};
