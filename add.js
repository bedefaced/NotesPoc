$(function() {
	
	var NotesPocData = JSON.parse(Base64.decode(getParameterByName("data")));
	var ID = getParameterByName("id");
	
	/*
		collections = [ "name1", "name2" ]
		notes = [(collectionName) : [ {}, {}, {}] ]
	*/
	
	chrome.storage.local.get("collections", function(data){
		if (data.collections) {
			var collections = JSON.parse(data.collections);
			if (collections.length > 0) {
				collections.forEach(function(item) {
					$("#colList").append($("<option>", {
						value: item,
						text: item
					}));
				});
				$("#colList").attr("disabled", false);
				$("#btnSave").attr("disabled", false);
			} else {
				$("#colList").attr("disabled", true);
				$("#btnSave").attr("disabled", true);
			}
		}
	});
	
	$("#btnSave").click(function() {
		var val = $("#colList").val();
		if (val) {
			chrome.storage.local.get("notes", function(data) {
				var data = JSON.parse(data.notes);
				if (typeof data[val] == "undefined") {
					data[val] = [];
				}
				data[val].push(NotesPocData);
				chrome.storage.local.set( { "notes": JSON.stringify(data) }, function() {
					$.msg("Text was saved!");
					closeThis();
				})
			});
		}
	});
	
	$("#btnCreate").click(function() {
		var name = $("#txtNewCollection").val();
		
		chrome.storage.local.get("collections", function(data){
			if (data.collections) {
				var collections = JSON.parse(data.collections);
				if (collections.indexOf(name) == -1) {
					collections.push(name);
					chrome.storage.local.set( { "collections": JSON.stringify(collections) } )
					
					chrome.storage.local.get("notes", function(data) {
						var data = JSON.parse(data.notes);
						data[name] = [];
						data[name].push(NotesPocData);
						chrome.storage.local.set( { "notes": JSON.stringify(data) }, function() {
							
							$("#colList").append($("<option>", {
								value: name,
								text: name
							}));
							
							$.msg("Collection was created and text was saved!");
							closeThis();
						})
					});
				} else {
					$.msg("Collection with same name exists!");
					closeThis();
				}
			}
		});
	});
	
	function closeThis() {
		setTimeout(function() {
			parent.postMessage("close" + ID, NotesPocData.url);
		}, 3000);
	}
	
});
