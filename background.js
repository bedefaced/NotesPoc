chrome.runtime.onInstalled.addListener(function(details) {
	
	chrome.storage.local.get("collections", function(data){
		if (typeof data.collections == "undefined") {
			chrome.storage.local.set( { "collections": JSON.stringify([]) } );
		}
	});

	chrome.storage.local.get("notes", function(data){
		if (typeof data.notes == "undefined") {
			chrome.storage.local.set( { "notes": JSON.stringify({}) } );
		}
	});
	
	chrome.contextMenus.create({
		"title": "Save in NotesPoc",
		"contexts": [ "selection" ],
		"id" : "NotesPocMenu"
	});
	
	chrome.contextMenus.onClicked.addListener(function(info, tab) {		
		if (info.menuItemId === "NotesPocMenu") {
			chrome.tabs.sendMessage(tab.id, { textSelected : "1" } , { frameId: info.frameId });
		}
	});
	
	chrome.browserAction.onClicked.addListener(function(activeTab) {
		chrome.tabs.create({ url: chrome.extension.getURL('popup.html') });
	});
	
});