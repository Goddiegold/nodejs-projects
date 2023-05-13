const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

tokenBlacklistSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
tokenBlacklistSchema.set('toJSON', {
    virtuals: true,
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;