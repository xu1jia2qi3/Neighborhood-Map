// These are the places that will show up on the side navigation and map.
var locations = [
    {
        title: "Conestoga Mall",
        position: { lat: 43.497939, lng: -80.526985 },
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
        title: "Wilfrid Laurier University",
        position: { lat: 43.473923, lng: -80.526092 },
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


function ViewModel() {
    var self = this;
    // initial all the variable to shorten the following code
    var bounds = new google.maps.LatLngBounds();
    var largeInfowindow = new google.maps.InfoWindow();
    self.markers = [];
    self.query = ko.observable('');
    self.showPlaces = ko.observableArray(locations);

    var content = "loading...Please wait for a sec.";
    var client_id = "BL0T0CUZECJLTZIYOVA3KYXLJAU011W3C2JPVUMWT4CEZ1WQ";
    var client_secret = "TJ1QN0TJ3X3BDHFVSCGGQCFUDVDQXQPGOK4P4IXI4KUKYSYZ";
    var foursquareUrl = "https://api.foursquare.com/v2/venues/search";
    var foursquarebaseUrl = "https://api.foursquare.com/v2/venues/";


    // This is making init markers function
    self.showPlaces().forEach(function (data) {
        // creates marker for those locations in the raw data
        marker = new google.maps.Marker({
            position: data.position,
            map: map,
            title: data.title,
            animation: google.maps.Animation.DROP
        });

        data.marker = marker;
        this.markers.push(marker);

        //creates info window if you click the marker.
        marker.addListener('click', function () {
            openInfoWindow(this, largeInfowindow);
        });

        //it makes all the markers fit into the screen.
        bounds.extend(marker.position);
        map.fitBounds(bounds);
    });


    //This function means clicking the list title works the same as clicking the marker
    self.listClick = function (data) {

        if (data.title) {
            map.setZoom(16);
            map.panTo(data.position);
            data.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () { data.marker.setAnimation(null); }, 1420);
            openInfoWindow(data.marker, largeInfowindow);
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
                query: marker.title, // gets data from marker.title (array of object)
                near: "waterloo,ON",
                limit: 1, // limit 1 result to make it load faster.
                v: 20190110 // version date
            },
            // if ajax works correctly it will abstract information from foursquare
            success: function (data) {
                venue = data.response.venues[0];
                venuename = venue.name;
                address1 = venue.location.formattedAddress[0];
                address2 = venue.location.formattedAddress[1];
                foursquareId = venue.id;
                foursquarelink = "https://foursquare.com/v/" + foursquareId;
            }
        }).done(function () {
            // Generate the infomation to the info window.
            content = '<div class="infotitle">' + venuename + '</div>' +
                '<img class ="picture" src=""/>' + '<div class="address">' +
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


        });

        // //photos
        // $.ajax({
        //     dataType: "json",
        //     url: foursquarebaseUrl + foursquareId + '/photos',
        //     data: {
        //         client_id: client_id,
        //         client_secret: client_secret,
        //         limit: 2,
        //         v: 20190110,
        //     },
        //     // if there is picture, it will show a picture for the info window.
        //     success: function (data) {
        //         item = data.response.photos.items[1];
        //         prefix = item.prefix;
        //         suffix = item.suffix;
        //         imageURL = prefix + '250x200' + suffix;
        //         img = imageURL;
        //     },
        // }).done(function () {
        //     // Generate the infomation to the info window.
        //     content = '<div class="infotitle">' + venuename + '</div>' +
        //         '<img class ="picture" src="' + img + '"/>' + '<div class="address">' +
        //         address1 + '</div>' + '<div class="address">' + address2 + '</div>' +
        //         "<a href='" + foursquarelink + "'target='_blank'>" + "More Info" + "</a>";

        //     marker.setAnimation(google.maps.Animation.BOUNCE);
        //     setTimeout(function () { marker.setAnimation(null); }, 1420);
        //     infowindow.marker = marker;
        //     infowindow.setContent(content);
        //     infowindow.open(map, marker);
        //     map.setZoom(16);
        //     map.panTo(marker.position);
        //     // Make sure the marker property is cleared if the infowindow is closed.
        //     infowindow.addListener('closeclick', function () {
        //         infowindow.setMarker = null;
        //     });


        // })

    }










}

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.472589, lng: -80.542737 },
        zoom: 14
    });
    ko.applyBindings(ViewModel());
}