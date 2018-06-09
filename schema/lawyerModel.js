require('./specialisationsModel');

const bcrypt    = require('bcrypt-nodejs');
const pick = require('lodash.pick');

module.exports = (mongoose) => {

    require('mongoose-double')(mongoose);
    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let studioSchema = mongoose.Schema({
        place_id:           { type: String },
        name:               { type: String },
        formatted_address:  { type: String },
        url:                { type: String },
        location: {
            lat: { type: mongoose.Schema.Types.Double },
            lng: { type: mongoose.Schema.Types.Double }
        },
        phone:              { type: String },
        website:            { type: String },
        updated_at:         { type: Date, default: Date.now },
        created_at:         { type: Date, default: Date.now }
    });

    let lawyerSchema = mongoose.Schema({
        stripe:        {
            customer:       { type: String },
            source:         { type: String }
        },
        email:         { type: String, require: true, unique: true },
        token:         { type: String, require: true, unique: true },
        avatar:        { type: String },
        image:         { type: Object, default: {} },
        name:          { type: String },
        surname:       { type: String },
        mobile:        { type: String },
        permalink:     { type: String, sparse: true, unique: true, trim: true },
        ordine_anno:   { type: Number },
        // comune: {type: Array}, //save in filters
        // province:      { type: Array }, //save in filters
        ordine:        { type: Array },
        filters:       { type: Object },
        indexing:      { type: Boolean, default: false },
        partner:       { type: Boolean, default: false },
        public:        { type: Object },
        notifications: { type: Object },
        credits:       { type: String, default: 0 },
        onboarding:    { type: Boolean, default: false },
        specialisations:[{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'spiecializzazione' }],
        // license_num:   { type: String },
        // license_date:  { type: Date },
        cf:            { type: String },
        officeName:    { type: String },
        offices:       [studioSchema],
        password:      { type: String, require: true },
        type:          { type: String, default: 'lawyer' },
        isActive:      { type: Boolean, default: true },
        isVerify: {type: Boolean, default: false},
        uniqueCode:    {type: String},
        note:          {type: String},
        officeNumber:  {type: String},
        website:       {type: String},
        latest_login:  { type: Date, default: Date.now },
        session_at:  { type: Date, default: Date.now },
        updated_at:    { type: Date, default: Date.now },
        created_at:    { type: Date, default: Date.now }
    });

    lawyerSchema.pre('save', function(next) {

        this.session_at = Date.now();

        if (!this.isNew) return next();

        var generateUUID = function(){
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        };

        if(!this.token) this.token = generateUUID() + '-&&-' + this._id;
        if(!this.created_at) this.created_at = Date.now();
        if(!this.updated_at) this.updated_at = Date.now();

        next();
    });

    lawyerSchema.pre('update', function(next) {
        this.session_at = Date.now();
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    lawyerSchema.pre('find', function(next) {
        // this.session_at = Date.now();
        // if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    lawyerSchema.methods = {

        /**
         * Generate Salt Password
         * @returns {string} Salt
         */
        generateHash: function(password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
        },

        /**
         * Valid password
         * @param {String} password
         * @return {Boolean} Valid Password
         */
        validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        },

        /**
         * Filter Keys
         * @return {Object} Custom Keys
         */
        filterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'email', 'name', 'surname', 'permalink', 'image', 'isActive', 'mobile', 'filters', 'specialisations', 'token', 'type', 'onboarding', 'notifications', 'partner', 'created_at');

            return filtered;
        },

        settingFilterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'email', 'name', 'surname', 'permalink', 'image', 'isActive', 'mobile', 'filters', 'specialisations', 'token', 'type', 'onboarding', 'notifications', 'partner', 'credits', 'officeName', 'offices', 'officeNumber', 'website', 'ordine', 'ordine_anno', 'public', 'indexing', 'session_at', 'created_at');

            return filtered;
        },

        publicFilterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'email', 'name', 'surname', 'permalink', 'image', 'filters', 'specialisations', 'officeName', 'offices', 'officeNumber', 'website', 'ordine', 'ordine_anno', 'public', 'created_at');

            return filtered;
        }



    };

    return mongoose.model('lawyer', lawyerSchema);

};


