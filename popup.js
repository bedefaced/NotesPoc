$(function() {
	
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
				$("#btnLoad").attr("disabled", false);
				$("#btnDelete").attr("disabled", false);
			} else {
				$("#colList").attr("disabled", true);
				$("#btnLoad").attr("disabled", true);
				$("#btnDelete").attr("disabled", true);
			}
		}
	});
	
	$("#btnLoad").click(function() {
		var val = $("#colList").val();
		if (val) {
			chrome.storage.local.get("notes", function(data) {
				var data = JSON.parse(data.notes);
				if (typeof data[val] == "undefined") {
					data[val] = [];
				}
				
				var divList = $("#divList");
				
				divList.empty();
				divList.append($("<h1>" + val + "</h1>"))
				data[val].forEach(function(item) {
					var oneLine = $("<p></p>");
					oneLine.append($("<h2>" + item.title + "</h2>"));
					oneLine.append($("<p>" + item.text + "</p>"));
					oneLine.append($("<p><i> From " + item.url + " (" + item.date + ")</i></p>"));
					oneLine.append($("<button/>", {
						text: "Remove",
						click: function () { 
							$(this).parent().remove();
							data[val].splice(data[val].indexOf(item), 1);
							chrome.storage.local.set( { "notes": JSON.stringify(data) }, function() {
								$.msg("Text removed!");
							});
						}
					}));
					
					oneLine.append($('<button/>', {
						text: "Open page",
						click: function () { 
							var win = window.open(item.url, '_blank');
							win.focus();
						}
					}));
					
					divList.append(oneLine);
				});
				$.msg("Texts loaded!");
			});
		}
	});
	
	$("#btnDelete").click(function() {
		var name = $("#colList").val();
		
		chrome.storage.local.get("collections", function(data){
			if (data.collections) {
				var collections = JSON.parse(data.collections);
				if (collections.indexOf(name) > -1) {
					collections.splice(collections.indexOf(name), 1);
					chrome.storage.local.set( { "collections": JSON.stringify(collections) } )
					
					chrome.storage.local.get("notes", function(data) {
						var data = JSON.parse(data.notes);
						data[name] = [];
						chrome.storage.local.set( { "notes": JSON.stringify(data) }, function() {
							$("#colList option[value='" + name + "']").remove();
							$.msg("Collection was deleted!");
							$("#divList").empty();
						})
					});
				} else {
					$.msg("Collection does not exist!");
				}
			}
		});
	});
	
});