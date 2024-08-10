const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot');
const cron = require('node-cron');

const app = express();
const port = 8000;

app.use(bodyParser.json());

let repositoriesData = []; 
let profileData = {};

const performScraping = async () => {
    try {

        const git = "https://github.com/Aailmz" //Change to your github account link!

        const url = git + "?tab=repositories"; 
        await bot.init();

        repositoriesData = await bot.scrapeRepositories(url);
        profileData = await bot.scrapeProfile(url);
        
        await bot.close();
        console.log('Scraping successful');
        startServer(); 
    } catch (e) {
        console.log('Scraping failed', e);
    }
};

const startServer = () => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}/welcome`); //You can change the host and port.
    });
};

app.get('/welcome', async (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Your GitHub</title>
            </head>
            <body>
                <h1>Hi There!</h1>
                <p>For now, you can use this following endpoints:</p>
                <ul>
                    <li><strong>/repositories</strong> - To shows all your repositories.</li>
                    <li><strong>/profile</strong> - To shows your profile information.</li>
                </ul>
                <ul>
                    <p>Github/Aailmz - Mirza Zubari</p>
                </ul>
            </body>
        </html>
    `);
});

app.get('/repositories', (req, res) => {
    res.json(repositoriesData); 
});

app.get('/profile', (req, res) => {
    res.json(profileData);
});

cron.schedule('0 * * * *', () => {
    console.log('Running scheduled scraping');
    performScraping();
});

performScraping();
