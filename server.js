// ================== packages==========================


const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
require('dotenv').config();
const pg = require('pg');
const methodOverride = require('method-override');
const google = require('@googlemaps/js-api-loader');
// const { Loader } = require('@googlemaps/js-api-loader');
var polyline = require('google-polyline');
// const loader = new google.maps.loader.Loader({
//     apiKey: process.env.PLACES_API_KEY,
//     version: 'weekly',
// });
// const { Client } = require("@googlemaps/google-maps-services-js");
// ================== app ==============================

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3004;

// ----------SQL-------------

const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error', error => console.log(error));
// const googleClient = new Client({});

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
app.get('/search', getSearchData);
app.get('/results', showResults);
app.get('/route', popRoute);
app.get('/locations', sendLocations);
app.get('/save', saveToDb);
app.get('/savedRoute',popSavedRoute);
app.get('/about', renderAboutUs);
// ----- global arrays----------
// -------app calls -------------
// -------functions--------------
function showHome(req, res) {
    console.log('you made it home!');
    const SqlString = 'SELECT * FROM trip';
    const SqlArray = [];
    client.query(SqlString, SqlArray)
        .then(data => {
            console.log(' this data is from the DB===>', data);
            const ejsObject = { data: data.rows };
            console.log(ejsObject);

            res.render('./pages/index', ejsObject);
        });

}

let waypoints = [];
let routeData = [];
function getSearchData(req, res) {
    // this gets the array of points
    // TODO res.send the array of points
    console.log("This is query", req.query);
    console.log(req.query.origin);
    console.log(req.query.desination);
    routeData = [];
    routeData.push(req.query);
    // superagent.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.query.categories}&key=${process.env.PLACES_API_KEY}`)
    // superagent.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${req.query.departure}&destination=${req.query.arrival}&key=${process.env.PLACES_API_KEY}`)
    superagent.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${req.query.origin}&destination=${req.query.desination}&key=${process.env.PLACES_API_KEY}`)
        .then(results => {
            console.log(results.body);
            waypoints = [];
            // this is the polyline data for the corridor around the route
            // =========================
            // console.log("this is the raw polyline data",results.body.routes[0].overview_polyline);
            waypoints.push(polyline.decode(results.body.routes[0].overview_polyline.points));
            waypoints.push(req.query);
            // console.log("this is the decoded waypoint data",waypoints);
            res.redirect('/results');

        });
}
function showResults(req, res) {
    console.log('results!');
    superagent.get('https://maps.googleapis.com/maps/api/js?key=AIzaSyC-dTRvv8zLeknO1PlTo27lXeWbC3JxCg4&callback=initMap&libraries=&v=weekly')
        .then(results => {
            // console.log(results);
            // initMap();
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
    console.log('trying to save');
    console.log(routeData);
    console.log(waypoints);
    const SqlString = 'INSERT INTO trip (origin, desination, category, waypoints) VALUES($1,$2,$3, $4)';
    const SqlArray = [routeData[0].origin, routeData[0].desination, routeData[0].category, JSON.stringify(waypoints[0])];
    client.query(SqlString, SqlArray)
        .then(data => {
            console.log('added this data to the DB===>', data);
            res.render('./pages/results');
            return;
        });
}

// $('#saved').on('changed', popForm);

function popSavedRoute(req,res){
    console.log("you tryin to populate the form?");
    console.log(req.query);
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

            // res.render('./pages/index', ejsObject);
        });

}
function renderAboutUs(req,res){
    res.render('./pages/about')
}
//  --------this is example data that works -------------
// googleClient
//     .elevation({
//         params: {
//             locations: [{ lat: 45, lng: -110 }],
//             key: "AIzaSyC-dTRvv8zLeknO1PlTo27lXeWbC3JxCg4",
//         },
//         timeout: 1000, // milliseconds
//     })
//     .then((r) => {
//         console.log("this is elevation data", r.data.results[0].elevation);
//     })
//     .catch((e) => {
//         console.log(e.response.data.error_message);
//     });


// ================== Initialization====================




client.connect().then(() => {
    app.listen(PORT, () => console.log('app is up on http://localhost:' + PORT));
});
// const loader = new Loader({
//     apiKey: process.env.PLACES_API_KEY,
//     version: "weekly",
//     libraries: ["places"]
// });
// const mapOptions = {
//     center: {
//         lat: -34.397,
//         lng: 150.644
//     },
//     zoom: 4
// };

// loader
//     .load()
//     .then(() => {
//         //     new google.maps.Map(document.getElementById("map"), mapOptions;
//         // })
//         let map;

//         function initMap() {
//             map = new google.maps.Map(document.getElementById("map"), {
//                 center: { lat: -34.397, lng: 150.644 },
//                 zoom: 8,
//             });
//         }
//     });
// google api url

// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=harbour&key=YOUR_API_KEY

// https://maps.googleapis.com/maps/api/place/textsearch/json?query=123+main+street&key=YOUR_API_KEY
