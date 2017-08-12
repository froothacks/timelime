var parse = require('parse-human-date-range');
//last 2 days
var a = parse('after 5 pm');
console.log(parse);

console.log(a);
console.log(parse('last 2 days'));

var chrono = require('chrono-node');
console.log(chrono.parseDate('An appointment on Sep 12-13')) ;
//An appointment on 5 pm Sep 12 to 3 pm Sep 13
var res = chrono.parse('I am free today from 9:00 to 10:00 and from 12:00 to 5');
console.log(res);
console.log(res[0].start) ;
console.log(res[0].end) ;