$(document).ready(function () {
    // write your code here
    $.getJSON("data.json", function(data) {
        console.log(data);
        data.forEach(function(spot) {
            const latitude = spot.location[0];
            const longitude = spot.location[1];
            const mapURL = 'https://www.google.com/maps?q=' + latitude + ',' + longitude;

            const row = `
                <tr>
                    <td>${spot.name}</td>
                    <td>${spot.description}</td>
                    <td>
                        <a href="${mapURL}" target="_blank">
                            <button>View on Map</button>
                        </a>
                    </td>
                </tr>
            `;
            $('tbody').append(row);
        });
    });

});