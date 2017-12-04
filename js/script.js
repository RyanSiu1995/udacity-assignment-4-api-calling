'use strict';

var map;
var infoWindow;
var markers = [];
var hongkong = {
	lat: 22.3964,
	lng: 114.1095
};
var activeCenter = hongkong;
var googleAPILoaded = false;

// TODO: SetTimeout for loading Google Map API
setTimeout(function() {
	if (!googleAPILoaded) {
		console.log('running');
		$('#map')[0].innerHTML = "<div class=\"error-log\">Cannot Load the Google Source</div>";
	}
}, 4000);

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

	// TODO: Add Listener to set viewport
	google.maps.event.addListener(map, 'bounds_changed', function() {
		map.setCenter(activeCenter);
	});

	google.maps.event.addListener(map, 'zoom_changed', function() {
		map.setCenter(activeCenter);
	});

	for (let i = 0; i < data.length; i++) {
		let marker =  new google.maps.Marker({
			position: data[i].position,
			map: map,
			title: data[i].name,
			properties: {
				id: data[i].id,
				queryString: data[i].queryString
			}
		});

		marker.addListener('click', function($event) {
			infoWindow.close();
			$.ajax({
				type: 'GET',
				url: 'https://en.wikipedia.org/w/api.php?' + 
					'format=json&action=query&prop=extracts&exintro=false&explaintext=&titles=' + 
					encodeURIComponent(this.properties['queryString']),
				dataType: 'jsonp',
				success: res => {
					let pages = res.query.pages;
					console.log(res);
					for(let item in pages) {
						if (pages.hasOwnProperty(item)) {
							console.log(pages[item])
							infoWindow.setContent(
								'<div><b>' + this.title + '</b></div>' + pages[item].extract
							)
							break;
						}
					}
					infoWindow.open(map, marker);
				}
			})
		});
		markers.push(marker);
	}
}

function markerRefresh(activeList) {
	for (let i = 0; i < markers.length; i++) {
		markers[i].setVisible(
			activeList.indexOf(markers[i].properties['id']) != -1
		);
	}
}

/**
* @description Toggle the Filter Bar
*/
function toggleFilter() {
	$('.filter-container').attr('data-show',
		!($('.filter-container').attr('data-show') === 'true')
	);
}

