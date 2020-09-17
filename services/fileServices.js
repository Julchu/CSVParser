"use strict";

let fs = require('fs');
let csv = require('csv-parser');

let getJSONInfo = (fileName) => {
	let data = fs.readFileSync(fileName, "utf8", (error, data) => {
		JSON.parse(data);
	});
	
	let productInfo = JSON.parse(data);

	return productInfo;
};


let getCSVInfo = (path) => {
	// Sets path of uploaded files

	fs.readdirSync(path, async function(err, fileNames) {
		if (err) {
			console.log("Error checking if directory is empty")
		} else {
			if (!fileNames.length) {
				console.log("Directory is empty");
			} else {
				let productInfo = {};

				// Reads files in directory	
				fileNames.forEach(fileName => {
					// Reads CSV file
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
						fs.writeFileSync('productInfo.json', JSON.stringify(productInfo), 'utf8', (err) => {
							if (err) {
								console.log(err);
							}
						});
					})

					// After processing data
					.on('end', () => {
						console.log('CSV file successfully processed');
					});
					
					// Deletes file
					try {
						fs.unlinkSync(path + fileName)
					} catch (err) {
						// Error deleting file
						console.error(err);
					}
				});
			}
		}
	});
}

module.exports = { getJSONInfo, getCSVInfo };