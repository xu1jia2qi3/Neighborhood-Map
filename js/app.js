// These are the places that will show up on the side navigation and map.
var locations = [
    {
        title: "Conestoga Mall",
        position: { lat: 43.498398, lng: -80.529367 },
    },
    {
        title: "CF Fairview Park",
        position: { lat: 43.429342, lng: -80.439394 },
    },
    {
        title: "University of Waterloo",
        position: { lat: 43.472856, lng: -80.544874 },
    },
    {
        title: "Waterloo Public Library",
        position: { lat: 43.474450, lng: -80.570969 },
    },
    {
        title: "Conestoga College",
        position: { lat: 43.390740, lng: -80.405951 },
    },
    {
        title: "Laurel Creek Conservation Area",
        position: { lat: 43.490208, lng: -80.570172 },
    },
    {
        title: "Waterloo Park",
        position: { lat: 43.467775, lng: -80.527712 },
    },
    {
        title: "Victoria Park",
        position: { lat: 43.445868, lng: -80.498720 },
    }];

//This is the function for showing the infowindow when success getting info from foursqure back
function showImage(img, marker, infoWindow, map) {
    content = '<div class="infotitle">' + venuename + '</div>' +
        '<img class ="picture" src="' + img + '"/>' + '<div class="address">' +
        address1 + '</div>' + '<div class="address">' + address2 + '</div>' +
        "<a href='" + foursquarelink + "'target='_blank'>" + "More Info" + "</a>";

    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () { marker.setAnimation(null); }, 1420);
    infoWindow.marker = marker;
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
    map.setZoom(16);
    map.panTo(marker.position);
    // Make sure the marker property is cleared if the infowindow is closed.
    infoWindow.addListener('closeclick', function () {
        infoWindow.setMarker = null;
    });
}

function ViewModel() {
    var self = this;
    // initial all the variables
    var bounds = new google.maps.LatLngBounds();
    var LargeInfoWindow = new google.maps.InfoWindow();
    self.markers = [];
    self.query = ko.observable('');
    self.showPlaces = ko.observableArray(locations);

    // foursqure API infomations
    var client_id = "BL0T0CUZECJLTZIYOVA3KYXLJAU011W3C2JPVUMWT4CEZ1WQ";
    var client_secret = "RW3DF1CVWSMHLVVKIS1ISS4A1EFJ3MHLQULX3FS0HX5QLSET";
    var foursquareUrl = "https://api.foursquare.com/v2/venues/search";
    var foursquarebaseUrl = "https://api.foursquare.com/v2/venues/";
    var img = "css/noimage.png";

    // make two icon colors for mouse hover/out amination
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }
    var defaultIcon = makeMarkerIcon('E52B2B');
    var highlightedIcon = makeMarkerIcon('2BDFE5');

    // This is making init markers function
    self.showPlaces().forEach(function (data) {
        // creates marker for those locations in the raw data
        marker = new google.maps.Marker({
            position: data.position,
            map: map,
            title: data.title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
        });
        data.marker = marker;
        //creates info window if you click/hover/out the marker.
        marker.addListener('click', function () {
            openInfoWindow(this, LargeInfoWindow);
        });
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
            this.setAnimation(google.maps.Animation.BOUNCE);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
            this.setAnimation(0);
        });
        //push all setting to maker
        this.markers.push(marker);
        //it makes all the markers fit into the screen.
        bounds.extend(marker.position);
        map.fitBounds(bounds);
    });

    //This function means clicking the list title works the same as clicking the marker on map
    self.listClick = function (data) {
        if (data.title) {
            map.setZoom(16);
            map.panTo(data.position);
            data.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () { data.marker.setAnimation(null); }, 1420);
            openInfoWindow(data.marker, LargeInfoWindow);
        }
    };

    //this is the search and filter function
    self.search = ko.computed(function () {
        var filter = self.query().toLowerCase();
        var inQuery = self.showPlaces();
        //this is how the search result connect to the markers
        return ko.utils.arrayFilter(inQuery, function (data) {
            if (data.title.toLowerCase().indexOf(filter) >= 0) {
                data.marker.setVisible(true);
                return true;
            } else {
                data.marker.setVisible(false);
            }
        });
    });

    //This is reset function, it will reload the page
    self.reset = function () {
        location.reload();
    }

    // Function of info window shows all the information from foursquare 
    function openInfoWindow(marker, infoWindow) {
        //fetch info from foursquare 
        $.ajax({
            dataType: "json",
            url: foursquareUrl,
            data: {
                client_id: client_id,
                client_secret: client_secret,
                query: marker.title, // gets data from marker.title
                near: "waterloo,ON",
                limit: 1,
                v: 20190114 // version date
            },

            // if ajax works correctly it will abstract information from foursquare
            success: function (data) {
                venue = data.response.venues[0];
                venuename = venue.name;
                address1 = venue.location.formattedAddress[0];
                address2 = venue.location.formattedAddress[1];
                foursquareId = venue.id;
                foursquarelink = "https://foursquare.com/v/" + foursquareId;

                //base on the first success fetch informations, fetch again for the photos
                $.ajax({
                    dataType: "json",
                    url: foursquarebaseUrl + foursquareId + '/photos',
                    data: {
                        client_id: client_id,
                        client_secret: client_secret,
                        limit: 2,
                        v: 20190114,
                    },
                    // if there is picture, it will show a picture for the info window.
                    success: function (data) {
                        item = data.response.photos.items[0];  //show the first one picture
                        prefix = item.prefix;
                        suffix = item.suffix;
                        imageURL = prefix + '200x160' + suffix;
                        img = imageURL;
                    },
                })
            },
            //if something wrong with ajex, run this 
            error: function () {
                content = '<div class="infotitle">' + 'Something wrong right now.' +
                    ' Please try again.' + '</div>';
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () { marker.setAnimation(null); }, 1420);
                infoWindow.marker = marker;
                infoWindow.setContent(content);
                infoWindow.open(map, marker);
                map.setZoom(16);
                map.panTo(marker.position);
                infoWindow.addListener('closeclick', function () {
                    infoWindow.setMarker = null;
                });
            }
        }).done(function () {
            showImage(img, marker, infoWindow, map);
        });
    }
}

//create init map and apply bindings
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.472589, lng: -80.542737 },
        zoom: 14
    });
    ko.applyBindings(ViewModel());
}

//if something wrong with google map, run this
function mapError() {
    alert("Oops!. Please try again!");
}