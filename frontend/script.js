function getDayPattern(dayNum, date, group) {
    return `<table id="${dayNum}-${group}">
    <tr><th style="background-color: lightgray;" colspan="6">${date}</th></tr>
    <tr>
        <th colspan="2">Domácí:</th>
        <th colspan="2">Hosté:</th>
        <th>Výsledek:</th>
        <th class="tipyHeader">Tipy:</th>
    </tr>
</table>`;
};
function getGamePattern(gameNum, player1, player2, flag1Link, flag2Link, result = "- : -") {
    return `<tr id="game${gameNum}">
<td>${player1}</td>
<td class="image-field"><img src=${flag1Link} alt=""></td>
<td>${player2}</td>
<td class="image-field"><img src=${flag2Link} alt=""></td>
<td class="result">${result}</td>
<td class="tip"><input type="number"><input type="number"></td>
</tr>`;
};

const localisation = {
    Czechia: {
        name: "Česko",
        flag: "https://flagicons.lipis.dev/flags/4x3/cz.svg"
    },
    Slovakia: {
        name: "Slovensko",
        flag: "https://flagicons.lipis.dev/flags/4x3/sk.svg"
    },
    Poland: {
        name: "Polsko",
        flag: "https://flagicons.lipis.dev/flags/4x3/pl.svg"
    },
    "United States": {
        name: "Spojené státy",
        flag: "https://flagicons.lipis.dev/flags/4x3/us.svg"
    },
    Canada: {
        name: "Kanada",
        flag: "https://flagicons.lipis.dev/flags/4x3/ca.svg"
    },
    Austria: {
        name: "Rakousko",
        flag: "https://flagicons.lipis.dev/flags/4x3/at.svg"
    },
    Denmark: {
        name: "Dánsko",
        flag: "https://flagicons.lipis.dev/flags/4x3/dk.svg"
    },
    Finland: {
        name: "Finsko",
        flag: "https://flagicons.lipis.dev/flags/4x3/fi.svg"
    },
    France: {
        name: "Francie",
        flag: "https://flagicons.lipis.dev/flags/4x3/fr.svg"
    },
    Germany: {
        name: "Německo",
        flag: "https://flagicons.lipis.dev/flags/4x3/de.svg"
    },
    "Great Britain": {
        name: "Velká Británie",
        flag: "https://flagicons.lipis.dev/flags/4x3/gb.svg"
    },
    Kazakhstan: {
        name: "Kazachstán",
        flag: "https://flagicons.lipis.dev/flags/4x3/kz.svg"
    },
    Latvia: {
        name: "Lotyšsko",
        flag: "https://flagicons.lipis.dev/flags/4x3/lv.svg"
    },
    Norway: {
        name: "Norsko",
        flag: "https://flagicons.lipis.dev/flags/4x3/no.svg"
    },
    Sweden: {
        name: "Švédsko",
        flag: "https://flagicons.lipis.dev/flags/4x3/se.svg"
    },
    Switzerland: {
        name: "Švýcarsko",
        flag: "https://flagicons.lipis.dev/flags/4x3/ch.svg"
    }
};
document.querySelector('.matchesA').innerHTML += "<h1>Skupina A</h1>";
fetch("./gamesA.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json(); // Parse the response as JSON
    })
    .then(testData => {
        let game = 1;
        for (let day = 0; day < testData.length; day++) {
            document.querySelector('.matchesA').innerHTML += getDayPattern(day + 1, testData[day][0], "A");
            for (let index = 1; index < testData[day].length; index++) {
                // console.log(day, index);
                // console.log(testData);
                document.getElementById((day + 1) + "-A").innerHTML += getGamePattern(game++, localisation[testData[day][index].player1].name, localisation[testData[day][index].player2].name, localisation[testData[day][index].player1].flag, localisation[testData[day][index].player2].flag, testData[day][index].result);
            }
        }
    })
    .catch(error => {
        // Handle errors
        console.error('Error fetching JSON:', error);
    });

document.getElementById('confirm').addEventListener('click', () => {
    let outputData = [];
    const tips = document.getElementsByClassName('tip');
    for (let index = 0; index < tips.length; index++) {

    }
})
fetch("./gamesB.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json(); // Parse the response as JSON
    })
    .then(testData => {
        document.querySelector('.matchesB').innerHTML += "<h1>Skupina B</h1>";
        let game = 1;
        for (let day = 0; day < testData.length; day++) {
            document.querySelector('.matchesB').innerHTML += getDayPattern(day + 1, testData[day][0], "B");
            for (let index = 1; index < testData[day].length; index++) {
                // console.log(day, index);
                // console.log(testData);
                document.getElementById((day + 1) + "-B").innerHTML += getGamePattern(game++, localisation[testData[day][index].player1].name, localisation[testData[day][index].player2].name, localisation[testData[day][index].player1].flag, localisation[testData[day][index].player2].flag, testData[day][index].result);
            }
        }
    })
    .catch(error => {
        // Handle errors
        console.error('Error fetching JSON:', error);
    });

document.getElementById('confirm').addEventListener('click', () => {
    // Fetch data from the server
    fetch('http://localhost:2024/tips')
        .then(response => response.json())
        .then(data => {
            // Get all the .tip <td> elements
            const myData = data.filter((tip) => tip[0] === document.querySelector('input').value);

            
            // Get the corresponding input element
            const inputElement = document.querySelectorAll('td.tip input');

            for (let index = 0; index < inputElement.length; index += 2) {
                inputElement[index].value = myData[0][index / 2 + 1]["hometeam"];
                inputElement[index + 1].value = myData[0][index / 2 + 1]["awayteam"];
            };
        })
        .catch(error => console.error('Error:', error));
})

try {
document.getElementById('send').addEventListener('click', () => {
    let outputData = [document.querySelector('input').value];
    const tips = document.querySelectorAll('.tip input');
    for (let index = 0; index < tips.length; index += 2) {
        outputData.push({ hometeam: tips[index].value, awayteam: tips[index + 1].value });
    }
    console.log(JSON.stringify(outputData));
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(outputData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
} catch (error) {
    document.getElementById('sendResults').addEventListener('click', () => {
        let outputData = [document.querySelector('input').value];
        const tips = document.querySelectorAll('.tip input');
        for (let index = 0; index < tips.length; index += 2) {
            outputData.push({ hometeam: tips[index].value, awayteam: tips[index + 1].value });
        }
        console.log(JSON.stringify(outputData));
        fetch('/sendResults', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(outputData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
};

while (true) {
if(!document.querySelector('input#name').style.display) {
    const results = document.querySelectorAll('.result');
    const tips = document.querySelectorAll('.tip input');
    console.log(results);
    for (let index = 0; index < tips.length; index++) {
        tips[index] = results[index].innerHTML.substring(0, " ");
        tips[index+1] = results[index].innerHTML.substring(" ",results[index].innerHTML.length-1);
    }
    if(results.length > 0) {
        break;
    }
}

}