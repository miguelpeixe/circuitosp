/**
 * Module dependencies
 */

var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*
 * Schemma
 */

var EventSchema = new Schema({
  _id: {type: Number},
  _type: Number,
  name: String,
  shortDescription: String,
  longDescription: String,
  rules: String,
  status: Number,
  isVerified: Boolean,
  occurrences: [{ type: Number, ref: 'Occurrence'}],
  classificacaoEtaria: String,
  terms: {
    tag: [String],
    linguagem: [String]
  },
  traducaoLibras: String,
  descricaoSonora: String
}, { strict: false});

/**
 * Register
 */

mongoose.model('Event', EventSchema);
