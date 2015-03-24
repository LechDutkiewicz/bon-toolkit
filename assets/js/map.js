var mapWidgets;
(function($) {
	mapWidgets = {
		init: function(container, settings) {
			var defaults = {
				startZoom: 16,
				lat: 43.580577,
				lng: 1.52122,
				markerImage: '',
				markersList: ''
			};
			var options = $.extend(defaults, settings);
			var target = container;
			mapWidgets.build(target, options)
		},
		build: function(target, options) {
			var id = target.attr('id');
			var map_container = '<div id="map-container-' + id + '" class="map-container"></div>';
			target.append(map_container);

			if (markersList === '') {
				var coords = new google.maps.LatLng(options.lat, options.lng);
				var settings = {
					zoom: options.startZoom,
					center: coords,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true,
					streetViewControl: true,
					streetViewControlOptions: {
						position: google.maps.ControlPosition.BOTTOM_LEFT
					},
				};
				var map = new google.maps.Map(document.getElementById("map-container-" + id), settings);
				var panorama = map.getStreetView();
				map.setTilt(45);
				var markerImage = options.markerImage;

				var marker = new google.maps.Marker({
					position: coords,
					map: map,
					icon: markerImage
				});

			} else {

				var markersList = options.markersList;

				var infowindow;

				var coords = new google.maps.LatLng(options.lat, options.lng);
				var settings = {
					zoom: options.startZoom,
					center: coords,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true,
					streetViewControl: true,
					streetViewControlOptions: {
						position: google.maps.ControlPosition.BOTTOM_LEFT
					},
				};
				var map = new google.maps.Map(document.getElementById("map-container-" + id), settings);

				google.maps.event.addListener(map, 'click', function(event){

					if (infowindow) {
						infowindow.close();
					};

				});

				var panorama = map.getStreetView();
				map.setTilt(45);
				var markerImage = options.markerImage;

				$.each(markersList, function(i, coordinates){
					var coords = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);

					var marker = new google.maps.Marker({
						position: coords,
						map: map,
						icon: markerImage
					});

					google.maps.event.addListener(marker, 'click', function(){

						if (infowindow) {
							infowindow.close();
						};

						if (coordinates.infoWindows) {
							infowindow = new google.maps.InfoWindow({
								content: coordinates.infoWindows
							});

							infowindow.open(map,marker);

						};
					});

				});

			}

			var zoomMore = '<div class="mapbutton mapzoom more">+</div>';
			var zoomLess = '<div class="mapbutton mapzoom less">-</div>';
			var typePlain = '';
			var typeSat = '';
			var typeHyb = '';
			var typeBox = '<div class="maptypebox"><div class="mapbutton maptype plain selected">Plain</div><div class="mapbutton maptype sat">Satellite</div><div class="mapbutton maptype hyb">Hybrid</div></div>';
			target.append(zoomMore).append(zoomLess).append(typeBox);
			google.maps.event.addListener(panorama, 'visible_changed', function() {
				if (panorama.getVisible()) {
					target.find('.mapbutton').hide();
					target.find('.maptypebox').hide()
				} else {
					target.find('.mapbutton').show();
					target.find('.maptypebox').show()
				}
			});
			$(window).resize(function() {
				map.setCenter(coords)
			});
			$('.less').click(function() {
				options.startZoom--;
				if (options.startZoom <= 0) options.startZoom = 0;
				map.setZoom(options.startZoom);
				$(this).blur()
			});
			$('.more').click(function() {
				options.startZoom++;
				if (options.startZoom >= 21) options.startZoom = 21;
				map.setZoom(options.startZoom);
				$(this).blur()
			});
			$('.maptype.plain').click(function() {
				map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
				$('.maptype').removeClass('selected');
				$(this).addClass('selected')
			});
			$('.maptype.hyb').click(function() {
				map.setMapTypeId(google.maps.MapTypeId.HYBRID);
				$('.maptype').removeClass('selected');
				$(this).addClass('selected')
			});
			$('.maptype.sat').click(function() {
				map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
				$('.maptype').removeClass('selected');
				$(this).addClass('selected')
			});
			$('.more, .less').hover(function(e) {
				$(this).addClass('hovered')
			}, function(e) {
				$(this).removeClass('hovered')
			})
		}
	}
})(jQuery);