// Setting Height For Content Element
$(document).ready(function() {

  console.log(document.location.origin);
  console.log(document.location.hostname);
  console.log(document.location.host);

  var heightWin = $(window).height();
    $('.Panelleft').css('height', heightWin);
    $('.SubPanel').css('height', heightWin);
  var element = document.getElementById('ContainerHeight');
  if (element.offsetHeight > heightWin) {
    $('.Panelleft').css('height', element.offsetHeight);
    $('.SubPanel').css('height', element.offsetHeight);
  };
  var main_container = document.getElementById('main_container');
   if (main_container.offsetHeight > element.offsetHeight) {
    $('.Panelleft').css('height', main_container.offsetHeight);
    $('.SubPanel').css('height', main_container.offsetHeight);
  };
});


//Make Variable For Call a Data Needed

var map;
var GetJsonExternal = "js/map.json";
var infowindow = new google.maps.InfoWindow();
var styleArray = [
  {
    featureType: "all",
    stylers: [
      { saturation: -80 },
      { hue: "#1f222d" },
      { lightness: -20 },
      { gamma: 1.51 }
    ]
  },{
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      { hue: "#1f222d" },
      { saturation: 50 }
    ]
  },{
    featureType: "poi.business",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

//Load Init Function for google map api
google.maps.event.addDomListener(window, 'load', InitMap);

function InitMap() {
    var DataMarker= {
        center: new google.maps.LatLng(1.289332, 103.858152), 
        // The Default Zoom Value of the map is ​ 15​ 
        zoom: 15, 
        styles: styleArray,
        mapTypeControl: false,
        panControl: false,
        scaleControl: true,
        zoomControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
        
    map = new google.maps.Map(document.getElementById("map"), DataMarker);

    // Create Zooming
    var zoomControlDiv = document.createElement('div');
    var zoomControl = new ZoomControl(zoomControlDiv, map);
    zoomControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(zoomControlDiv);

    // get Json External from Js Folder 
       $.getJSON(GetJsonExternal, function(json1) {
       $.each(json1.singapure, function (key, data) {
          var icon = "img/IconMap/"+ data.Icon+".png";
          var latLng = new google.maps.LatLng(data.Latitude, data.Longitude);
          var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              icon: icon,
              title: data.PlaceName
          });

          var details = data.website + ", " + data.phone + ".";
          // Call Function Control for Action when click, Mousein, and MouseOut, on google map api
          CreateControlAction(marker, map, infowindow, data);
             });
      });


    var markers = {};
    var getMarkerUniqueId= function(lat, lng) {
        return lat + '_' + lng;
    }
    var getLatLng = function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
    };

  // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function(e) {
     
    if (Object.keys(markers).length < 2) {

          var lat = e.latLng.lat(); // lat of clicked point
          var lng = e.latLng.lng(); // lng of clicked point
          var data = [lat, lng];
          var urlsavedata = baseurl+"/savedata";
          console.log(urlsavedata);
           $.ajax({
              method: 'POST',
              data: JSON.stringify(data),
              url: urlsavedata,
              contentType: 'application/json',
              success : function (data) {
          
                  var markerId = getMarkerUniqueId(lat, lng); // an that will be used to cache this marker in markers object.
                  var marker = new google.maps.Marker({
                  position: getLatLng(lat, lng),
                  lat: lat,
                  lng:lng,
                  map: map,
                  id: 'marker_' + markerId,
                  draggable: true,
                  title: 'Hello World!',
                  animation: google.maps.Animation.DROP
                  });
                  markers[markerId] = marker; // cache marker in markers object
                  bindMarkerEvents(marker); // bind right click event to marker

                  if (Object.keys(markers).length === 2) {
                  calculateAndDisplayRoute(directionsService, directionsDisplay);
                  }
              }
          });

      }

  });

  /**
   * Binds right click event to given marker and invokes a callback function that will remove the marker from map.
   * @param {!google.maps.Marker} marker A google.maps.Marker instance that the handler will binded.
   */ 
    var bindMarkerEvents = function(marker) {
      google.maps.event.addListener(marker, "rightclick", function (point) {
          var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()); // get marker id by using clicked point's coordinate
          var marker = markers[markerId]; // find marker
          removeMarker(marker, markerId); // remove it
      });
    };

    /**
     * Removes given marker from map.
     * @param {!google.maps.Marker} marker A google.maps.Marker instance that will be removed.
     * @param {!string} markerId Id of marker.
     */ 
    var removeMarker = function(marker, markerId) {
        marker.setMap(null); // set markers setMap to null to remove it from map
        delete markers[markerId]; // delete marker instance from markers object
    };

      var directionsDisplay = new google.maps.DirectionsRenderer;
      var directionsService = new google.maps.DirectionsService;
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('right-panel'));
      var control = document.getElementById('floating-panel');
      control.style.display = 'block';
   
      var onChangeHandler = function() {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
      };

      document.getElementById('start').addEventListener('change', onChangeHandler);
      document.getElementById('end').addEventListener('change', onChangeHandler);
}


  function calculateAndDisplayRoute(directionsService, directionsDisplay) {

     
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;


  directionsService.route({
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

// Make Function Control for Action when click, Mousein, and MouseOut, on google map api
function CreateControlAction(marker, map, infowindow, data) {

    // Make Function when Icon touch
     google.maps.event.addListener(marker, 'mousemove', function () {
      var PointerIcon = "img/IconMap/"+ data.Icon+"Pointer.png";
      this.setIcon(PointerIcon);  
      $('.panel-heading .panel-title').removeClass('SelectPanel');
      $('.panel-heading .'+data.Icon).addClass('SelectPanel');
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
      var DefaultIcon = "img/IconMap/"+ data.Icon+".png";
      this.setIcon(DefaultIcon);
      $('.panel-heading .panel-title').removeClass('SelectPanel');
    });

    // Make Function when Icon cliked
    google.maps.event.addListener(marker, 'click', function () {
    // and if user click any pins ​ ​ in the map, the  zoom value would be ​ 17 ​ 
    //and the pin is centered horizontally and vertically​  within the ​ map. 
      map.setZoom(17); 
      map.setCenter(marker.getPosition());

       var UrlGoogleMap = baseurl+"/process_get"; 
      
      // Using​ AJAX​  for data retrieval
      document.getElementById("PlaceDescription1").value = data.PlaceDescription1;
      document.getElementById("PlaceDescription2").value = data.PlaceDescription2;
      document.getElementById("PlaceDescription3").value = data.PlaceDescription3;
      document.getElementById("PlaceDescription4").value = data.PlaceDescription4;
      var PlaceDescription1 = $('#PlaceDescription1').val();
      var PlaceDescription2 = $('#PlaceDescription2').val();
      var PlaceDescription3 = $('#PlaceDescription3').val();
      var PlaceDescription4 = $('#PlaceDescription4').val();
      var dataarray = {
        'Icon' : data.Icon,
        'Latitude' : data.Latitude,
        'Longitude': data.Longitude,
        'PlaceDescription1': PlaceDescription1,
        'PlaceDescription2': PlaceDescription2,
        'PlaceDescription3': PlaceDescription3,
        'PlaceDescription4': PlaceDescription4,
        'PlaceName': data.PlaceName,
      };

      $.ajax({
          method: 'POST',
          url: UrlGoogleMap,
          data: JSON.stringify(dataarray),
          contentType: 'application/json',
          success : function (response) {

            // All the pin​  in the map can be clicked​  and show ​ different​  description about the place. 
            $('#'+response.Icon).click();
            $('.panel-heading .panel-title').removeClass('SelectPanel');
            $('.panel-heading .'+response.icon).addClass('SelectPanel');
            $('.PopUpDescription').removeClass('hide');
            $('.PopUpDescription .Title').html(response.PlaceName);
            $('.PopUpDescription .PlaceDescription1').html(response.PlaceDescription1);
            $('.PopUpDescription .PlaceDescription2').html(response.PlaceDescription2);
            $('.PopUpDescription .PlaceDescription3').html(response.PlaceDescription3);
            $('.PopUpDescription .PlaceDescription4').html(response.PlaceDescription4);
           }
      });
    });
}

// Source Reference https://developers.google.com/maps/documentation/javascript/examples/control-custom
function ZoomControl(controlDiv, map) {
  
  // Creating styles for custom zoom control
  controlDiv.style.backgroundColor = '#1f222d';
  controlDiv.style.height = '876px';
  controlDiv.style.width = '140px';

  // Creating CSS for the control wrapper
  var controlWrapper = document.createElement('div');
  controlWrapper.style.backgroundColor = 'blue';
  controlWrapper.style.bottom = '74px';
  controlWrapper.style.left = '66px';
  controlWrapper.style.cursor = 'pointer';
  controlWrapper.style.position = 'absolute';
  controlDiv.appendChild(controlWrapper);

  // Creating CSS for the zoomOut
  var zoomOutButton = document.createElement('div');
  zoomOutButton.style.width = '30px'; 
  zoomOutButton.style.height = '30px';
  
  // Creating CSS for the zoomIn
  var zoomInButton = document.createElement('div');
  zoomInButton.style.width = '30px'; 
  zoomInButton.style.height = '30px';

  /* Call Content Icon .png for Zooming */
  var ZoomInBackground = "img/ZoomMap/ZoomIn.png";
  zoomInButton.style.backgroundImage = "url("+ZoomInBackground +")";
  controlWrapper.appendChild(zoomInButton);
    
  /* Call Content Icon .png for ZoomOut */
  var ZoomOutBackground = "img/ZoomMap/ZoomOut.png";
  zoomOutButton.style.backgroundImage = "url("+ZoomOutBackground+")";
  controlWrapper.appendChild(zoomOutButton);

  // Setup the click event listener - zoomIn
  google.maps.event.addDomListener(zoomInButton, 'click', function() {
    map.setZoom(map.getZoom() + 1);
  });
    
  // Setup the click event listener - zoomOut
  google.maps.event.addDomListener(zoomOutButton, 'click', function() {
    map.setZoom(map.getZoom() - 1);
  });  
    
}

function ExportMap(){
  var element = $("#map");
  html2canvas(element, {
    useCORS: true,
    onrendered: function(canvas) {
      var dataUrl= canvas.toDataURL("image/png");
      myWindow=window.open('','','width=1420,height=876');
      myWindow.document.write('<img src="' + dataUrl + '"/>');
      myWindow.document.close(); //missing code
      myWindow.focus();
      myWindow.print();
    }
  });
}

function CloseFunction(){
  $('.PopUpDescription').addClass('hide');
  InitMap();
}

function RefreshMap(){
  $('.PopUpDescription').addClass('hide');
  InitMap();
}



// make function for Show and hide Arrow Icon
function MarinaFunction(state){
  if (state) {
    $("#MarinaBaySands").attr("onclick", "MarinaFunction(0)");
    $('.MarinaBaySands .ArrowOpen').addClass('hide');
    $('.MarinaBaySands .ArrowClose').removeClass('hide');
  } else{
    $("#MarinaBaySands").attr("onclick", "MarinaFunction(1)");
    $('.MarinaBaySands .ArrowClose').addClass('hide');
    $('.MarinaBaySands .ArrowOpen').removeClass('hide');
  }
}

function GardenbytheBayFunction(state){
  if (state) {
    $("#GardensByTheBay").attr("onclick", "GardenbytheBayFunction(0)");
    $('.GardensByTheBay .ArrowOpen').addClass('hide');
    $('.GardensByTheBay .ArrowClose').removeClass('hide');

  } else{
    $("#GardensByTheBay").attr("onclick", "GardenbytheBayFunction(1)");
    $('.GardensByTheBay .ArrowClose').addClass('hide');
    $('.GardensByTheBay .ArrowOpen').removeClass('hide');
  }
}

function ChinaTownFunction(state){
  if (state) {
    $("#Chinatown").attr("onclick", "ChinaTownFunction(0)");
    $('.Chinatown .ArrowOpen').addClass('hide');
    $('.Chinatown .ArrowClose').removeClass('hide');
  } else{
    $("#Chinatown").attr("onclick", "ChinaTownFunction(1)");
    $('.Chinatown .ArrowClose').addClass('hide');
    $('.Chinatown .ArrowOpen').removeClass('hide');
  }
}

function BrowseFunction(){
console.log("dsfds");
}
function SuggestFunction(){
console.log("dsfds");
}

function VideosFunction(){
console.log("dsfds");
}

function BlogFunction(){
console.log("dsfds");
}

function AboutFunction(){
console.log("dsfds");
}







