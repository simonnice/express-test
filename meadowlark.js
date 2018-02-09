const express = require('express')
const app = express()
let fortune = require('./lib/fortune.js')

// Set up handlebars view engine
let handlebars = require('express-handlebars')
            .create({defaultLayout:'main' })
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

//  Express is also providing us a 
//  convenience method, res.type, 
//  which sets the Content-Type header

//res.type('text/plain') // Sets Content type header
//res.send('Meadowlark Travel') // Express extension
// These two are not needed when views have been rendered through
// handlebars because handlebars view engine handles content type
// and status code 200 by default.
// Instead we use res.render() to render the correct view

// Setting upp example of dynamic information - 
//Fortune cookie array

app.set('port', process.env.PORT || 3000)

// Declaring static middleware for public files JS, CSS, Images
app.use(express.static(__dirname + '/public'));

// Declaring middleware to detect if test website
app.use( (req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' &&
                req.query.test === '1'
    next()
})


// Home Page Route
app.get('/', (req, res) => {
    res.render('home')
})

// About Page Route - 
// rendering a variable containing random index of fortune
app.get('/about', (req, res) => {
    res.render('about', { 
            fortune: fortune.getFortune(),
            pageTestScript: '/qa/tests-about.js'
        })
})

// Tour Hood River Route
app.get('/tours/hood-river', (req, res) => {
    res.render('tours/hood-river')
})

// Tour Hood River request Rate Route
app.get('/tours/request-group-rate', (req, res) => {
    res.render('tours/request-group-rate')
})

// 404 catch-all handler page (middleware)
app.use((req, res) => { // app.use here instead because it is Middleware
    res.status(404)
    res.render('404')
})

// 500 error handler page (middleware)
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500)
    res.render('500')
})

app.listen(app.get('port'), function () {
    console.log(`Express started on http://localhost:${app.get('port')} ; press ctrl-c to terminate.`)
} )