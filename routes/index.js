let express = require('express');
let router = express.Router();
let csv = require('csv-parser');
let fs = require('fs');
let { promisify } = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
	let data = fs.readFileSync('productInfo.json');
	
	let productInfo = JSON.parse(data);
	
	// console.log(productInfo);
	// res.render("index", {title: "test"});
	if (productInfo) {
		res.render('index', { title: 'Express', productInfo: productInfo});
	} else {
		res.render("index", { title: "Express"});
	}
	
});

router.post("/", async (req, res, next) => {

	// Sets path of uploaded files
	let path = __dirname + "/../public/uploads/";

	fs.readdir(path, async function(err, fileNames) {
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
						
						for await (eachProduct of productData) {
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
						fs.writeFile('productInfo.json', JSON.stringify(productInfo), 'utf8', (err) => {
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

	res.redirect('/');
});

module.exports = router;