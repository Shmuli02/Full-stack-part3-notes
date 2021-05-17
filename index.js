const express = require('express')
const app = express()
const morgan = require('morgan')

const generateId = () => {
    const id = Math.floor(Math.random() * 1000)
    return id
}

let persons = [
      {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
      },
      {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      }
    ]

app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req,res) => {

    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req,res) => {
    const body = req.body
    const new_person = {
        name : body.name,
        number : body.number,
        id : generateId()
    }
    if (!body.name) {
        return res.status(400).json({
            error : 'name missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error : 'number missing'
        })
    }

    console.log(persons.filter(person => person.name === body.name))
    if (persons.filter(person => person.name === body.name).length == 0) {
        persons = persons.concat(new_person)
    
        res.json(persons)
        
    } else {
        return res.status(400).json({
            error : 'name must be unique'
        })
    }

    
})




app.get('/info',(req,res) => {
    const persons_legth = persons.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons_legth} people </p><p>${date}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)