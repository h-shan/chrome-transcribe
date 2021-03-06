const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()
const formidable = require('express-formidable')
const FormData = require('form-data')
const fs = require('fs')
const concat = require('concat-stream')
const app = express()

app.use(bodyParser.json());
app.use(formidable());

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/sendAsMediaLink', function(req, res) {
	revPOSTWithJSON(req.body).then((response) => res.send(response))
})

app.post('/sendAsBlob', function(req, res) {
	console.log(req.files);
	revPOSTWithForm(req.files.data).then(response => res.send(response))
})

app.get('/getTranscript/:transcriptId', function(req, res) {
	revGET(req.params.transcriptId).then((response) => res.send(response))
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

function revPOSTWithForm(data){
	console.log('DATA', data);
	var config = {
		headers: {
			'Authorization' : 'Bearer 0146doeT5wCQ-_Bk_LirlfoVya1pIBDWVCMbqjV77TMFWixEt4kOWQkAojkHER2q3wM6Cvvk-MnWhffLjgZG-zupFIIKs',
			'Content-Type' : 'multipart/form-data'
		}
	};


	data._writeStream.pipe(fileBuffer => {
		const form = new FormData();
		form.append('media', fileBuffer);
		console.log(form.getHeaders())

		const headers = form.getHeaders()
		headers.Authorization = 'Bearer 0146doeT5wCQ-_Bk_LirlfoVya1pIBDWVCMbqjV77TMFWixEt4kOWQkAojkHER2q3wM6Cvvk-MnWhffLjgZG-zupFIIKs'

		return axios.post('https://api.rev.ai/revspeech/v1beta/jobs', form, {headers})
			.then(response => {
				console.log("RESPONSE", response)
				return response.data
			}).catch(error => {
				console.log(error)
				console.log('ERROR', error.response.data.parameters)
				return error.data.parameters
			});
	});
}

function revPOSTWithJSON(data) {
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