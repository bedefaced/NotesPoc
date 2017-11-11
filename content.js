chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	var ID = Date.now();
	
	if (request.textSelected) {
		console.log("textSelected");
		var sel = window.getSelection();

		if (sel) {
				
			var text = sel.toString();
			
			var title = document.title;
			
			var date = new Date()
			var timeString = ("0" + date.getDate()).slice(-2) + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" +
				date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
			
			var url = window.location.href;
			
			var NotesPocData = {
				"title": title,
				"date": timeString,
				"url": url,
				"text": text
			};
			
			removeFrame();
			
			var iframe = document.createElement("iframe");
			iframe.id = "NotesPocFrame";
			iframe.style.background = "#aaaaaa";
			iframe.style.height = "100%";
			iframe.style.width = "400px";
			iframe.style.position = "fixed";
			iframe.style.top = "0px";
			iframe.style.right = "0px";
			iframe.style.zIndex = "9000000000000000000";
			iframe.frameBorder = "none"; 
			iframe.src = chrome.extension.getURL("add.html") + "?id=" + ID + 
				"&data=" + Base64.encode(JSON.stringify(NotesPocData));

			document.body.appendChild(iframe);
			
			window.addEventListener("message", onMessage);
		}
	}
	
	function onMessage(event) {
		if (event.data == "close" + ID) {
			window.removeEventListener("message", onMessage);
			removeFrame();
		}
	}
	
});

function removeFrame() {
	var iframe = document.getElementById("NotesPocFrame");
	if (iframe) {
		document.body.removeChild(iframe);
	}
}
