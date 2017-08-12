var parse = require('parse-human-date-range');
//last 2 days
var a = parse('after 5 pm');
console.log(parse);

console.log(a);
console.log(parse('last 2 days'));

var chrono = require('chrono-node');
console.log(chrono.parseDate('An appointment on Sep 12-13')) ;
//An appointment on 5 pm Sep 12 to 3 pm Sep 13
var res = chrono.parse('I am free today after 10:00');
console.log(res);
console.log(res[0].start) ;
console.log(res[0].end) ;