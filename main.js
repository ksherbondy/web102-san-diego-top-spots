let allSpots = []; // 1. Must be outside the functions
let currentUserLat, currentUserLon;

$(document).ready(function () {
    // 2. Theme toggle logic (Keep this!)
    $('#theme-toggle').click(function() {
        const body = $('body');
        if (body.attr('data-theme') === 'dark') {
            body.removeAttr('data-theme');
            $(this).text('🌙');
        } else {
            body.attr('data-theme', 'dark');
            $(this).text('☀️');
        }
    });

    // 3. Category Filter logic
    $('#category-filter').on('change', function() {
        const selectedCategory = $(this).val();
        filterAndDisplay(selectedCategory);
    });

    // 4. Geolocation logic
    navigator.geolocation.getCurrentPosition(function(position) {
        currentUserLat = position.coords.latitude;
        currentUserLon = position.coords.longitude;
        loadData(); // Call loadData after we get coordinates
    }, function(error) {
        console.error("Location denied", error);
        loadData(); // Call loadData even if location fails
    });
});

function loadData() {
    $.getJSON("data.json", function(data) {
        allSpots = data; 
        
        // Calculate distance for everyone once
        allSpots.forEach(function(spot) {
            if (currentUserLat && currentUserLon) {
                spot.distance = getDistance(currentUserLat, currentUserLon, spot.location[0], spot.location[1]);
            } else {
                spot.distance = 9999;
            }
        });

        // 5. CRITICAL: Call the display function after data is ready
        filterAndDisplay('all');
    });
}

function filterAndDisplay(category) {
    let filteredData = allSpots;

    // Filter by category
    if (category !== 'all') {
        filteredData = allSpots.filter(spot => spot.category === category);
    }

    // Sort by distance (Remember: getDistance returns a string, so we parseFloat)
    filteredData.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    // Clear the table before rebuilding
    $('tbody').empty(); 

    // Build the rows
    filteredData.forEach(function(spot) {
        // Updated Map URL (Using the standard Search format)
        const mapURL = `https://www.google.com/maps/search/?api=1&query=${spot.location[0]},${spot.location[1]}`;
        
        
        const distanceText = (spot.distance == 9999) ? "N/A" : `${spot.distance} mi`;

        const row = `
            <tr>
                <td>${spot.name}</td>
                <td>${spot.description}</td>
                <td>${distanceText}</td>
                <td><a href="${mapURL}" target="_blank" class="view-btn">Directions</a></td>
            </tr>
        `;
        $('tbody').append(row);
    });
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
}
/*$(document).ready(function () {
    // 1. Ask for location first
    navigator.geolocation.getCurrentPosition(function(position) {
        loadData(position.coords.latitude, position.coords.longitude);
    }, function(error) {
        console.error("Location denied", error);
        loadData(); // Still load data even if they say no
    });

    $('#theme-toggle').click(function() {
    const body = $('body');
    if (body.attr('data-theme') === 'dark') {
        body.removeAttr('data-theme');
        $(this).text('🌙');
    } else {
        body.attr('data-theme', 'dark');
        $(this).text('☀️');
    }
});

});

function loadData(userLat, userLon) {
    $.getJSON("data.json", function(data) {
        
        // 2. Step 3 Logic: Calculate distance for EVERY spot
        data.forEach(function(spot) {
            if (userLat && userLon) {
                spot.distance = getDistance(userLat, userLon, spot.location[0], spot.location[1]);
            } else {
                spot.distance = 9999; // Default if no location
            }
        });

        // 3. Sort the array so the closest spots are at the top
        data.sort(function(a, b) {
            return a.distance - b.distance;
        });

        // 4. Now that it's sorted, build the table
        data.forEach(function(spot) {
            //const mapURL = `http://googleusercontent.com/maps.google.com/${spot.location[0]},${spot.location[1]}`;
            //const mapURL = `https://www.google.com/maps/search/?api=1&query=${spot.location[0]},${spot.location[1]}`;
            const mapURL = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLon}&destination=${spot.location[0]},${spot.location[1]}&travelmode=driving`;
            // Show "Distance Unknown" if location was denied
            const distanceText = (spot.distance == 9999) ? "N/A" : `${spot.distance} mi`;

            const row = `
                <tr>
                    <td>${spot.name}</td>
                    <td>${spot.description}</td>
                    <td>${distanceText}</td>
                    <td><a href="${mapURL}" target="_blank">View on Map</a></td>
                </tr>
            `;
            $('tbody').append(row);
        });
    });
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Returns distance rounded to 2 decimals
}
    */