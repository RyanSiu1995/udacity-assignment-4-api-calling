'use strict';

var DataViewModel = function() {
	var self = this;

	this.location = ko.observableArray(data);
	this.keyWord = ko.observable("");

	this.activeLocation = ko.computed(function() {
		let key = self.keyWord();
		let origin = self.location();
		let returnArr = [];
		let idList = [];
		if (key) {
			for (let i = 0; i < origin.length; i++) {
				if (origin[i].name.toLowerCase().indexOf(key.toLowerCase()) != -1) {
					returnArr.push(origin[i]);
					idList.push(origin[i].id)
				}
			}
			markerRefresh(idList);
			return returnArr;
		} else {
			for (let i = 0; i < origin.length; i++) {
				idList.push(origin[i].id)
			}
			markerRefresh(idList);
			return origin;
		}
	});
}

ko.applyBindings(new DataViewModel());