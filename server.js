var express = require('express')
var fs = require('fs')
var { v4: uuidv4 } = require('uuid')
var path = require('path')

var app = express()
var PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

// html routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

// api routes
app.get('/api/notes', (req, res) => {
    fs.readFile("db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data))
    })
})

app.post('/api/notes', (req, res) => {
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
    }
    fs.readFile("db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
        let db = JSON.parse(data)
        db.push(newNote)

        fs.writeFile('db/db.json', JSON.stringify(db), (err) => {
            if (err) throw err;
            console.log("saved new note!")
        })
        res.sendFile(path.join(__dirname, "/public/notes.html"))
    })
})

app.delete('/api/notes/:id', (req, res) => {
    let clicked = req.params.id
    fs.readFile("db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
        let db = JSON.parse(data)

        let newDb = db.filter(item => item.id !== clicked)

        fs.writeFile('db/db.json', JSON.stringify(newDb), (err) => {
            if (err) throw err;
            console.log("note deleted!")
        })
        res.sendFile(path.join(__dirname, "/public/notes.html"))
    })
})

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("APP listening on port: http://localhost:" + PORT)
})