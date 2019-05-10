import React, {Component} from 'react';
import './GoogleMap.css'


export default class GoogleMap extends Component{

    state = {
        center: { lat: 37.335141, lng: -121.881093 },
        addresses: this.props.addresses,
        wareHouseId: this.props.wareHouseId,
    };

    
    componentDidMount() {
        this.renderMap();
    }
    

    renderMap = () => {
        loadScript(
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyDc74IQbxDTgM54Dnk8SLb3Cr5yty2xz-c&callback=initMap"
        );
        console.log(this.state);
        window.initMap = this.initMap;

    };

    initMap = () => {
        const ware1LatLng = new window.google.maps.LatLng(37.335989,-121.881458);
        const ware2LatLng = new window.google.maps.LatLng(37.352039,-121.937393);
        const directionsService = new window.google.maps.DirectionsService();
        const directionsDisplay = new window.google.maps.DirectionsRenderer();
        const map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: this.state.center,
        });

        var test = null;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var new_pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                let myposwindow = new window.google.maps.InfoWindow();
                myposwindow.setContent("You are here");
                myposwindow.setPosition(new_pos);
                myposwindow.open(map, this);
                map.setCenter(new_pos);

            });
        }
        else {
            alert("Browser does not support geolocation");
        }

        // Mark location of Warehouse 1
        var markerware1 = new window.google.maps.Marker({
            position: ware1LatLng,
            label: {
                text: '1'
            },
            map: map
        });

        // Mark location of Warehouse 2
        var markerware2 = new window.google.maps.Marker({
            position: ware2LatLng,
            label: {
                text: '2'
            },
            map: map
        });

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('right-panel'));

        this.calculateAndDisplayRoute(directionsService, directionsDisplay);
        window.google.maps.event.trigger(map, 'resize');
    };



    calculateAndDisplayRoute = (directionsService, directionsDisplay) => {
        var address = this.state.addresses;
        var ware = this.props.wareHouseId;
        const warehouse1 = "150 E San Fernando St, San Jose, CA 95112";
        const warehouse2 = "500 El Camino Real, Santa Clara, CA 95053";
        var currentLocation;
        console.log("warehouseID",ware);
        navigator.geolocation.getCurrentPosition(function(position) {
            var new_pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            currentLocation = new_pos;
        });

        // First DirectionsRequest
        const request = {
            waypoints: [],
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        };

            
            // Determine which warehouse to start from 
            if(ware == 2)  // start from Warehouse 2
            {
                request.origin = warehouse2;
            }
            else   // start from Warehouse 1 
            {
                request.origin = warehouse1;
            }
            // always end at Warehouse 1
            request.destination = warehouse1;
            
            // populate waypoint array with delivery addresses
            for(var i = 0; i < address.length; i++)
            {
                request.waypoints.push({
                    location: address[i],
                    stopover: true
                });
            }

            console.log("First Call", request);

            var fullRoute = []; // will contain the new route to be passed
            var wayorder = [];  // optimized waypoint order of indexes 

            // first directionsService call optimizes waypoints
            directionsService.route(request, function(result, status) {
                if (status === window.google.maps.DirectionsStatus.OK)
                {
                    wayorder = result.routes[0].waypoint_order;
                    console.log("Optimal Order",wayorder);
                }
                else
                {
                    window.alert('Request failed due to ' + status);
                }

                // Second Directions Request
                const request2 = {
                    origin: currentLocation,              // start at current location
                    destination: request.destination,     // end at Warehouse 1
                    travelMode: 'DRIVING',
                    waypoints: [] 
                    // optimizeWaypoints not needed because waypoints already in correct order
                };

                // Pickup item orders from Warehouse(s), add it as first waypoint
                request2.waypoints.push({
                    location: request.origin,  // contains initial warehouse
                    stopover: true
                });

                // If some orders in Warehouse 2, add it as a waypoint 
                if(ware == 3)
                {
                    request2.waypoints.push({
                        location: warehouse2,
                        stopover: true
                    });
                }

                // copy optimized waypoint route
                for(var i = 0; i < wayorder.length; i++)
                {   
                    request2.waypoints.push({
                        location: request.waypoints[wayorder[i]].location,
                        stopover: true
                    });
                }
                    
                console.log("Second Call", request2);

                // second directionsService call displays Map Directions
                directionsService.route(request2, function(result2, status) {
                    if (status === window.google.maps.DirectionsStatus.OK)
                    {
                        directionsDisplay.setDirections(result2);
                    }
                    else
                    {
                        window.alert('Request failed due to ' + status);
                    }
                });

            });    
    };


    render() {
        return (
            <div class="container">   
                <div id="map" />
                <div id="right-panel" />
            </div>
        );
    }
}

function loadScript(url) {
    let index = window.document.getElementsByTagName("script")[0];
    //console.log(index);
    let script = window.document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    index.parentNode.insertBefore(script, index);
    //console.log(window.document.getElementsByTagName("script")[0]);
    //console.log(window.document.getElementsByTagName("script")[1]);
}

