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

// ----- global arrays----------

// -------app calls -------------
// -------functions--------------
function showHome(req,res){
    console.log('you made it home!');
    res.render('./pages/index')
}
// ================== Initialization====================




// client.connect().then(() => {
app.listen(PORT, () => console.log('app is up on http://localhost:' + PORT));
// });
