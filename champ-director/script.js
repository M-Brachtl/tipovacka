function countPoints(correct,guess){
    if (correct === "- : -"){
        return "---";
    }else{
    if (correct === guess){
        return 30;
    }else if(
        correct.split(':')[0].trim() > correct.split(':')[1].trim() && guess.split(':')[0].trim() > guess.split(':')[1].trim()
        ||
        correct.split(':')[0].trim() < correct.split(':')[1].trim() && guess.split(':')[0].trim() < guess.split(':')[1].trim()
        ||
        correct.split(':')[0].trim() === correct.split(':')[1].trim() && guess.split(':')[0].trim() === guess.split(':')[1].trim()
        ){
        let score = Math.abs(parseInt(correct.split(':')[0].trim()) - parseInt(guess.split(':')[0].trim())) + Math.abs(parseInt(correct.split(':')[1].trim()) - parseInt(guess.split(':')[1].trim()));
        
        return 20 - score;
    }else{
        return 0;
    }
    };
}

// get players and tips
fetch('http://localhost:2024/gamesA.json').then(response => response.json()).then(games => {
    let results = [];
    let gamesCount = 0;
    games.forEach(gameDay => {
        gamesCount += gameDay.length - 1;
    });
    console.log(gamesCount);
    games.forEach(dateGames => {
        // For each date, iterate over the games
        dateGames.slice(1).forEach(gameInstance => {
            // For each game, push it to the results array
            results.push(gameInstance);
        });
    });
    for (let index = 0; index < gamesCount; index++) {
        const game = document.createElement('tr');
        game.id = 'game' + (index + 1);
        game.style.borderLeft = 'red solid 3px';
        document.querySelector('table').appendChild(game);
        const homeTeam = document.createElement('td');
        const awayTeam = document.createElement('td');
        const gameResult = document.createElement('td');
        homeTeam.textContent = results[index].player1;
        awayTeam.textContent = results[index].player2;
        gameResult.textContent = results[index].result;
        gameResult.classList.add('results');
        game.appendChild(homeTeam);
        game.appendChild(awayTeam);
        game.appendChild(gameResult);
        if(index === gamesCount - 1){
            game.style.borderBottom = 'black solid 5px';
        }
    }
    })
    .then( () => {
        
        fetch('http://localhost:2024/gamesB.json').then(response => response.json()).then(games => {
            let results = [];
            let gamesCount = 0;
            games.forEach(gameDay => {
                gamesCount += gameDay.length - 1;
            });
            games.forEach(dateGames => {
                // For each date, iterate over the games
                dateGames.slice(1).forEach(gameInstance => {
                    // For each game, extract the 'result' value and push it to the results array
                    results.push(gameInstance);
                });
            });
            for (let index = 0; index < gamesCount; index++) {
                console.log("I'm here");
                const game = document.createElement('tr');
                game.style.borderLeft = 'blue solid 3px';
                game.id = 'game' + (index + 1 + 28);
                document.querySelector('table').appendChild(game);
                const homeTeam = document.createElement('td');
                const awayTeam = document.createElement('td');
                const gameResult = document.createElement('td');
                homeTeam.textContent = results[index].player1;
                awayTeam.textContent = results[index].player2;
                gameResult.textContent = results[index].result;
                gameResult.classList.add('results');
                game.appendChild(homeTeam);
                game.appendChild(awayTeam);
                game.appendChild(gameResult);
            }
            })
    .then( () => {
        fetch('http://localhost:2024/tips')
            .then
                (response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById('usersCount').textContent = data.length;
                for (let ind = 0; ind < data.length; ind++) {
                    const playerData = data[ind];
                    console.log(playerData.length);
                    const player = document.createElement('th');
                    player.colSpan = 2;
                    player.textContent = playerData[0];
                    document.querySelector('#head').appendChild(player);
                
                    for (let index = 1; index < playerData.length; index++) {
                        const tip = playerData[index];
                        const tipElement = document.createElement('td');
                        tipElement.textContent = tip.hometeam + ' : ' + tip.awayteam;
                        tipElement.classList.add('tip');
                        tipElement.classList.add('user' + (ind+1));
                        document.querySelector('#game' + index).appendChild(tipElement);
                        const pointsTD = document.createElement('td');
                        pointsTD.classList.add('points');
                        pointsTD.classList.add('user' + (ind+1));
                        document.querySelector('#game' + index).appendChild(pointsTD);
                    }
                }
                // create total points field
                for (let ind = 0; ind < data.length; ind++){
                    console.log(ind);
                    const totalPoints = document.createElement('td');
                    totalPoints.classList.add('ttl-points');
                    totalPoints.id = 'total-points' + (ind+1);
                    totalPoints.textContent = 0;
                    document.getElementById('ranking').appendChild(totalPoints);
                    // create ranking field
                    const ranking = document.createElement('td');
                    ranking.classList.add('ranking');
                    ranking.textContent = 0;
                    document.getElementById('ranking').appendChild(ranking);
                }
            }).then( () => {
                // count points
                for(let i = 1; i <= parseInt(document.getElementById('usersCount').textContent); i++){
                let allPoints = 0;
                const results = document.querySelectorAll('.results');
                const tips = document.querySelectorAll('.tip.user' + i);
                const points = document.querySelectorAll('.points.user' + i);
                console.log(points.length);
                console.log(tips.length);
                for (let index = 0; index < results.length; index++) {
                    //console.log(index);
                    let reward = countPoints(results[index].textContent,tips[index].textContent);
                    allPoints += parseInt(0 + reward);
                    points[index].textContent = reward;
                }
                document.getElementById('total-points' + i).textContent = allPoints;
                };
            }).then(()=>{
                const pointFields = document.querySelectorAll('.ttl-points');
                const rankings = document.querySelectorAll('.ranking');
                // ranking of players
                let points = [];
                for (let index = 0; index < pointFields.length; index++) {
                    points.push(parseInt(pointFields[index].textContent));
                }
                points.sort(function(a, b){return b - a});
                for (let index = 0; index < rankings.length; index++) {
                    rankings[index].textContent = points.indexOf(parseInt(pointFields[index].textContent)) + 1 + ". místo";
                }
            });
    });
});



