const bcrypt  = require('bcrypt-nodejs');
const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let dashboardSchema = mongoose.Schema({
        lawyers:      {
            credits: { type: Number },
        },
        cases:      {
            available_credits:  { type: Number },
            available_cases:    { type: Number },
            today: {
                receive:      { type: Number },
                approved:     { type: Number },
                sold:         { type: Number },
            }
        },
        invoices:      {
            total_amount_last_month:   { type: Number },
            total_credits_last_month:  { type: Number },
            today: {
                qty:            { type: Number },
                amount:         { type: Number },
                credits:        { type: Number },
            }
        },
        updated_at:  { type: Date, default: Date.now },
        created_at:  { type: Date, default: Date.now }
    });

    dashboardSchema.pre('save', function(next) {
        if (!this.isNew) return next();
        if(!this.created_at) this.created_at = Date.now();
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    dashboardSchema.pre('update', function(next) {
        if(this.updated_at) this.updated_at = Date.now();
        next();
    });

    return mongoose.model('dashboard', dashboardSchema);
};

