require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const generateId = () => {
    const id = Math.floor(Math.random() * 1000)
    return id
}


app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.log(error.name)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error : error.message })
    }
    
    next(error)
  }


app.get('/api/persons', (req, res,next) => {
    Person.find({}).then(person => {
        res.json(person)
    })
})

app.get('/api/persons/:id', (req,res) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.delete('/api/persons/:id', (req,res,next) => {
    const body = req.body

    const person = {
        name : body.name,
        number : body.number,
    }
    Person.findByIdAndDelete(req.params.id, person)
        .then(updatedPersons => {
            res.json(updatedPersons)
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (req,res,next) => {
    const body = req.body
    const new_person = new Person({
        name : body.name,
        number : body.number
    });

    new_person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req,res,next) => {
    const body = req.body

    const person = {
        name : body.name,
        number : body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})




app.get('/info',(req,res) => {
    const persons_legth = persons.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons_legth} people </p><p>${date}</p>`)
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)