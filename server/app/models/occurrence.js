// { spaceId: '183',
//     startsAt: '16:00',
//     duration: 240,
//     endsAt: '20:00',
//     frequency: 'once',
//     startsOn: '2014-09-03',
//     until: '',
//     description: 'Dia 3 de setembro de 2014 às 16:00',
//     price: 'Grátis' }


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
  _id: {type: Number, index: true},
  space: { type: Schema.ObjectId, ref: 'Space'},
  startsAt: String,
  endsAt: String,
  duration: Number,
  frequency: String,
  startsOn: Date,
  until: Date,
  description: String,
  price: String
});

/**
 * Register
 */

mongoose.model('Occurrence', OccurrenceSchema)
