//Importing modules 
const express = require('express'); 
const sqlite3 = require('sqlite3').verbose();
  
const app = express(); 
const PORT = 3000; 

//start Express Server 
app.listen(PORT, ()=>{ 
    console.log("Database connection is Ready and "
            + "Server is Listening on Port ", PORT); 
});

// Open SQLite database connection
const db = new sqlite3.Database('./database/quotes.db', (err) => {
    if (err) {
    console.error('Error opening database:', err.message);
    } else {
    console.log('Connected to the SQLite database.');
    }
});

// Function to get a random element from an array
function getRandomElement(array) {
    const idx = Math.floor(Math.random() * array.length);
    return array[idx];
}

// get all table names from db

function getRandomQuote() {

    return new Promise((resolve, reject) => {
        db.all("SELECT name FROM sqlite_master where type='table';", (err, rows) => {
            if (err) {
                console.error('Error querying table names:', err.message);
                reject(err);
            } else {
                const animes = rows.map(row => row.name);
                const anime = getRandomElement(animes)
                const query = `SELECT * FROM ${anime} ORDER BY RANDOM() LIMIT 1`;

                // Execute the query
                db.get(query, (err, row) => {
                    if (err) {
                        console.error(`Error querying random row from table ${anime}:`, err.message);
                        resolve('error')
                    } else {
                        console.log(row);
                        resolve(row);
                    }
                });
            }
        });
    });
}

app.get('/', (req, res) => {
    getRandomQuote()
        .then(randomQuote => {
            if (randomQuote !== 'error') {
                res.json(randomQuote);
            } else {
                res.redirect('/');
            }
        })
        .catch(err => {
            // Handle error
            res.status(500).send('Internal Server Error');
        });
})