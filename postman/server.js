const express = require('express');
const app = express();
app.use(express.json());


let students = [
    { id: 1, name: "kash" }
]
//get
app.get('/get', (req, res) => {
    res.send(students);
})


app.get('/get/:id', (req, res) => {
    let s = students.find(x => x.id == req.params.id);
    res.send(s);
})

//post

app.post('/add', (req, res) => {
    students.push(req.body);
    res.send("added");

})

//upadte

app.put('/put/:id', (req, res) => {
    let s = students.find(x => x.id == req.params.id);
    if (s) s.name = req.body.name;
    res.send("updated");
})

app.delete('/delete/:id', (req, res) => {
    students = students.filter(x => x.id != req.params.id);
    res.send("deleted");
})

app.listen(3000, () => console.log("Server started"));