const fs = require('fs')
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//Html routes
app.get("/", (req, res) => {
    res.sendFile("index.html")
})
app.get("/notes", (req, res) => {
    res.sendFile("/public/notes.html", { root: __dirname })
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        var jisike = JSON.parse(jsonString)
        res.send(jisike)
    })
})

app.post("/api/notes", (req, res) => {
    let noteData = req.body;

    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        var jisike = JSON.parse(jsonString)

        jisike.unshift(noteData)
        let id = 0;
        var jisike = jisike.map(note => {
            return {...note, id: id++}
        })
        var jisikeString= JSON.stringify(jisike)
        fs.writeFile('./db/db.json', jisikeString, function (err) {
            if (err) throw err;
            console.log('Replaced!');
          });
          res.send(jisike)
    });
})

app.delete("/api/notes/:id", (req,res) => {
    let id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        let parsed = JSON.parse(jsonString)
        let newArr = []
        parsed.forEach(note => {
            if(note.id != id) {
                newArr.push(note)
            }
        })
        let stringed = JSON.stringify(newArr)
        fs.writeFile('./db/db.json', stringed, function (err) {
            if (err) throw err;
        });
        res.send(newArr);
    })
})


// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));