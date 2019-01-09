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
// this creates the connection between the data and the user interface.
function destination(data) {
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
  }
  
function ViewModel() {
    var self = this;
    // initial all the variable to shorten the following code
    self.markers = [];
    var bounds = new google.maps.LatLngBounds();
    var largeInfowindow = new google.maps.InfoWindow();
    var content = "loading...Please wait for a sec.";
    var client_id = "BL0T0CUZECJLTZIYOVA3KYXLJAU011W3C2JPVUMWT4CEZ1WQ";
    var client_secret = "TJ1QN0TJ3X3BDHFVSCGGQCFUDVDQXQPGOK4P4IXI4KUKYSYZ";
    var foursquareUrl = "https://api.foursquare.com/v2/venues/search";
    var foursquarebaseUrl = "https://api.foursquare.com/v2/venues/";
   
    self.showPlaces = ko.observableArray(initialPlaces);
    // connect to the raw data
    self.showPlaces().forEach(function (data) {
        // creates marker for those locations in the raw data
        marker = new google.maps.Marker({
            position: data.location,
            map: map,
            title: data.name,
            animation: google.maps.Animation.DROP
        });

        data.marker = marker;
        this.markers.push(marker);
        marker.addListener('click', function () {
            //creates info window if you click the marker.
            populateInfoWindow(this, largeInfowindow);
        });
        //it makes all the markers fit into the screen.
        bounds.extend(marker.position);
        map.fitBounds(bounds);

        //this is how the hamburger button can show and hide the side navigation
        self.isOpen = ko.observable(false);

        self.open = function () {
            //use it to create a toggle to make it on and off
            self.isOpen(!self.isOpen());
        };
    });







}

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.472589, lng: -80.542737 },
        zoom: 14
    });
}