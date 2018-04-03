// Movies model will go here. Functions
// should each take the db connection parameter
// as the first argument.

/**
 * Fetches all movies from database
 * @param  {PG Promise database connection} db
 * @returns {undefined}
 */
async function getAll(db) {
    let movies = [];
    let error = null;
    try {
        // TODO: Fill in the query
        const query = 'SELECT * FROM movies;';
        movies = await db.any(query);
    } catch (e) {
        // If there was an error, make the movies an
        // empty array and return the error.
        movies = [];
        error = e;
    }
    return {
        movies,
        error,
    };
}

/**
 * Fetches all movies with titles matching a search string
 * @param  {PG Promise database connection} db
 * @param  {String} title - A title for which to search
 * @returns {undefined}
 */
async function getByTitle(db, title) {
    let movies = [];
    let error = null;
    try {
        // TODO: Fill in the query
        const query = "SELECT * FROM movies WHERE title ILIKE '%" + title + "%';";
        console.log(query);
        movies = await db.any(query);
    } catch (e) {
        error = e;
    }
    return {
        movies,
        error,
    };
}


async function doWork(number){
    return number*2;
}

/**
 * Fetches a single movie by id from database
 * @param  {PG Promise database connection} db
 * @param  {Integer} id - An integer (either string or Number)
 * @returns {undefined}
 */
async function getByID(db, id) {
    let movie = null;
    let error = null;
    try {
        // TODO: Fill in the query
        const query = 'SELECT * FROM movies WHERE id=' + id + ';';
        movie = await db.one(query);
        
    } catch (e) {
        error = e;
        movie = null;
    }
    return {
        movie,
        error,
    };
}


module.exports = {
    getAll,
    getByTitle,
    getByID,
    doWork
};
