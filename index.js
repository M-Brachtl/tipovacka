const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());
app.listen('2024',()=>{ console.log("Server running on port 2024.") });

app.use(express.static(__dirname + '/frontend'))

app.get('/tips', (req, res) => {
    res.sendFile(__dirname + '/tips.json');
});
app.get('/director', (req, res) => {
    res.sendFile(__dirname + '/champ-director/index.html');
});
app.get('/director/style.css', (req, res) => {
    res.sendFile(__dirname + '/champ-director/style.css');
});
app.get('/director/script.js', (req, res) => {
    res.sendFile(__dirname + '/champ-director/script.js');
});
app.get('/help', (req, res) => {
    res.sendFile(__dirname + '/help.html');
});

app.post('/send', (req, res) => {
    const tips = req.body;
    let existingData = JSON.parse(fs.readFileSync('tips.json')).filter((tip) => tip[0] !== tips[0]);
    existingData.push(tips);
    fs.writeFile('tips.json', JSON.stringify(existingData), (err) => {
        if (err) throw err;
        console.log('Data has been written to tips.json');
    });
    res.send('Data has been written to tips.json');
});

app.post('/sendResults', (req, res) => {
    const results = req.body;
    const existingDataA = JSON.parse(fs.readFileSync('./frontend/gamesA.json'));
    const existingDataB = JSON.parse(fs.readFileSync('./frontend/gamesB.json'));
    //console.log(results);
    let gamesWritten = 1;
    let newAData = [];
    existingDataA.forEach((game) => {
        for(let i = 1; i < game.length; i++) {
            game[i].result = results[gamesWritten].hometeam + ' - ' + results[gamesWritten].awayteam;
            gamesWritten++;
        }
        newAData.push(game);
    });
    fs.writeFileSync('./frontend/gamesA.json', JSON.stringify(newAData));
    let newBData = [];
    existingDataB.forEach((game) => {
        for(let i = 1; i < game.length; i++) {
            game[i].result = results[gamesWritten].hometeam + ' - ' + results[gamesWritten].awayteam;
            gamesWritten++;
        }
        newBData.push(game);
    });
    fs.writeFileSync('./frontend/gamesB.json', JSON.stringify(newBData));
    
    res.send('Data has been written to gamesA.json');
});