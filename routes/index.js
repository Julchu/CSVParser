"use strict";

let express = require('express');
let router = express.Router();

let { getJSONInfo, getCSVInfo } = require("../services/fileServices");

/* GET home page. */
router.get('/', async (req, res, next) => {
	let jsonDirectory = "productInfo.json";
	let productInfo = {};
	try {
		productInfo = await getJSONInfo(jsonDirectory);
	} catch (err) {
		console.error(err);
		console.log("Error when GET / in getJSONInfo");
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

	try {
		await getCSVInfo(path, jsonDirectory);
	} catch (err) {
		console.error(err);
		console.log("Error when POST / in getCSVInfo");
	}

	res.redirect('/');
});

module.exports = router;