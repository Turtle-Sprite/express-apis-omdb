require('dotenv').config();
const express = require('express');
const axios = require('axios')

// const ejsLayouts = require('express-ejs-layouts');
const app = express();


//imdb key
const API_KEY = process.env.API_KEY

// Sets EJS as the view engine
app.set('view engine', 'ejs');
// Specifies the location of the static assets folder
app.use(express.static('static'));
// Sets up body-parser for parsing form data
app.use(express.urlencoded({ extended: false }));
// // Enables EJS Layouts middleware
// app.use(ejsLayouts);

// Adds some logging to each request
app.use(require('morgan')('dev'));

// Routes
app.get('/', function(req, res) {
  res.render('index.ejs');
});

//GET /results take in data from form and render API response
app.get('/results', async (req, res) => {
  try {
     //query strings come from the req-query, in index.ejs the name="results"
  // console.log(req.query.results)
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${req.query.results}`
  const response = await axios.get(url)
    // res.json(response.data)
    res.render('results.ejs', {
      films: response.data.Search,
      title: req.query.results
    })
  } catch{
    //console log the specfics of the error, but keep them private
    console.log('burning', error)
    res.status(500).send('internal server error')
  }
 
})

// GET /movies/:o\imdbID -- renders a single movies details
app.get('/movies/:imdbID', async (req, res) => {
  try{
    //url route parameter come in on the req.params
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${req.params.imdbID}`
    console.log(req.params)
    const response = await axios.get(url) 
    // res.json(response.data)
    res.render('detail.ejs', {
      film: response.data
    })
  } catch {
    console.log('burning', error)
    res.status(500).send('internal server error')
  }
})

// app.get('/results', async (req, res) => {
//   let results = req.query.query
  
//     try {
//         const baseUrl = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${results}`
//         console.log(baseUrl)
//         const response = await axios.get(baseUrl)
//         const data = response.data

//         console.log(data.Search[0])

//         res.render('results.ejs', {
//           myData: data
//         })
//     } catch (error) {
//         // console log the specfics of the error, but keep them private
//             console.log('burning', error)
//             res.status(500).send('internal server error')
//     }
// })

// The app.listen function returns a server handle
var server = app.listen(process.env.PORT || 3000);

// We can export this server to other servers like this
module.exports = server;
