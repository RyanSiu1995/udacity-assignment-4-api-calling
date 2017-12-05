'use strict';

/**
* @description Represents data showing
* @constructor
* @param {object[]} data - The array of the data
*/
var DataViewModel = function(data) {
	// TODO: Get the scope
	var self = this;
	// TODO: Initialize the models
	this.location = ko.observableArray(data);
	this.keyWord = ko.observable("");
	this.activeLocation = ko.computed(function() {
		let key = self.keyWord();
		let origin = self.location();
		let returnArr = [];
		let idList = [];
		if (key) {
			// TODO: if there is a query string, iterate the array
			for (let i = 0; i < origin.length; i++) {
				if (origin[i].name.toLowerCase().indexOf(key.toLowerCase()) != -1) {
					returnArr.push(origin[i]);
					idList.push(origin[i].id)
				}
			}
			
		} else {
			// TODO: iterate the origin data to get id array
			for (let i = 0; i < origin.length; i++) {
				idList.push(origin[i].id)
			}
			returnArr = origin;
		}
		// TODO: Force refresh the markers on map
		markerRefresh(idList);
		return returnArr
	});
	this.markerClicker = function(datum) {
		// TODO: Try to trigger the click event
		for (let i = 0; i < markers.length; i++) {
			if (markers[i].properties['id'] === datum['id']) {
				google.maps.event.trigger(markers[i], 'click');
				return;
			}
		}
	};
	// TODO: Filter List Models
	this.filterList = ko.observable(false);
	this.toggleFilter = function() {
		this.filterList(!this.filterList())
	};
}

// TODO: bind the viewmodel
ko.applyBindings(new DataViewModel(data));