const express = require('express');
const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('./public'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})



app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', "utf-8", (err, data) => {
        if (err) {
            throw err
        } else {
            const notes = JSON.parse(data);
            res.json(notes)
        }
    })
})


app.post('/api/notes', (req, res) => {
    const {
        title,
        text
    } = req.body
    if (req.body) {
        const newNotes = {
            id: uuidv4(),
            title,
            text
        };
        console.log(newNotes)
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                throw err
            } else {
                console.log(data);
                const note = JSON.parse(data);
                note.push(newNotes)
                console.log(req.body);
                fs.writeFile('./db/db.json', JSON.stringify(note, null, 2), (err, data) => {
                    console.log(data)
                    if (err) {
                        throw err
                    } else {
                        res.json(note)
                    }
                })
            }
        })
    }

})


app.delete('/api/notes/:id', (req, res) => {

    const id = req.params.id
    console.log(id)
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            throw err
        }
        const newData = JSON.parse(data)
        const deleteId = newData.filter(idSet => idSet.id !== id)
        console.log(deleteId)

        fs.writeFile('./db/db.json', JSON.stringify(deleteId, null, 2), (err, data) => {
            if (err) {
                throw err
            } else {
                res.json(deleteId)
                console.log('success!!')
            }
        })

    })
})


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})




app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);