// ================== packages==========================

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
require('dotenv').config();
const pg = require('pg');
const methodOverride = require('method-override');
const google = require('@googlemaps/js-api-loader');
const polyline = require('google-polyline');

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

app.set('view engine', 'ejs');

// ----------POST--------------

// urlencoded for forms to request body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ================== Routes. ==========================

// -------app calls -------------
app.get('/', showHome);
app.get('/search', getSearchData);
app.get('/results', showResults);
app.get('/route', popRoute);
app.get('/locations', sendLocations);
app.get('/save', saveToDb);
app.get('/savedRoute',popSavedRoute);
app.get('/about', renderAboutUs);

// ----- global arrays----------

let waypoints = [];
let routeData = [];

// -------functions--------------


function showHome(req, res) {
    const SqlString = 'SELECT * FROM trip';
    const SqlArray = [];
    client.query(SqlString, SqlArray)
        .then(data => {
            const ejsObject = { data: data.rows };
            res.render('./pages/index', ejsObject);
        });
}

function getSearchData(req, res) {
    routeData = [];
    routeData.push(req.query);
    superagent.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${req.query.origin}&destination=${req.query.desination}&key=${process.env.PLACES_API_KEY}`)
        .then(results => {
            waypoints = [];

            // this is the polyline data for the corridor around the route
            waypoints.push(polyline.decode(results.body.routes[0].overview_polyline.points));
            waypoints.push(req.query);

            res.redirect('/results');

        });
}
function showResults(req, res) {
    superagent.get('https://maps.googleapis.com/maps/api/js?key=AIzaSyC-dTRvv8zLeknO1PlTo27lXeWbC3JxCg4&callback=initMap&libraries=&v=weekly')
        .then(results => {
            res.render('./pages/results');
        });
}
function popRoute(req, res) {
    res.send(waypoints);
}

function sendLocations(req, res) {
    res.send(routeData);
}

function saveToDb(req, res) {
    const SqlString = 'INSERT INTO trip (origin, desination, category, waypoints) VALUES($1,$2,$3, $4)';
    const SqlArray = [routeData[0].origin, routeData[0].desination, routeData[0].category, JSON.stringify(waypoints[0])];
    client.query(SqlString, SqlArray)
        .then(data => {
            res.render('./pages/results');
        });
}

function popSavedRoute(req,res){
    const SqlString = `SELECT * FROM trip WHERE id=$1`;
    const SqlArray = [req.query.saved];
    client.query(SqlString,SqlArray)
        .then(data => {
            console.log(' this data is from the DB===>', JSON.parse(data.rows[0].waypoints));
            console.log(data.rows[0]);
            waypoints= [];
            routeData= [];
            waypoints.push(JSON.parse(data.rows[0].waypoints));
            waypoints.push(data.rows[0]);
            routeData.push(data.rows[0]);
            res.render('./pages/results');
        });
}
function renderAboutUs(req,res){
    res.render('./pages/about');
}



// ================== Initialization====================




client.connect().then(() => {
    app.listen(PORT, () => console.log('app is up on http://localhost:' + PORT));
});
