const bcrypt = require('bcrypt-nodejs');
const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let userSchema = mongoose.Schema({
        read: { type: Boolean, default: false },
        avatar: {type: String},
        facebook:{
            id: {type: String},
            user: {type: Object},
            session: {type: Array}
        },
        google:{
            id: {type: String},
            user: {type: Object}
        },
        image:  { type: Object, default: {} },
        name: {type: String},
        surname: {type: String},
        username: {type: String, unique: true, sparse: true},
        email: {type: String, require: true, unique: true},
        password: {type: String, require: true},
        token: {type: String, require: true, unique: true},
        address: {type: String},
        comune: {type: Array},
        province: {type: Array},
        city: {type: String},
        council: {type: String},
        postcode: {type: String},
        mobile: {type: String},
        uniqueCode: {type: String},
        type:  { type: String, default: 'account' },
        isActive: {type: Boolean, default: false},
        latest_login: {type: Date, default: Date.now},
        session_at:  { type: Date, default: Date.now },
        updated_at: {type: Date, default: Date.now},
        created_at: {type: Date, default: Date.now}
    });

    userSchema.pre('save', function (next) {

        this.session_at = Date.now();

        if (!this.isNew) return next();

        const generateUUID = function () {
            let d = new Date().getTime();
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };

        if (!this.token) this.token = generateUUID() + '-&&-' + this._id;
        if (!this.created_at) this.created_at = Date.now();
        if (!this.updated_at) this.updated_at = Date.now();

        next();
    });


    userSchema.pre('update', (next) => {

        this.session_at = Date.now();

        if (!this.updated_at) {
            this.updated_at = Date.now();
        }

        next();
    });

    userSchema.methods = {

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
            const filtered = pick(obj, '_id', 'email', 'name', 'surname', 'image', 'isVerify', 'mobile', 'comune', 'token', 'type', 'created_at');

            return filtered;
        }
    };

    return mongoose.model('user', userSchema);
};

