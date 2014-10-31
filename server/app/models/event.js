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
  _id: {type: Number, index: true},
  _type: Number,
  name: String,
  shortDescription: String,
  longDescription: String,
  rules: String,
  status: Number,
  isVerified: Boolean,
  occurrences: [{ type: Schema.ObjectId, ref: 'Occurrence'}],
  project: [{ type: Schema.ObjectId, ref: 'Project'}],
  classificacaoEtaria: String,
  terms: {
    tag: [String],
    linguagem: [String]
  },
  traducaoLibras: String,
  descricaoSonora: String
});

/**
 * Register
 */

mongoose.model('Event', EventSchema);


// {
//     "id": {
//         "required": true,
//         "type": "integer",
//         "length": null
//     },
    // "_type": {
    //     "required": true,
    //     "type": "smallint",
    //     "length": null,
    //     "@select": "type"
    // },
    // "name": {
    //     "required": true,
    //     "type": "string",
    //     "length": 255
    // },
    // "shortDescription": {
    //     "required": true,
    //     "type": "text",
    //     "length": null
    // },
    // "longDescription": {
    //     "required": false,
    //     "type": "text",
    //     "length": null
    // },
    // "rules": {
    //     "required": false,
    //     "type": "text",
    //     "length": null
    // },
    // "createTimestamp": {
    //     "required": true,
    //     "type": "datetime",
    //     "length": null
    // },
    // "status": {
    //     "required": true,
    //     "type": "smallint",
    //     "length": null
    // },
    // "isVerified": {
    //     "required": true,
    //     "type": "boolean",
    //     "length": null
    // },
    // "occurrences": {
    //     "isMetadata": false,
    //     "isEntityRelation": true,
    //     "targetEntity": "EventOccurrence",
    //     "isOwningSide": false
    // },
    // "owner": {
    //     "isMetadata": false,
    //     "isEntityRelation": true,
    //     "targetEntity": "Agent",
    //     "isOwningSide": true
    // },
//     "project": {
//         "isMetadata": false,
//         "isEntityRelation": true,
//         "targetEntity": "Project",
//         "isOwningSide": true
//     },
//     "__metadata": {
//         "isMetadata": false,
//         "isEntityRelation": true,
//         "targetEntity": "EventMeta",
//         "isOwningSide": false
//     },
//     "subTitle": {
//         "required": false,
//         "type": "text",
//         "length": null,
//         "private": false,
//         "label": "Sub-T\u00edtulo",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "registrationInfo": {
//         "required": false,
//         "type": "text",
//         "length": null,
//         "private": false,
//         "label": "Inscri\u00e7\u00f5es",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "classificacaoEtaria": {
//         "required": true,
//         "type": "select",
//         "length": null,
//         "private": false,
//         "options": {
//             "Livre": "Livre",
//             "18 anos": "18 anos",
//             "16 anos": "16 anos",
//             "14 anos": "14 anos",
//             "12 anos": "12 anos",
//             "10 anos": "10 anos"
//         },
//         "label": "Classifica\u00e7\u00e3o Et\u00e1ria",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "telefonePublico": {
//         "required": false,
//         "type": "string",
//         "length": null,
//         "private": false,
//         "label": "Mais Informa\u00e7\u00f5es",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "preco": {
//         "required": false,
//         "type": "string",
//         "length": null,
//         "private": false,
//         "label": "Pre\u00e7o",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "traducaoLibras": {
//         "required": false,
//         "type": "select",
//         "length": null,
//         "private": false,
//         "options": {
//             "": "N\u00e3o Informado",
//             "Sim": "Sim",
//             "N\u00e3o": "N\u00e3o"
//         },
//         "label": "Tradu\u00e7\u00e3o para LIBRAS",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "descricaoSonora": {
//         "required": false,
//         "type": "select",
//         "length": null,
//         "private": false,
//         "options": {
//             "": "N\u00e3o Informado",
//             "Sim": "Sim",
//             "N\u00e3o": "N\u00e3o"
//         },
//         "label": "\u00c1udio descri\u00e7\u00e3o",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "site": {
//         "required": false,
//         "type": "string",
//         "length": null,
//         "private": false,
//         "label": "Site",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "facebook": {
//         "required": false,
//         "type": "string",
//         "length": null,
//         "private": false,
//         "label": "Facebook",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "twitter": {
//         "required": false,
//         "type": "string",
//         "length": null,
//         "private": false,
//         "label": "Twitter",
//         "isMetadata": true,
//         "isEntityRelation": false
//     },
//     "googleplus": {
//         "required": false,
//         "type": "string",
//         "length": null,
//         "private": false,
//         "label": "Google+",
//         "isMetadata": true,
//         "isEntityRelation": false
//     }
// }
