var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var subscriptionSchema = new Schema({
	subscriberId: String,
	sources: []
});

mongoose.model("Subscription", subscriptionSchema);