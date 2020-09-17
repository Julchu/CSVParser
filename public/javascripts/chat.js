const socket = io();

$(document).ready(async () => {	
	// Sending username to server on connect
	socket.emit("join", $("#username").text());

	/* User list functions*/
	// Adding users to Users Online table
	socket.on("join", (username) => {
		$("#userTable").append("<tr id='" + username + "'><td>" + username + "</td></tr>");
	})

	// Removing specific user from table when they disconnect
	socket.on("updateUserList", (user) => {
		$("#" + user).remove();
	});

	/* Chatbox functions */
	// Gets initial messages from server
	socket.on("loadChatroom", (msg) => {
		let username = msg.username;
		let message = msg.message;
		let time = msg.time;
		$("#messageTable").append("<tr><td>" + username + "</td><td>" + message + "</td></tr>");	
	});	

	// Sending input box' message on send button press
	$("#sendButton").on("click", async () => {
		let username = $("#username").text();
		let message = $('#messageBox').val();
		if (username && message) {
			if (message.charAt(0) === "/") {
				$('#messageBox').val("");
			} else {
				$("#messageTable").append("<tr><td>" + username + "</td><td>" + message + "</td></tr>")
				await socket.emit("chat", message, username, Date.now());			
				$('#messageBox').val("");
			}
		}
	});

	// Sending input box' message on enter key
	$("#messageBox").on("keypress", async (e) => {
		if (e.key === "Enter") {
			let username = $("#username").text();
			let message = $('#messageBox').val();
			if (username && message) {
				if (message.charAt(0) === "/") {
					await socket.emit("command", message);
					$('#messageBox').val("");
				} else {
					$("#messageTable").append("<tr><td>" + username + "</td><td>" + message + "</td></tr>")
					await socket.emit("chat", message, username, Date.now());			
					$('#messageBox').val("");
				}
			}
		}
	});

	// Expecting command response and adding to table
	socket.on("command", (message) => {
		let username = $("#username").text()
		$("#messageTable").append("<tr><td>" + username + "</td><td>" + message + "</td></tr>")
	});
});