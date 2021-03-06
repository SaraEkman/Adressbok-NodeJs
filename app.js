let express = require('express');
const app = express();
let fs = require('fs');
const port = process.env.PORT || 4000;
let nanoId = require('nanoid');
let cors = require('cors');
let host = '0.0.0.0';

app.use(express.json());
app.use(express.static('./public'));
app.use(
    cors({
        "origin": "*",
        "methods": ["GET", "POST"]
    })
);

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000/adress");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// });

app.get('/adress', (req, res) => {
    let addresses = getJson('./addresses.json');
    res.json(addresses);
});

app.post('/adress', (req, res) => {
    let addresses = getJson('./addresses.json');

    let foundA = addresses.find((adress) => {
        return adress.AdressName == req.body.AdressName && adress.epost == req.body.epost && adress.number === req.body.number;
    });

    if (foundA) {
        let foundIndex = addresses.findIndex((adress) => adress.id == foundA.id);
        addresses.splice(foundIndex, 1);
        addresses = [...addresses, {
            ...foundA, foundAdress: true
        }];
        fs.writeFileSync('./addresses.json', JSON.stringify(addresses));
        return res.json("You have already adress");
    } else {
        addresses = [...addresses, {
            ...req.body, id: nanoId.nanoid(6), foundAdress: false
        }];
        fs.writeFileSync('./addresses.json', JSON.stringify(addresses));
        return res.json('Now you create adress');
    }
});

app.post('/remove', (req, res) => {
    console.log(req.body);

    let addresses = getJson('./addresses.json');

    let foundAdress = addresses.find((adress) => adress.id == req.body.id);
    console.log(foundAdress);
    let foundIndex = addresses.findIndex((adress) => adress.id == foundAdress.id);

    console.log(foundIndex);
    addresses.splice(foundIndex, 1)

    fs.writeFileSync('./addresses.json', JSON.stringify(addresses));
    return res.json('deleted succeed');
});

function getJson(url) {
    let dataContent = [];
    if (fs.existsSync(url)) {
        dataContent = JSON.parse(fs.readFileSync(url));
    }
    return dataContent;
}

app.listen(port, host, () => {
    console.log('server is now running on port ' + port);
});