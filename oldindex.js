const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/aboutme', (req, res) => {
    res.send('Aboutme section')
  })

app.get('/projects', (req, res) => {
res.send('Projects content')
})

app.get('/services', (req, res) => {
    res.send('services content')
  })

app.get('/contact', (req, res) => {
  res.send('Contact items')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})