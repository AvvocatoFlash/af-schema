module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let reportCaseSchema = mongoose.Schema({
        total_credits_daily_spent:          { type: Number },

        total_case_daily_approved:          { type: Number },
        total_case_daily_received:          { type: Number },
        total_case_daily_partners:          { type: Number },

        total_case_monthly:                 { type: Number },
        total_case_monthly_approved:        { type: Number },
        total_case_monthly_archived:        { type: Number },
        total_case_monthly_partners:        { type: Number },

        total_case_monthly_1credit:         { type: Number },
        total_case_monthly_2credits:        { type: Number },
        total_case_monthly_3credits:        { type: Number },
        total_case_monthly_4credits:        { type: Number },
        total_case_monthly_more_credits:    { type: Number },
        total_case_monthly_credits_spent:   { type: Number },
        total_case_monthly_max_profit:      { type: Number },

        updated_at:    { type: Date, default: Date.now },
        created_at:    { type: Date, default: Date.now }
    });

    reportCaseSchema.pre('save', function(next) {
        if (!this.isNew) return next();
        if(!this.created_at) this.created_at = Date.now();
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    reportCaseSchema.pre('update', function(next) {
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    return mongoose.model('reportCase', reportCaseSchema);

};


