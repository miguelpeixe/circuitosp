// { '@files:avatar.viradaSmall': { url: 'http://spcultura.prefeitura.sp.gov.br//files/space/183/file/5933/galeriaolido144x144-6a2dc99276fcff0ec9d78760c20632cb.jpg' },
//   '@files:avatar.viradaBig': { url: 'http://spcultura.prefeitura.sp.gov.br//files/space/183/file/5933/galeriaolido144x144-5bf10d38ea5e0002534b055dc09b4a2a.jpg' },
//   id: 183,
//   name: 'Galeria Olido',
//   shortDescription: 'A tradicional galeria instalada no centro novo da cidade passou a funcionar como centro cultural em setembro de 2004. Além de cinema com capacidade para 236 pessoas, o local conta com duas salas de espetáculo (uma exclusiva para dança), dois andares expositivos, o Centro de Memória do Circo e um ponto de leitura.',
//   endereco: 'Av. São João, 473. São Paulo',
//   location: { latitude: '-23.5432315', longitude: '-46.638795' } }


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
  _id: {type: Number, index: true},
  name: String,
  shortDescription: String,
  endereco: String,
  location: { },
  '@files:avatar.viradaSmall': {},
  '@files:avatar.viradaBig': {}
});

/**
 * Register
 */

mongoose.model('Space', SpaceSchema);
