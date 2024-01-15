const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express()
const port = 3000

var upload = multer();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(upload.array());

let mData;
let coinName = "bitcoin";
let mChart = "";

async function resData(coinName) {
    var marketData = await axios.get('https://api.coingecko.com/api/v3/coins/' + coinName)
        .then(function (response) {
            console.log(response.data);
            mData = response.data;
            return mData;
        })
        .catch(function (error) {
            console.log(error);
        });

    console.log("marketData", marketData)
    if (marketData) {
        var marketChart = await axios.get('https://api.coingecko.com/api/v3/coins/' + coinName + '/market_chart?vs_currency=usd&days=30')
            .then(function (response) {
                console.log("mchart", response.data);
                mChart = response.data;
                return mChart;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

app.get('/', async (req, res) => {
    await resData(coinName)
    res.render('index', { mData, mChart })
})

app.post('/', async (req, res) => {
    coinName = req.body.selectCoin;
    await resData(coinName)
    res.render('index', { mData, mChart })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})