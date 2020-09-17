"use strict";

let fs = require('fs');
let csv = require('csv-parser');

let getJSONInfo = async (fileName) => {
	let data = fs.readFileSync(fileName, "utf8");

	return JSON.parse(data);;
};

let parseCSVInfo = async (path, fileName, productInfo, jsonDirectory) => {
	// Reads CSV file
	try {
		fs.createReadStream(path + fileName).pipe(csv())

		// Accessing data
		.on('data', async (row) => {
			// Processing "Products" data
			let productData = row["Products"].split("\n");
			
			for await (let eachProduct of productData) {
				if (eachProduct) {
					eachProduct = eachProduct.split(" x ");
					
					if (productInfo[eachProduct[1]]) {
						productInfo[eachProduct[1]] += parseInt(eachProduct[0]);
					} else {
						productInfo[eachProduct[1]] = parseInt(eachProduct[0]);
					}		
				}				
			}

			// Writes to JSON file
			fs.writeFileSync(jsonDirectory, JSON.stringify(productInfo), 'utf8');
		})

		// After processing data
		.on('end', () => {
			console.log('CSV file successfully processed');
		});
	} catch (err) {
		console.error(err);
		console.log("Error reading file in parseCSVInfo");
	}
}

let getCSVInfo = async (path, jsonDirectory) => {
	let fileNames = fs.readdirSync(path);

	if (fileNames.length) {
		let productInfo = {};
		
		// Reads files in directory	
		fileNames.forEach(fileName => {
			parseCSVInfo(path, fileName, productInfo, jsonDirectory);

			// Deletes file
			try {
				fs.unlinkSync(path + fileName);
			} catch (err) {
				console.error(err);
				console.log("Failed to delete file in getCSVInfo");
			}
		});
	}
}

module.exports = { getJSONInfo, getCSVInfo };