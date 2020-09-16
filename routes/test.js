const express = require("express") 
const path = require("path") 
const multer = require("multer") 
const app = express() 
	
// View Engine Setup 
app.set("views",path.join(__dirname,"views")) 
app.set("view engine","ejs") 
	
	

	
// Define the maximum size for uploading 
// picture i.e. 1 MB. it is optional 
const maxSize = 1 * 10000 * 10000; 
	
var upload = multer({ 
	storage: storage, 
	limits: { fileSize: maxSize }, 
	fileFilter: function (req, file, cb){ 
	
		// Set the filetypes, it is optional 
		var filetypes = /jpeg|jpg|png/; 
		var mimetype = filetypes.test(file.mimetype); 

		var extname = filetypes.test(path.extname( 
					file.originalname).toLowerCase()); 
		
		if (mimetype && extname) { 
			return cb(null, true); 
		} 
	
		cb("Error: File upload only supports the "
				+ "following filetypes - " + filetypes); 
	} 

// mypic is the name of file attribute 
}).single("mypic");	 

app.get("/",function(req,res){ 
	res.render("Signup"); 
}) 
	
app.post("/uploadProfilePicture",function (req, res, next) { 
		
	// Error MiddleWare for multer file upload, so if any 
	// error occurs, the image would not be uploaded! 
	upload(req,res,function(err) { 

		if(err) { 

			// ERROR occured (here it can be occured due 
			// to uploading image of size greater than 
			// 1MB or uploading different file type) 
			res.send(err) 
		} 
		else { 

			// SUCCESS, image successfully uploaded 
			res.send("Success, Image uploaded!") 
		} 
	}) 
})