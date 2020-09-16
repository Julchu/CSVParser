"use strict";
let fs = require('fs');

let getJSONInfo = (fileName) => {
	return new Promise((resolve, reject) => {
		fs.readFileSync(fileName, "utf8", (error, data) => {
			resolve(JSON.parse(data))
			reject(error);
		});
	});
};

let getCanadaPost = postalCode => {
	let rates = new Promise((resolve, reject) => {
		request(
			"https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/rates/" +
				postalCode,
			(error, response, body) => {
				resolve(body);
				reject(error);
			}
		);
	});
	return rates;
};

module.exports = {getJSONInfo};