const mongoose = require('mongoose');

const tokenWhitelistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

tokenWhitelistSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
tokenWhitelistSchema.set('toJSON', {
    virtuals: true,
});

const TokenWhitelist = mongoose.model('TokenWhitelist', tokenWhitelistSchema);

module.exports = TokenWhitelist;