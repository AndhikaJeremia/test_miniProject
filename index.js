const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const axios = require('axios')
const PORT = 2000

const app = express()
dotenv.config()

app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MONGO_DB)

const covidData_schema = new mongoose.Schema({
    Country_Region: {
        type: String,
    },
    Last_Update: {
        type: Number,
    },
    Confirmed: {
        type: Number,
    },
    Deaths: {
        type: Number,
    },
    Recovered: {
        type: Number,
    },
    Active: {
        type: Number,
    }
})

const data_covid = mongoose.model('covid19', covidData_schema)

app.post('/postDataCovid', (req, res) => {
    let data = []
    data_covid.find()
        .then((results) => {
            if(results.length > 0) data_covid.collection.drop()
            axios.get('https://api.kawalcorona.com/')
                .then((responses) => {
                    data = responses.data
                    data.map((item) => {
                        const newData = new data_covid({
                            Country_Region: item.attributes.Country_Region,
                            Last_Update: item.attributes.Last_Update,
                            Confirmed: item.attributes.Confirmed,
                            Deaths: item.attributes.Deaths,
                            Recovered: item.attributes.Recovered,
                            Active: item.attributes.Active
                        })
                        newData.save()
                    })
                    res.status(200).send('data sended')
                })
        })
})

app.get('/', (req, res) => {
    data_covid.find()
        .then(results => res.status(200).send(results))
})
app.get('/:Country_Region', (req, res) => {
    const country = req.params.Country_Region
    data_covid.find({Country_Region: country})
        .then(results => {
            if(results.length === 0) res.status(404).send('Country Region Not Found')
            else res.status(200).send(results)
        })
})
app.listen(PORT, () => console.log(PORT))