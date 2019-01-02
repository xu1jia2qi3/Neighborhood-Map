var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center : {lat:43.472589, lng:-80.542737},
        zoom:14
    });
}