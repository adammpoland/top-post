const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const NoteSchema = new Schema({

    name:{
        type: String,
        required: false
    },

    message:{
        type: String,
        required: false
    },

    ranking:{
        type: Number,
        default: 0
    },

    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('notes', NoteSchema)