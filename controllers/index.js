// Controllers should go here. No controllers
// in the server.js please.

const models = require('../models/index_model.js');

/**
 * Controller that renders a list of movies
 * @param  {Request} req - An express request object
 * @param  {Response} res - An express response object
 * @returns undefined
 */
 
async function index(req, res) {
    res.render('index');
}
 
async function form(req, res) {
    //gets an input from user and print it back on the page
    var result = {title: req.query.title};
    console.log(result);
    res.render('form',result);
}


async function details(req, res) {
    res.render('movie-details');
}

async function api(req, res) {
    var result = await models.doWork(req.query.number);
    res.send(`${result}`);
}

async function database(req, res) {
    const db = req.app.get('db');
    let result = {
        movies: [],
        error: null,
    };
    // TODO: fill me in. Get all the movies
    // here and send them to the template/view.
    var title = req.query.title;
    if (title == null){
        result.movies = await models.getAll(db);
    }
    else{
        result.movies = await models.getByTitle(db, title);
    }
    
    res.render('database', result.movies);
}
module.exports = {
    index,
    form,
    details,
    api,
    database
};
