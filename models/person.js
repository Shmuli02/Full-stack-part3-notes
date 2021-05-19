const mongoose = require('mongoose')

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
    name: String,
    number: String,
    })

const Person = mongoose.model('Person', phonebookSchema)


if (process.argv.length == 3) {
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note.name, note.number)
    })
    mongoose.connection.close()
  })
}


if (process.argv.length == 5) {
  const person = new Person({
    name : process.argv[3],
    number : process.argv[4]
  })
  
  person.save().then(response => {
    console.log('note saved!')
    mongoose.connection.close()
  })
}

phonebookSchema.set('toJSON', {
    transform: (document,returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})

module.exports = mongoose.model('Person',phonebookSchema)