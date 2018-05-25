const mongoose = require('mongoose');
const Source = mongoose.model('Source');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	sources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Source'}]
});

const User = module.exports = mongoose.model('User', UserSchema);


module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}


module.exports.getUserByUsername = function(username, callback){
	const query = {username: username};
	User.findOne(query, callback);
}


module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}


module.exports.addSource = function(source, callback) {
	User.sources.push(source);
}