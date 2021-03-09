// ================== packages==========================


const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
require('dotenv').config();
const pg = require('pg');
const methodOverride = require('method-override');

// ================== app ==============================

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3004;

// ----------SQL-------------

const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error', error => console.log(error));

// --------DB TABLE set up ------
/*
const SqlString = '';
const SqlArray = [];
client.query(SqlString,SqlArray);
*/


// ----------EJS---------------

app.use(express.static('./public'));
// urlencoded for forms to request body
app.set('view engine', 'ejs');

// ----------POST--------------

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ================== Routes. ==========================

app.get('/', showHome);
app.get('/search', getSearchData)

// ----- global arrays----------

// -------app calls -------------
// -------functions--------------
function showHome(req,res){
    console.log('you made it home!');
    res.render('./pages/index');
}

function getSearchData(req, res){
    console.log(req.query);
    console.log(req.query.departure);
    console.log(req.query.arrival);
    // superagent.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.query.categories}&key=${process.env.PLACES_API_KEY}`)
    superagent.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${req.query.departure}&destination=${req.query.arrival}&key=${process.env.PLACES_API_KEY}`)
        .then(results=>{
            console.log(results.body);
        })
}
// ================== Initialization====================




// client.connect().then(() => {
app.listen(PORT, () => console.log('app is up on http://localhost:' + PORT));
// });


// google api url

// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=harbour&key=YOUR_API_KEY

// https://maps.googleapis.com/maps/api/place/textsearch/json?query=123+main+street&key=YOUR_API_KEY
