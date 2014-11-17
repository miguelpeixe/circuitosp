/**
 * Module dependencies
 */

var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*
 * Schemma
 */

var SpaceSchema = new Schema({
  _id: {type: Number},
  name: String,
  shortDescription: String,
  endereco: String,
  location: {},
  avatar: { }
}, { strict: false });

/**
 * Register
 */

mongoose.model('Space', SpaceSchema);
