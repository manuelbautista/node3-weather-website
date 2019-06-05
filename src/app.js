const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
// console.log(__dirname);
// console.log(path.join(__dirname, '../public'));

const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views') ;
const partialPath = path.join(__dirname, '../templates/partials')
//search for views folder
app.set('view engine', 'hbs');
//set the views folder to the viewpath
app.set('views', viewsPath);

hbs.registerPartials(partialPath);

//index.html from public
app.use(express.static(publicDirectoryPath));

//Home page
app.get('', (req, res)=> {
    //res.send('Hello Express');
    res.render('index', {
        title: 'Weather app',
        name: 'Manuel Bautista'
    });
})

app.get('/about', (req, res)=> {
    //res.send('Hello Express');
    res.render('about', {
        title: 'About Webpage',
        name: 'Manuel Bautista'
    });
})
app.get('/help', (req, res)=> {
    //res.send('Hello Express');
    res.render('help', {
        title: 'Help webpage',
        name: 'Manuel Bautista'
    });
})
app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})
app.get('/help/*', (req, res)=> {
    res.send('Help page article not found');

})

// app.get('/help', (req, res)=> {
//     res.send([
//         {
//             name: 'Manuel',
//             age: 32
//         }, 
//         {
//             name: 'Juan',
//             age: 55
//         }]);
// })
// app.get('/about', (req, res)=> {
//     res.send('<h1>About page</h1>');
// })
app.get('/weather', (req, res)=> {
    if(!req.query.address) {
        return res.send( {
            error: 'You must provide address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error){
            return res.send({
                error: error
            });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({
                    error: error
                });
            }
            res.send({
                location: location,
                forecastData: forecastData
            })
        })
    })
})

app.get('*', (req, res) => {
    res.render('404')
})

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});