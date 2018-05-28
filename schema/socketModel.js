const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let socketSchema = mongoose.Schema({
        id:            { type: String },
        socketId:      { type: String },
        email:         { type: String },
        image:         { type: String },
        name:          { type: String },
        surname:       { type: String },
        mobile:        { type: String },
        type:          { type: String },
        permalink:     { type: String },
        credits:       { type: Number, default: 0 },
        updated_at:    { type: Date, default: Date.now },
        created_at:    { type: Date, default: Date.now }
    });

    socketSchema.pre('save', function(next) {
        if (!this.isNew) return next();
        if(!this.created_at) this.created_at = Date.now();
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    socketSchema.pre('update', function(next) {
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    return mongoose.model('socket', socketSchema);

};


