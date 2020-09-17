"use strict";

$(document).ready(async () => {	
	// ************************ Drag and drop ***************** //
	let dropArea = document.getElementById("dropArea");

	let fileUpload = document.createElement("input");
	fileUpload.setAttribute("id", "fileUpload");
	fileUpload.setAttribute("type", "file");
	fileUpload.setAttribute("name", "Upload Document");
	fileUpload.setAttribute("onchange", "form.submit()");
	fileUpload.setAttribute("value", "document");
	fileUpload.setAttribute("accept", ".csv");

	let uploadForm = document.createElement("form");
	uploadForm.setAttribute("id", "uploadForm");
	uploadForm.setAttribute("method", "POST");
	uploadForm.setAttribute("action", "/");
	uploadForm.setAttribute("enctype", "multipart/form-data");

	uploadForm.append(fileUpload);
	document.body.appendChild(uploadForm);

	// Prevent default drag behaviors
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
		document.body.addEventListener(eventName, preventDefaults, false);
		document.body.addEventListener(eventName, preventDefaults, false);
	});

	// Highlight drop area when item is dragged over it
	['dragenter', 'dragover'].forEach(eventName => {
		document.body.addEventListener(eventName, highlight, false);
	});

	['dragleave', 'drop'].forEach(eventName => {
		document.body.addEventListener(eventName, unhighlight, false);
	});

	// Handle dropped files
	document.body.addEventListener('drop', handleDrop, false);
	document.body.addEventListener("click", handleClick);

	function handleClick(e) {
		fileUpload.click();
	}

	function preventDefaults (e) {
		e.preventDefault();
		e.stopPropagation();
	};

	function highlight(e) {
		dropArea.classList.add('highlight');
	};

	function unhighlight(e) {
		dropArea.classList.remove('highlight');
	};

	function handleDrop(e) {
		var dt = e.dataTransfer;
		var files = dt.files;

		fileUpload.files = files;
		
		// Checks files for Excel files
		if (fileUpload.files[0].type === "application/vnd.ms-excel") {
			fileUpload.form.submit();	
		}
	};
});