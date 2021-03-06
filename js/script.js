'use strict';

// TODO: Initialize Global Variable
var map;
var infoWindow;
var markers = [];
var hongkong = {
	lat: 22.3964,
	lng: 114.1095
};
var markerActive;
var activeCenter = hongkong;
var googleAPILoaded = false;

/**
* @description Initialize the Google Map
*/
function initMap() {
	googleAPILoaded = true;
	map = new google.maps.Map($('#map')[0], {
		center: activeCenter,
		zoom: 11
	});
	infoWindow = new google.maps.InfoWindow();

	infoWindow.addListener('closeclick', function() {
		if (markerActive) {
			markerActive.setAnimation(null);
			this.close();
			markerActive = null;
			return;
		}
	})

	// TODO: Initialize the markers according to the number of data
	for (let i = 0; i < data.length; i++) {
		let marker =  new google.maps.Marker({
			position: data[i].position,
			map: map,
			title: data[i].name,
			properties: {
				id: data[i].id,
				queryString: data[i].queryString
			},
			animation: google.maps.Animation.DROP
		});

		// TODO: Initialize the click event
		marker.addListener('click', function($event) {
			// TODO: Check the current active
			if (markerActive) {
				markerActive.setAnimation(null);
				infoWindow.close();
				if (markerActive === this) {
					markerActive = null;
					return;
				}
			}
			markerActive = this;
			this.setAnimation(google.maps.Animation.BOUNCE);
			infoWindow.close();
			// TODO: Call Wikipedia API
			$.ajax({
				type: 'GET',
				url: 'https://en.wikipedia.org/w/api.php?' + 
					'format=json&action=query&prop=extracts&exintro=false&explaintext=&titles=' + 
					encodeURIComponent(this.properties['queryString']),
				dataType: 'jsonp'
			}).done(res => {
				// TODO: Handle the error of no result
				if (res.batchcomplete !== '' || !!res.query.pages["-1"]) {
					infoWindow.setContent(
						'<div><b>' + this.title + '</b></div>' + 
						'<div>Cannot get the information of ' + this.title + '</div>'
					);
					infoWindow.open(map, marker);
					return;
				}
				// TODO: Extract the data from response
				let pages = res.query.pages;
				for (let item in pages) {
					if (pages.hasOwnProperty(item)) {
						// TODO: Set the content up to infoWindow and break out the loop
						infoWindow.setContent(
							'<div><b>' + this.title + '</b></div>' + 
							(pages[item].extract || 'No information')
						);
						break;
					}
				}
				infoWindow.open(map, marker);
				return;
			}).fail((xhr, status, errorThrown) => {
				infoWindow.setContent(
					'<div><b>' + this.title + '</b></div>' + 
					'<div>Cannot get the information of ' + this.title + '</div>'
				);
				infoWindow.open(map, marker);
				return;	
			});
		});

		markers.push(marker);
	}
}

/**
* @description Hide/Show the markers according to the filtering
* @params {string[]} activeList - The id array for current active
*/
function markerRefresh(activeList) {
	for (let i = 0; i < markers.length; i++) {
		markers[i].setVisible(
			activeList.indexOf(markers[i].properties['id']) != -1
		);
	}
}

/**
* @description Handle the error message
*/
function errorLoading() {
	$("#map")[0].innerHTML = '<div class=\"error-log\">Error In Loading Google Map API</div>';
}