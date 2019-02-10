module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let reportCaseSchema = mongoose.Schema({
        total_case:                 { type: String },
        total_case_approved:        { type: String },
        total_case_archived:        { type: String },
        total_case_partners:        { type: String },
        total_case_approved_today:  { type: String },
        total_case_received_today:  { type: String },
        total_case_1credit:         { type: String },
        total_case_2credits:         { type: String },
        total_case_3credits:         { type: String },
        total_case_4credits:         { type: String },
        total_case_more_credits:     { type: String },
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


