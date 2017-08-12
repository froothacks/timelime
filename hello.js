var parse = require('parse-human-date-range');
//last 2 days
var a = parse('after 5 pm');
console.log(parse);

console.log(a);
console.log(parse('last 2 days'));

var chrono = require('chrono-node');
console.log(chrono.parse('An appointment on Sep 12-13')) ;
//An appointment on 5 pm Sep 12 to 3 pm Sep 13
var res = chrono.parse("I'm available after 8 pm");
console.log(res);s
console.log(res[0].start.knownValues);
console.log(chrono.parse(res[0].start.knownValues));
var d = res[0].start.knownValues;
var y = res[0].start.impliedValues;
console.log(d);
console.log(y);
console.log(d.year, d.month, d.day, d.hour, d.minute, d.second);
var d = res[0].end.knownValues;
var y = res[0].end.impliedValues;
console.log(d);
console.log(y);
console.log(new Date(d.year, d.month, d.day, d.hour, d.minute, d.second));
// console.log(new Date(2017, 5, 5, 5, 0, 0));
console.log(res[0].end) ;