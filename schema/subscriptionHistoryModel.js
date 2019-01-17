// require('./lawyerModel');
// require('./comuniModel');
//
// module.exports = (mongoose) => {
//
//     mongoose.plugin(schema => {
//         schema.options.usePushEach = true
//     });
//
//     let subscriptionSchema = mongoose.Schema({
//         status: {type: Boolean, default: false}, //check subscription is enabled
//         lawyer: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer', require: true, unique: true},
//         amount: {type: String},
//         comuni: [{type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'comuni'}],
//         case_qty: {type: String},
//         start: {type: Date},
//         expire: {type: Date},
//         customer: {type: Object},
//         source: {type: Object},
//         unsubscribe_at: {type: Date},
//         updated_at: {type: Date, default: Date.now},
//         created_at: {type: Date, default: Date.now}
//     });
//
//     subscriptionSchema.pre('save', (next) => {
//
//         if (!this.isNew) return next();
//
//         if (!this.created_at) {
//             this.created_at = Date.now();
//         }
//
//         next();
//     });
//
//     return mongoose.model('subscription', subscriptionSchema);
//
// };
//
