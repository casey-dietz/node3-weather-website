const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// This function is setting up the index.html static file in the public directory to serve.
app.use(express.static(publicDirectoryPath))


// The app.get() functions below is setting up a server to send a response to get something at the root route. We use the .get() method on app which is our express variable. The .get() method lets us configure what the server should do when the user tries to get the resource at the url. We will either be sending the client HTML or JSON. The get method takes in two args, the first is the route, and the second arg is a function. The function is where we describe what we want to do when the user visits the route. The function has two args, the first is an object containing info about the incoming request (req) to the server. The other arg is response (res), the res arg contains a bunch of methods allowing us to customize what we're going to send back to the requester.

// app.com   <- the root route | also can use '/'
// app.com/help  <- the /help route
// app.com/about  <- the /about route
// app.com/weather  <- the /weather route

// we are always going to either be sending back HTML designed to be rendered in the browser or we're going to be sending JSON designed to be consumed and used by code. When sending JSON you can send a single object or an array of objects.

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Casey Dietz'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Casey Paul Dietz'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Casey Dietz'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address

    if (!address) {
        return res.send({
            error: 'You must provide an address',
        })
    }
    geocode(address, (err, { latitude, longitude, location } = {}) => {
        if (err) {
            return res.send({ error: err})
        }

        forecast(latitude, longitude, (err, forecastData) => {
            if (err) {
                return res.send({ error: err })
            }

            res.send({
                forecast: forecastData,
                location,
                address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term',
        })
    }
    res.send({
        products: []
    })
})

// 404 page has to be at the end of all the endpoints
app.get('/help/*' , (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Casey Dietz',
        errorMessage: 'Help article not found'
    })
})

// 404 page has to be at the end of all the endpoints
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Casey Dietz',
        errorMessage: 'Page not found.'
    })
})

// The .listen method is used once to spin up the server. It takes in the Port and a callback, displaying a message notifying yourself the server is running.
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})