const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phonebookSchema = new mongoose.Schema({
  name: {
    type : String,
    required : true,
    minlength : 3,
    unique : true
  },
  number: {
    type : Number,
    min : 10000000,
    required : true,
  }
})
phonebookSchema.plugin(uniqueValidator)

const Person = mongoose.model('Person', phonebookSchema)



phonebookSchema.set('toJSON', {
    transform: (document,returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})

module.exports = mongoose.model('Person',phonebookSchema)