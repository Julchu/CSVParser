"use strict";

let express = require('express');
let router = express.Router();
let csv = require('csv-parser');
let fs = require('fs');
let { getJSONInfo, getCSVInfo } = require("../services/fileServices");

/* GET home page. */
router.get('/', async (req, res, next) => {
	let jsonDirectory = "productInfo.json";
	let productInfo = {};
	try {
		productInfo = await getJSONInfo(jsonDirectory);
	} catch (err) {
		console.log(err);
	}
	
	if (productInfo) {
		res.render('index', { title: 'Food Parser', productInfo: productInfo});
	} else {
		res.render("index", { title: "Food Parser"});
	}
});

router.post("/", async (req, res, next) => {
	// Sets path of uploaded files
	let path = __dirname + "/../public/uploads/";
	let jsonDirectory = "productInfo.json";

	await getCSVInfo(path, jsonDirectory);

	// fs.readdir(path, async function(err, fileNames) {
	// 	if (err) {
	// 		console.log("Error checking if directory is empty")
	// 	} else {
	// 		if (!fileNames.length) {
	// 			console.log("Directory is empty");
	// 		} else {
	// 			let productInfo = {};

	// 			// Reads files in directory	
	// 			fileNames.forEach(fileName => {
	// 				// Reads CSV file
	// 				fs.createReadStream(path + fileName).pipe(csv())
	// 				// Accessing data
	// 				.on('data', async (row) => {
	// 					// Processing "Products" data
	// 					let productData = row["Products"].split("\n");
						
	// 					for await (let eachProduct of productData) {
	// 						if (eachProduct) {
	// 							eachProduct = eachProduct.split(" x ");
								
	// 							if (productInfo[eachProduct[1]]) {
	// 								productInfo[eachProduct[1]] += parseInt(eachProduct[0]);
	// 							} else {
	// 								productInfo[eachProduct[1]] = parseInt(eachProduct[0]);
	// 							}		
	// 						}
												
	// 					}

	// 					// Writes to JSON file
	// 					fs.writeFileSync('productInfo.json', JSON.stringify(productInfo), 'utf8', (err) => {
	// 						if (err) {
	// 							console.log(err);
	// 						}
	// 					});
	// 				})

	// 				// After processing data
	// 				.on('end', () => {
	// 					console.log('CSV file successfully processed');
	// 				});
					
	// 				// Deletes file
	// 				try {
	// 					fs.unlinkSync(path + fileName)
	// 				} catch (err) {
	// 					// Error deleting file
	// 					console.error(err);
	// 				}
	// 			});
	// 		}
	// 	}
	// });
	res.redirect('/');
});

module.exports = router;