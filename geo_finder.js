var csv = require('csv-parser')
var fs = require('fs')

var x = -79.7592242 //LONG
var y = 43.6850141 //LATT
var closest_location = [];
var shortest_distance = Infinity;
fs.createReadStream('business-directory.csv')
    .pipe(csv())
    .on('data', function(data) {
        var a = x - parseFloat(data.X)
            // console.log(x, data.X)
        var b = y - parseFloat(data.Y)
        var c = Math.sqrt(a * a + b * b);
        // console.log(c);
        // console.log(shortest_distance);
        if (data.PRODUCT_DESC.toLowerCase().indexOf("coffee") !== -1 && c < shortest_distance) {
            closest_location = [];
            shortest_distance = c;
            console.log(shortest_distance)
            closest_location.push(data.COMPANY_NAME)
            closest_location.push(data.PRODUCT_DESC)
            closest_location.push((data.BUSINESS_FULL_ADDRESS +" "+ data.CITY +" "+data.PROVINCE+" "+ data.POSTAL_CODE))
            console.log(closest_location)
        }
    })
