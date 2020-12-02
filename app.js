const express = require('express');
const ejs = require('ejs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/mydb";
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
const app = express();

{ useUnifiedTopology: true }
//promise
mongoose.Promise = global.Promise;
const keys = require('./config/keys');

//connet to mongoose
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
	useUnifiedTopology: true
})
    .then(() => console.log('Mongo is connected'))
    .catch(err => console.log(err));

//mongoose.connect(kets.mongoURI, {useUnifiedTopology: true});

//session var middleware
app.use(session({secret:'XASDAasdiuDA',saveUninitialized: true,resave: true}));

app.use(bodyParser.urlencoded({ extended: true })); 

//database stuff
// require('./models/feedbacks');
// const Feedback = mongoose.model('feedbacks');
 require('./models/notes');
 const Note = mongoose.model('notes');


//starts ejs
app.set('view engine', 'ejs');

app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/views", express.static(path.join(__dirname, 'views')));

app.use(express.static("./views"));

app.get('/', (req, res) => {
    Note.find({}, null, {sort: {ranking: 1}}, (err, notes) => {
        if (err) return console.log(err);

        res.render('index', { notes: notes });
    });
});

app.get('/', (req, res) => {
    console.log(req.body.name);
    var note={
        name: req.body.name,
        message: req.body.message
    }
    console.log(note);
    new Note(note)
        .save();

    res.writeHead(301,
        {Location: "http://192.168.0.100:5004/"}
        );
    res.end();
});

app.get('/upvote', (req, res) => {
    
        console.log(req.body.id)
    Note.findOne({_id: req.body.id},(err,note)=>{
        console.log(note);
    }).then(note => {

        note.ranking = note.ranking += 1;
   
        note.save()
        res.writeHead(301,
            {Location: "http://192.168.0.100:5004/"}
            );
        res.end();
    })
});

app.post('/downvote', (req, res) => {
    console.log("minus one");
       
    console.log(req.body.id)
    Note.findOne({_id: req.body.id},(err,note)=>{
        console.log(note);
    }).then(note => {

        note.ranking = note.ranking -= 1;
   
        note.save()
        res.writeHead(301,
            {Location: "http://192.168.0.100:5004/"}
            );
        res.end();
    })
});

const port = 5004;

app.listen(port, () => console.log(`server started on ${port}`));
