const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/postAudioFile', function(req, res) {
	revPOST(req.body).then((response) => res.send(response))
})

app.get('/getTranscript/:transcriptId', function(req, res) {
	revGET(req.params.transcriptId).then((response) => res.send(response))
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

function revPOST(data) {
	var config  = {
		headers: {
			'Authorization' : 'Bearer 0146doeT5wCQ-_Bk_LirlfoVya1pIBDWVCMbqjV77TMFWixEt4kOWQkAojkHER2q3wM6Cvvk-MnWhffLjgZG-zupFIIKs',
			'Content-Type' : 'application/json'
		}
	};

	return axios.post('https://api.rev.ai/revspeech/v1beta/jobs', data, config)
		.then(response => {
			return response.data
		}).catch(error => {
			return error.data
		})
}

function revGET(transcriptId) {
	var config  = {
		headers: {
			'Authorization' : 'Bearer 0146doeT5wCQ-_Bk_LirlfoVya1pIBDWVCMbqjV77TMFWixEt4kOWQkAojkHER2q3wM6Cvvk-MnWhffLjgZG-zupFIIKs',
			'Accept' : 'text/plain'
		}
	};
	return axios.get(`https://api.rev.ai/revspeech/v1beta/jobs/${transcriptId}/transcript`, config)
		.then(response => {
			return response.data;
		})
		.catch(error => {
			console.log(error)
			return error.response.data.title;
		})
}