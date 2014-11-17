
/**
 * Module dependencies
 */

var
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*
 * Schemma
 */

var OccurrenceSchema = new Schema({
  _id: {type: Number},
  space: { type: Schema.ObjectId, ref: 'Space'},
  startsAt: String,
  endsAt: String,
  duration: Number,
  frequency: String,
  startsOn: Date,
  until: Date,
  description: String,
  price: String
}, { strict: false});

/**
 * Register
 */

mongoose.model('Occurrence', OccurrenceSchema)
