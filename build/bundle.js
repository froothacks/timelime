"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
            }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        // shim for using process in browser
        var process = module.exports = {};

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }
        function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
        }
        (function () {
            try {
                if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        })();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }

        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }

        process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function () {
            this.fun.apply(null, this.array);
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues
        process.versions = {};

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function (name) {
            return [];
        };

        process.binding = function (name) {
            throw new Error('process.binding is not supported');
        };

        process.cwd = function () {
            return '/';
        };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function () {
            return 0;
        };
    }, {}], 2: [function (require, module, exports) {

        var options = exports.options = require('./options');

        exports.parser = require('./parsers/parser');
        exports.refiner = require('./refiners/refiner');

        exports.Parser = exports.parser.Parser;
        exports.Refiner = exports.refiner.Refiner;
        exports.Filter = exports.refiner.Filter;

        exports.ParsedResult = require('./result').ParsedResult;
        exports.ParsedComponents = require('./result').ParsedComponents;

        var Chrono = function Chrono(option) {

            option = option || exports.options.casualOption();

            this.option = option;
            this.parsers = new Object(option.parsers);
            this.refiners = new Object(option.refiners);
        };

        Chrono.prototype.parse = function (text, refDate, opt) {

            refDate = refDate || new Date();
            opt = opt || {};

            var allResults = [];

            this.parsers.forEach(function (parser) {
                var results = parser.execute(text, refDate, opt);
                allResults = allResults.concat(results);
            });

            allResults.sort(function (a, b) {
                return a.index - b.index;
            });

            this.refiners.forEach(function (refiner) {
                allResults = refiner.refine(text, allResults, opt);
            });

            return allResults;
        };

        Chrono.prototype.parseDate = function (text, refDate, opt) {
            var results = this.parse(text, refDate, opt);
            if (results.length > 0) {
                return results[0].start.date();
            }
            return null;
        };

        exports.Chrono = Chrono;
        exports.strict = new Chrono(options.strictOption());
        exports.casual = new Chrono(options.casualOption());

        exports.en = new Chrono(options.mergeOptions([options.en.casual, options.commonPostProcessing]));

        exports.en_GB = new Chrono(options.mergeOptions([options.en_GB.casual, options.commonPostProcessing]));

        exports.de = new Chrono(options.mergeOptions([options.de.casual, options.en, options.commonPostProcessing]));

        exports.es = new Chrono(options.mergeOptions([options.es.casual, options.en, options.commonPostProcessing]));

        exports.fr = new Chrono(options.mergeOptions([options.fr.casual, options.en, options.commonPostProcessing]));

        exports.ja = new Chrono(options.mergeOptions([options.ja.casual, options.en, options.commonPostProcessing]));

        exports.parse = function () {
            return exports.casual.parse.apply(exports.casual, arguments);
        };

        exports.parseDate = function () {
            return exports.casual.parseDate.apply(exports.casual, arguments);
        };
    }, { "./options": 3, "./parsers/parser": 49, "./refiners/refiner": 63, "./result": 64 }], 3: [function (require, module, exports) {
        var parser = require('./parsers/parser');
        var refiner = require('./refiners/refiner');

        exports.mergeOptions = function (options) {

            var addedTypes = {};
            var mergedOption = {
                parsers: [],
                refiners: []
            };

            options.forEach(function (option) {

                if (option.call) {
                    option = option.call();
                }

                if (option.parsers) {
                    option.parsers.forEach(function (p) {
                        if (!addedTypes[p.constructor]) {
                            mergedOption.parsers.push(p);
                            addedTypes[p.constructor] = true;
                        }
                    });
                }

                if (option.refiners) {
                    option.refiners.forEach(function (r) {
                        if (!addedTypes[r.constructor]) {
                            mergedOption.refiners.push(r);
                            addedTypes[r.constructor] = true;
                        }
                    });
                }
            });

            return mergedOption;
        };

        exports.commonPostProcessing = function () {
            return {
                refiners: [
                // These should be after all other refiners
                new refiner.ExtractTimezoneOffsetRefiner(), new refiner.ExtractTimezoneAbbrRefiner(), new refiner.UnlikelyFormatFilter()]
            };
        };

        // -------------------------------------------------------------

        exports.strictOption = function () {
            var strictConfig = {
                strict: true
            };

            return exports.mergeOptions([exports.en(strictConfig), exports.de(strictConfig), exports.es(strictConfig), exports.fr(strictConfig), exports.ja(strictConfig), exports.zh, exports.commonPostProcessing]);
        };

        exports.casualOption = function () {
            return exports.mergeOptions([exports.en.casual,
            // Some German abbriviate overlap with common English
            exports.de({ strict: true }), exports.es.casual, exports.fr.casual, exports.ja.casual, exports.zh, exports.commonPostProcessing]);
        };

        // -------------------------------------------------------------

        exports.de = function (config) {
            return {
                parsers: [new parser.DEDeadlineFormatParser(config), new parser.DEMonthNameLittleEndianParser(config), new parser.DEMonthNameParser(config), new parser.DESlashDateFormatParser(config), new parser.DETimeAgoFormatParser(config), new parser.DETimeExpressionParser(config)],
                refiners: [new refiner.OverlapRemovalRefiner(), new refiner.ForwardDateRefiner(), new refiner.DEMergeDateTimeRefiner(), new refiner.DEMergeDateRangeRefiner()]
            };
        };

        exports.de.casual = function () {
            var option = exports.de({
                strict: false
            });
            option.parsers.unshift(new parser.DECasualDateParser());
            option.parsers.unshift(new parser.DEWeekdayParser());
            return option;
        };

        // -------------------------------------------------------------


        exports.en = function (config) {
            return {
                parsers: [new parser.ENISOFormatParser(config), new parser.ENDeadlineFormatParser(config), new parser.ENMonthNameLittleEndianParser(config), new parser.ENMonthNameMiddleEndianParser(config), new parser.ENMonthNameParser(config), new parser.ENSlashDateFormatParser(config), new parser.ENSlashDateFormatStartWithYearParser(config), new parser.ENSlashMonthFormatParser(config), new parser.ENTimeAgoFormatParser(config), new parser.ENTimeFromNowFormatParser(config), new parser.ENTimeExpressionParser(config)],
                refiners: [new refiner.OverlapRemovalRefiner(), new refiner.ForwardDateRefiner(),

                // English
                new refiner.ENMergeDateTimeRefiner(), new refiner.ENMergeDateRangeRefiner(), new refiner.ENPrioritizeSpecificDateRefiner()]
            };
        };

        exports.en.casual = function (config) {
            config = config || {};
            config.strict = false;
            var option = exports.en(config);

            // EN
            option.parsers.unshift(new parser.ENCasualDateParser());
            option.parsers.unshift(new parser.ENCasualTimeParser());
            option.parsers.unshift(new parser.ENWeekdayParser());
            option.parsers.unshift(new parser.ENRelativeDateFormatParser());
            return option;
        };

        exports.en_GB = function (config) {
            config = config || {};
            config.littleEndian = true;
            return exports.en(config);
        };

        exports.en_GB.casual = function (config) {
            config = config || {};
            config.littleEndian = true;
            return exports.en.casual(config);
        };

        // -------------------------------------------------------------

        exports.ja = function () {
            return {
                parsers: [new parser.JPStandardParser()],
                refiners: [new refiner.OverlapRemovalRefiner(), new refiner.ForwardDateRefiner(), new refiner.JPMergeDateRangeRefiner()]
            };
        };

        exports.ja.casual = function () {
            var option = exports.ja();
            option.parsers.unshift(new parser.JPCasualDateParser());
            return option;
        };

        // -------------------------------------------------------------


        exports.es = function (config) {
            return {
                parsers: [new parser.ESTimeAgoFormatParser(config), new parser.ESDeadlineFormatParser(config), new parser.ESTimeExpressionParser(config), new parser.ESMonthNameLittleEndianParser(config), new parser.ESSlashDateFormatParser(config)],
                refiners: [new refiner.OverlapRemovalRefiner(), new refiner.ForwardDateRefiner()]
            };
        };

        exports.es.casual = function () {
            var option = exports.es({
                strict: false
            });

            option.parsers.unshift(new parser.ESCasualDateParser());
            option.parsers.unshift(new parser.ESWeekdayParser());
            return option;
        };

        // -------------------------------------------------------------

        exports.fr = function (config) {
            return {
                parsers: [new parser.FRDeadlineFormatParser(config), new parser.FRMonthNameLittleEndianParser(config), new parser.FRSlashDateFormatParser(config), new parser.FRTimeAgoFormatParser(config), new parser.FRTimeExpressionParser(config)],
                refiners: [new refiner.OverlapRemovalRefiner(), new refiner.ForwardDateRefiner(), new refiner.FRMergeDateRangeRefiner(), new refiner.FRMergeDateTimeRefiner()]
            };
        };

        exports.fr.casual = function () {
            var option = exports.fr({
                strict: false
            });

            option.parsers.unshift(new parser.FRCasualDateParser());
            option.parsers.unshift(new parser.FRWeekdayParser());
            option.parsers.unshift(new parser.FRRelativeDateFormatParser());
            return option;
        };

        // -------------------------------------------------------------

        exports.zh = function () {
            return {
                parsers: [new parser.ZHHantDateParser(), new parser.ZHHantWeekdayParser(), new parser.ZHHantTimeExpressionParser(), new parser.ZHHantCasualDateParser(), new parser.ZHHantDeadlineFormatParser()],
                refiners: [new refiner.OverlapRemovalRefiner(), new refiner.ForwardDateRefiner()]
            };
        };
    }, { "./parsers/parser": 49, "./refiners/refiner": 63 }], 4: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = new RegExp('(\\W|^)(' + 'jetzt|' + '(?:heute|diesen)\\s*(morgen|vormittag|mittag|nachmittag|abend)|' + '(?:heute|diese)\\s*nacht|' + 'heute|' + '(?:(?:ü|ue)ber)?morgen(?:\\s*(morgen|vormittag|mittag|nachmittag|abend|nacht))?|' + '(?:vor)?gestern(?:\\s*(morgen|vormittag|mittag|nachmittag|abend|nacht))?|' + 'letzte\\s*nacht' + ')(?=\\W|$)', 'i');

        exports.Parser = function DECasualDateParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var text = match[0].substr(match[1].length);
                var index = match.index + match[1].length;
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var refMoment = moment(ref);
                var startMoment = refMoment.clone();
                var lowerText = text.toLowerCase();

                if (/(?:heute|diese)\s*nacht/.test(lowerText)) {
                    // Normally means this coming midnight
                    result.start.imply('hour', 22);
                    result.start.imply('meridiem', 1);
                } else if (/^(?:ü|ue)bermorgen/.test(lowerText)) {
                    startMoment.add(refMoment.hour() > 1 ? 2 : 1, 'day');
                } else if (/^morgen/.test(lowerText)) {
                    // Check not "Tomorrow" on late night
                    if (refMoment.hour() > 1) {
                        startMoment.add(1, 'day');
                    }
                } else if (/^gestern/.test(lowerText)) {
                    startMoment.add(-1, 'day');
                } else if (/^vorgestern/.test(lowerText)) {
                    startMoment.add(-2, 'day');
                } else if (/letzte\s*nacht/.test(lowerText)) {
                    result.start.imply('hour', 0);
                    if (refMoment.hour() > 6) {
                        startMoment.add(-1, 'day');
                    }
                } else if (lowerText === 'jetzt') {
                    result.start.imply('hour', refMoment.hour());
                    result.start.imply('minute', refMoment.minute());
                    result.start.imply('second', refMoment.second());
                    result.start.imply('millisecond', refMoment.millisecond());
                }

                var secondMatch = match[3] || match[4] || match[5];
                if (secondMatch) {
                    switch (secondMatch.toLowerCase()) {
                        case 'morgen':
                            result.start.imply('hour', 6);
                            break;
                        case 'vormittag':
                            result.start.imply('hour', 9);
                            break;
                        case 'mittag':
                            result.start.imply('hour', 12);
                            break;
                        case 'nachmittag':
                            result.start.imply('hour', 15);
                            result.start.imply('meridiem', 1);
                            break;
                        case 'abend':
                            result.start.imply('hour', 18);
                            result.start.imply('meridiem', 1);
                            break;
                        case 'nacht':
                            result.start.imply('hour', 0);
                            break;
                    }
                }

                result.start.assign('day', startMoment.date());
                result.start.assign('month', startMoment.month() + 1);
                result.start.assign('year', startMoment.year());
                result.tags['DECasualDateParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 5: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/DE');

        var PATTERN = new RegExp('(\\W|^)' + '(in|nach)\\s*' + '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|einigen|eine[rm]\\s*halben|eine[rm])\\s*' + '(sekunden?|min(?:ute)?n?|stunden?|tag(?:en)?|wochen?|monat(?:en)?|jahr(?:en)?)\\s*' + '(?=\\W|$)', 'i');

        var STRICT_PATTERN = new RegExp('(\\W|^)' + '(in|nach)\\s*' + '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|eine(?:r|m)?)\\s*' + '(sekunden?|minuten?|stunden?|tag(?:en)?)\\s*' + '(?=\\W|$)', 'i');

        exports.Parser = function DEDeadlineFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return this.isStrictMode() ? STRICT_PATTERN : PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var index = match.index + match[1].length;
                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var num = match[3].toLowerCase();
                if (util.INTEGER_WORDS[num] !== undefined) {
                    num = util.INTEGER_WORDS[num];
                } else if (num === 'einer' || num === 'einem') {
                    num = 1;
                } else if (num === 'einigen') {
                    num = 3;
                } else if (/halben/.test(num)) {
                    num = 0.5;
                } else {
                    num = parseInt(num);
                }

                var date = moment(ref);
                if (/tag|woche|monat|jahr/i.test(match[4])) {

                    if (/tag/i.test(match[4])) {
                        date.add(num, 'd');
                    } else if (/woche/i.test(match[4])) {
                        date.add(num * 7, 'd');
                    } else if (/monat/i.test(match[4])) {
                        date.add(num, 'month');
                    } else if (/jahr/i.test(match[4])) {
                        date.add(num, 'year');
                    }

                    result.start.assign('year', date.year());
                    result.start.assign('month', date.month() + 1);
                    result.start.assign('day', date.date());
                    return result;
                }

                if (/stunde/i.test(match[4])) {

                    date.add(num, 'hour');
                } else if (/min/i.test(match[4])) {

                    date.add(num, 'minute');
                } else if (/sekunde/i.test(match[4])) {

                    date.add(num, 'second');
                }

                result.start.imply('year', date.year());
                result.start.imply('month', date.month() + 1);
                result.start.imply('day', date.date());
                result.start.assign('hour', date.hour());
                result.start.assign('minute', date.minute());
                result.start.assign('second', date.second());
                result.tags['DEDeadlineFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/DE": 65, "../parser": 49, "moment": 72 }], 6: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');

        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/DE');

        var PATTERN = new RegExp('(\\W|^)' + '(?:am\\s*?)?' + '(?:(Sonntag|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|So|Mo|Di|Mi|Do|Fr|Sa)\\s*,?\\s*)?' + '(?:den\\s*)?' + '([0-9]{1,2})\\.' + '(?:\\s*(?:bis(?:\\s*(?:am|zum))?|\\-|\\–|\\s)\\s*([0-9]{1,2})\\.)?\\s*' + '(Jan(?:uar|\\.)?|Feb(?:ruar|\\.)?|Mär(?:z|\\.)?|Maerz|Mrz\\.?|Apr(?:il|\\.)?|Mai|Jun(?:i|\\.)?|Jul(?:i|\\.)?|Aug(?:ust|\\.)?|Sep(?:t|t\\.|tember|\\.)?|Okt(?:ober|\\.)?|Nov(?:ember|\\.)?|Dez(?:ember|\\.)?)' + '(?:' + ',?\\s*([0-9]{1,4}(?![^\\s]\\d))' + '(\\s*[vn]\\.?\\s*C(?:hr)?\\.?)?' + ')?' + '(?=\\W|$)', 'i');

        var WEEKDAY_GROUP = 2;
        var DATE_GROUP = 3;
        var DATE_TO_GROUP = 4;
        var MONTH_NAME_GROUP = 5;
        var YEAR_GROUP = 6;
        var YEAR_BE_GROUP = 7;

        exports.Parser = function DEMonthNameLittleEndianParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var result = new ParsedResult({
                    text: match[0].substr(match[1].length, match[0].length - match[1].length),
                    index: match.index + match[1].length,
                    ref: ref
                });

                var month = match[MONTH_NAME_GROUP];
                month = util.MONTH_OFFSET[month.toLowerCase()];

                var day = match[DATE_GROUP];
                day = parseInt(day);

                var year = null;
                if (match[YEAR_GROUP]) {
                    year = match[YEAR_GROUP];
                    year = parseInt(year);

                    if (match[YEAR_BE_GROUP]) {
                        if (/v/i.test(match[YEAR_BE_GROUP])) {
                            // v.Chr.
                            year = -year;
                        }
                    } else if (year < 100) {

                        year = year + 2000;
                    }
                }

                if (year) {
                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.assign('year', year);
                } else {

                    //Find the most appropriated year
                    var refMoment = moment(ref);
                    refMoment.month(month - 1);
                    refMoment.date(day);
                    refMoment.year(moment(ref).year());

                    var nextYear = refMoment.clone().add(1, 'y');
                    var lastYear = refMoment.clone().add(-1, 'y');
                    if (Math.abs(nextYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = nextYear;
                    } else if (Math.abs(lastYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = lastYear;
                    }

                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.imply('year', refMoment.year());
                }

                // Weekday component
                if (match[WEEKDAY_GROUP]) {
                    var weekday = match[WEEKDAY_GROUP];
                    weekday = util.WEEKDAY_OFFSET[weekday.toLowerCase()];
                    result.start.assign('weekday', weekday);
                }

                // Text can be 'range' value. Such as '12 - 13 January 2012'
                if (match[DATE_TO_GROUP]) {
                    result.end = result.start.clone();
                    result.end.assign('day', parseInt(match[DATE_TO_GROUP]));
                }

                result.tags['DEMonthNameLittleEndianParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/DE": 65, "../parser": 49, "moment": 72 }], 7: [function (require, module, exports) {
        /*
            
            The parser for parsing month name and year.
            
            EX. 
                - Januar
                - Januar 2012
        */

        var moment = require('moment');

        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/DE');

        var PATTERN = new RegExp('(^|\\D\\s+|[^\\w\\s])' + '(Jan\\.?|Januar|Feb\\.?|Februar|Mär\\.?|M(?:ä|ae)rz|Mrz\\.?|Apr\\.?|April|Mai\\.?|Jun\\.?|Juni|Jul\\.?|Juli|Aug\\.?|August|Sep\\.?|Sept\\.?|September|Okt\\.?|Oktober|Nov\\.?|November|Dez\\.?|Dezember)' + '\\s*' + '(?:' + ',?\\s*(?:([0-9]{4})(\\s*[vn]\\.?\\s*C(?:hr)?\\.?)?|([0-9]{1,4})\\s*([vn]\\.?\\s*C(?:hr)?\\.?))' + ')?' + '(?=[^\\s\\w]|$)', 'i');

        var MONTH_NAME_GROUP = 2;
        var YEAR_GROUP = 3;
        var YEAR_BE_GROUP = 4;
        var YEAR_GROUP2 = 5;
        var YEAR_BE_GROUP2 = 6;

        exports.Parser = function ENMonthNameParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var result = new ParsedResult({
                    text: match[0].substr(match[1].length, match[0].length - match[1].length),
                    index: match.index + match[1].length,
                    ref: ref
                });

                var month = match[MONTH_NAME_GROUP];
                month = util.MONTH_OFFSET[month.toLowerCase()];

                var day = 1;

                var year = null;
                if (match[YEAR_GROUP] || match[YEAR_GROUP2]) {
                    year = match[YEAR_GROUP] || match[YEAR_GROUP2];
                    year = parseInt(year);

                    if (match[YEAR_BE_GROUP] || match[YEAR_BE_GROUP2]) {
                        if (/v/i.test(match[YEAR_BE_GROUP] || match[YEAR_BE_GROUP2])) {
                            // v.Chr.
                            year = -year;
                        }
                    } else if (year < 100) {

                        year = year + 2000;
                    }
                }

                if (year) {
                    result.start.imply('day', day);
                    result.start.assign('month', month);
                    result.start.assign('year', year);
                } else {

                    //Find the most appropriated year
                    var refMoment = moment(ref);
                    refMoment.month(month - 1);
                    refMoment.date(day);

                    var nextYear = refMoment.clone().add(1, 'y');
                    var lastYear = refMoment.clone().add(-1, 'y');
                    if (Math.abs(nextYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = nextYear;
                    } else if (Math.abs(lastYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = lastYear;
                    }

                    result.start.imply('day', day);
                    result.start.assign('month', month);
                    result.start.imply('year', refMoment.year());
                }

                result.tags['DEMonthNameParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/DE": 65, "../parser": 49, "moment": 72 }], 8: [function (require, module, exports) {
        /*
            Date format with slash "/" (also "-" and ".") between numbers
            - Tuesday 11/3/2015
            - 11/3/2015
            - 11/3
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = new RegExp('(\\W|^)' + '(?:' + '(?:am\\s*?)?' + '((?:sonntag|so|montag|mo|dienstag|di|mittwoch|mi|donnerstag|do|freitag|fr|samstag|sa))' + '\\s*\\,?\\s*' + '(?:den\\s*)?' + ')?' + '([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})' + '(?:' + '[\\/\\.\\-]' + '([0-9]{4}\s*\,?\s*|[0-9]{2}\s*\,?\s*)' + ')?' + '(\\W|$)', 'i');

        var DAYS_OFFSET = {
            'sonntag': 0, 'so': 0,
            'montag': 1, 'mo': 1,
            'dienstag': 2, 'di': 2,
            'mittwoch': 3, 'mi': 3,
            'donnerstag': 4, 'do': 4,
            'freitag': 5, 'fr': 5,
            'samstag': 6, 'sa': 6
        };

        var OPENNING_GROUP = 1;
        var ENDING_GROUP = 6;

        var WEEKDAY_GROUP = 2;
        var DAY_GROUP = 3;
        var MONTH_GROUP = 4;
        var YEAR_GROUP = 5;

        exports.Parser = function DESlashDateFormatParser(argument) {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };
            this.extract = function (text, ref, match, opt) {

                if (match[OPENNING_GROUP] == '/' || match[ENDING_GROUP] == '/') {
                    // Long skip, if there is some overlapping like:
                    // XX[/YY/ZZ]
                    // [XX/YY/]ZZ
                    match.index += match[0].length;
                    return;
                }

                var index = match.index + match[OPENNING_GROUP].length;
                var text = match[0].substr(match[OPENNING_GROUP].length, match[0].length - match[ENDING_GROUP].length);

                var result = new ParsedResult({
                    text: text,
                    index: index,
                    ref: ref
                });

                if (text.match(/^\d\.\d$/)) return;
                if (text.match(/^\d\.\d{1,2}\.\d{1,2}$/)) return;

                // MM/dd -> OK
                // MM.dd -> NG
                if (!match[YEAR_GROUP] && match[0].indexOf('/') < 0) return;

                var date = null;
                var year = match[YEAR_GROUP] || moment(ref).year() + '';
                var month = match[MONTH_GROUP];
                var day = match[DAY_GROUP];

                month = parseInt(month);
                day = parseInt(day);
                year = parseInt(year);

                if (month < 1 || month > 12) return null;
                if (day < 1 || day > 31) return null;

                if (year < 100) {
                    if (year > 50) {
                        year = year + 1900;
                    } else {
                        year = year + 2000;
                    }
                }

                result.start.assign('day', day);
                result.start.assign('month', month);
                result.start.assign('year', year);

                //Day of week
                if (match[WEEKDAY_GROUP]) {
                    result.start.assign('weekday', DAYS_OFFSET[match[WEEKDAY_GROUP].toLowerCase()]);
                }

                result.tags['DESlashDateFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 9: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/DE');

        var PATTERN = new RegExp('' + '(\\W|^)vor\\s*' + '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|einigen|eine[rm]\\s*halben|eine[rm])\\s*' + '(sekunden?|min(?:ute)?n?|stunden?|wochen?|tag(?:en)?|monat(?:en)?|jahr(?:en)?)\\s*' + '(?=(?:\\W|$))', 'i');

        var STRICT_PATTERN = new RegExp('' + '(\\W|^)vor\\s*' + '([0-9]+|eine(?:r|m))\\s*' + '(sekunden?|minuten?|stunden?|tag(?:en)?)' + '(?=(?:\\W|$))', 'i');

        exports.Parser = function DETimeAgoFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return this.isStrictMode() ? STRICT_PATTERN : PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                if (match.index > 0 && text[match.index - 1].match(/\w/)) return null;

                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);
                index = match.index + match[1].length;

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var num = match[2].toLowerCase();
                if (util.INTEGER_WORDS[num] !== undefined) {
                    num = util.INTEGER_WORDS[num];
                } else if (num === 'einer' || num === 'einem') {
                    num = 1;
                } else if (num === 'einigen') {
                    num = 3;
                } else if (/halben/.test(num)) {
                    num = 0.5;
                } else {
                    num = parseInt(num);
                }

                var date = moment(ref);

                if (/stunde|min|sekunde/i.test(match[3])) {
                    if (/stunde/i.test(match[3])) {

                        date.add(-num, 'hour');
                    } else if (/min/i.test(match[3])) {

                        date.add(-num, 'minute');
                    } else if (/sekunde/i.test(match[3])) {

                        date.add(-num, 'second');
                    }

                    result.start.imply('day', date.date());
                    result.start.imply('month', date.month() + 1);
                    result.start.imply('year', date.year());
                    result.start.assign('hour', date.hour());
                    result.start.assign('minute', date.minute());
                    result.start.assign('second', date.second());
                    result.tags['DETimeAgoFormatParser'] = true;
                    return result;
                }

                if (/woche/i.test(match[3])) {
                    date.add(-num, 'week');

                    result.start.imply('day', date.date());
                    result.start.imply('month', date.month() + 1);
                    result.start.imply('year', date.year());
                    result.start.imply('weekday', date.day());
                    return result;
                }

                if (/tag/i.test(match[3])) {
                    date.add(-num, 'd');
                }

                if (/monat/i.test(match[3])) {
                    date.add(-num, 'month');
                }

                if (/jahr/i.test(match[3])) {

                    date.add(-num, 'year');
                }

                result.start.assign('day', date.date());
                result.start.assign('month', date.month() + 1);
                result.start.assign('year', date.year());
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/DE": 65, "../parser": 49, "moment": 72 }], 10: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var ParsedComponents = require('../../result').ParsedComponents;

        var FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" + "(?:(?:um|von)\\s*)?" + "(\\d{1,4}|mittags?|mitternachts?)" + "(?:" + "(?:\\.|\\:|\\：)(\\d{1,2})" + "(?:" + "(?:\\:|\\：)(\\d{2})" + ")?" + ")?" + "(?:\\s*uhr)?" + "(?:\\s*(morgens|vormittags|mittags|nachmittags|abends|nachts))?" + "(?=\\W|$)", 'i');

        var SECOND_REG_PATTERN = new RegExp("^\\s*" + "(\\-|\\–|\\~|\\〜|bis|\\?)\\s*" + "(\\d{1,4})" + "(?:" + "(?:\\.|\\:|\\：)(\\d{1,2})" + "(?:" + "(?:\\.|\\:|\\：)(\\d{1,2})" + ")?" + ")?" + "(?:\\s*(morgens|vormittags|mittags|nachmittags|abends|nachts))?" + "(?=\\W|$)", 'i');

        var HOUR_GROUP = 2;
        var MINUTE_GROUP = 3;
        var SECOND_GROUP = 4;
        var AM_PM_HOUR_GROUP = 5;

        exports.Parser = function DETimeExpressionParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return FIRST_REG_PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                // This pattern can be overlaped Ex. [12] AM, 1[2] AM
                if (match.index > 0 && text[match.index - 1].match(/\w/)) return null;
                var refMoment = moment(ref);
                var result = new ParsedResult();
                result.ref = ref;
                result.index = match.index + match[1].length;
                result.text = match[0].substring(match[1].length);
                result.tags['DETimeExpressionParser'] = true;

                result.start.imply('day', refMoment.date());
                result.start.imply('month', refMoment.month() + 1);
                result.start.imply('year', refMoment.year());

                var hour = 0;
                var minute = 0;
                var meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP] != null) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (second >= 60) return null;

                    result.start.assign('second', second);
                }

                // ----- Hours
                if (/mittags?/i.test(match[HOUR_GROUP])) {
                    meridiem = 1;
                    hour = 12;
                } else if (/mitternachts?/i.test(match[HOUR_GROUP])) {
                    meridiem = 0;
                    hour = 0;
                } else {
                    hour = parseInt(match[HOUR_GROUP]);
                }

                // ----- Minutes
                if (match[MINUTE_GROUP] != null) {
                    minute = parseInt(match[MINUTE_GROUP]);
                } else if (hour > 100) {
                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM  
                if (match[AM_PM_HOUR_GROUP] != null) {
                    if (hour > 12) return null;
                    var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                    if (ampm === 'morgens' || ampm === 'vormittags') {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    } else {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                }

                result.start.assign('hour', hour);
                result.start.assign('minute', minute);

                if (meridiem >= 0) {
                    result.start.assign('meridiem', meridiem);
                } else {
                    if (hour < 12) {
                        result.start.imply('meridiem', 0);
                    } else {
                        result.start.imply('meridiem', 1);
                    }
                }

                // ==============================================================
                //                  Extracting the 'to' chunk
                // ==============================================================
                match = SECOND_REG_PATTERN.exec(text.substring(result.index + result.text.length));
                if (!match) {
                    // Not accept number only result
                    if (result.text.match(/^\d+$/)) {
                        return null;
                    }
                    return result;
                }

                // Pattern "YY.YY -XXXX" is more like timezone offset
                if (match[0].match(/^\s*(\+|\-)\s*\d{3,4}$/)) {
                    return result;
                }

                if (result.end == null) {
                    result.end = new ParsedComponents(null, result.start.date());
                }

                var hour = 0;
                var minute = 0;
                var meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP] != null) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (second >= 60) return null;

                    result.end.assign('second', second);
                }

                hour = parseInt(match[2]);

                // ----- Minute
                if (match[MINUTE_GROUP] != null) {

                    minute = parseInt(match[MINUTE_GROUP]);
                    if (minute >= 60) return result;
                } else if (hour > 100) {

                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM 
                if (match[AM_PM_HOUR_GROUP] != null) {

                    if (hour > 12) return null;

                    var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                    if (ampm === 'morgens' || ampm === 'vormittags') {
                        meridiem = 0;
                        if (hour == 12) {
                            hour = 0;
                            if (!result.end.isCertain('day')) {
                                result.end.imply('day', result.end.get('day') + 1);
                            }
                        }
                    } else {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }

                    if (!result.start.isCertain('meridiem')) {
                        if (meridiem == 0) {

                            result.start.imply('meridiem', 0);

                            if (result.start.get('hour') == 12) {
                                result.start.assign('hour', 0);
                            }
                        } else {

                            result.start.imply('meridiem', 1);

                            if (result.start.get('hour') != 12) {
                                result.start.assign('hour', result.start.get('hour') + 12);
                            }
                        }
                    }
                }

                result.text = result.text + match[0];
                result.end.assign('hour', hour);
                result.end.assign('minute', minute);
                if (meridiem >= 0) {
                    result.end.assign('meridiem', meridiem);
                } else {
                    var startAtPM = result.start.isCertain('meridiem') && result.start.get('meridiem') == 1;
                    if (startAtPM && result.start.get('hour') > hour) {
                        // 10pm - 1 (am)
                        result.end.imply('meridiem', 0);
                    } else if (hour > 12) {
                        result.end.imply('meridiem', 1);
                    }
                }

                if (result.end.date().getTime() < result.start.date().getTime()) {
                    result.end.imply('day', result.end.get('day') + 1);
                }

                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 11: [function (require, module, exports) {
        /*
        
        
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var DAYS_OFFSET = {
            'sonntag': 0, 'so': 0,
            'montag': 1, 'mo': 1,
            'dienstag': 2, 'di': 2,
            'mittwoch': 3, 'mi': 3,
            'donnerstag': 4, 'do': 4,
            'freitag': 5, 'fr': 5,
            'samstag': 6, 'sa': 6
        };

        var PATTERN = new RegExp('(\\W|^)' + '(?:(?:\\,|\\(|\\（)\\s*)?' + '(?:a[mn]\\s*?)?' + '(?:(diese[mn]|letzte[mn]|n(?:ä|ae)chste[mn])\\s*)?' + '(' + Object.keys(DAYS_OFFSET).join('|') + ')' + '(?:\\s*(?:\\,|\\)|\\）))?' + '(?:\\s*(diese|letzte|n(?:ä|ae)chste)\\s*woche)?' + '(?=\\W|$)', 'i');

        var PREFIX_GROUP = 2;
        var WEEKDAY_GROUP = 3;
        var POSTFIX_GROUP = 4;

        exports.Parser = function DEWeekdayParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var index = match.index + match[1].length;
                var text = match[0].substr(match[1].length, match[0].length - match[1].length);
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                var offset = DAYS_OFFSET[dayOfWeek];
                if (offset === undefined) return null;

                var startMoment = moment(ref);
                var prefix = match[PREFIX_GROUP];
                var postfix = match[POSTFIX_GROUP];

                var refOffset = startMoment.day();
                var norm = prefix || postfix;
                norm = norm || '';
                norm = norm.toLowerCase();
                if (/letzte/.test(norm)) {
                    startMoment.day(offset - 7);
                } else if (/n(?:ä|ae)chste/.test(norm)) {
                    startMoment.day(offset + 7);
                } else if (/diese/.test(norm)) {
                    if (opt.forwardDatesOnly && refOffset > offset) {
                        startMoment.day(offset + 7);
                    } else {
                        startMoment.day(offset);
                    }
                } else {
                    if (opt.forwardDatesOnly && refOffset > offset) {
                        startMoment.day(offset + 7);
                    } else if (!opt.forwardDatesOnly && Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                        startMoment.day(offset - 7);
                    } else if (!opt.forwardDatesOnly && Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                        startMoment.day(offset + 7);
                    } else {
                        startMoment.day(offset);
                    }
                }

                result.start.assign('weekday', offset);
                result.start.imply('day', startMoment.date());
                result.start.imply('month', startMoment.month() + 1);
                result.start.imply('year', startMoment.year());
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 12: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = /(\W|^)(now|today|tonight|last\s*night|(?:tomorrow|tmr|yesterday)\s*|tomorrow|tmr|yesterday)(?=\W|$)/i;

        exports.Parser = function ENCasualDateParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var text = match[0].substr(match[1].length);
                var index = match.index + match[1].length;
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var refMoment = moment(ref);
                var startMoment = refMoment.clone();
                var lowerText = text.toLowerCase();

                if (lowerText == 'tonight') {
                    // Normally means this coming midnight
                    result.start.imply('hour', 22);
                    result.start.imply('meridiem', 1);
                } else if (/^tomorrow|^tmr/.test(lowerText)) {

                    // Check not "Tomorrow" on late night
                    if (refMoment.hour() > 1) {
                        startMoment.add(1, 'day');
                    }
                } else if (/^yesterday/.test(lowerText)) {

                    startMoment.add(-1, 'day');
                } else if (lowerText.match(/last\s*night/)) {

                    result.start.imply('hour', 0);
                    if (refMoment.hour() > 6) {
                        startMoment.add(-1, 'day');
                    }
                } else if (lowerText.match("now")) {

                    result.start.assign('hour', refMoment.hour());
                    result.start.assign('minute', refMoment.minute());
                    result.start.assign('second', refMoment.second());
                    result.start.assign('millisecond', refMoment.millisecond());
                }

                result.start.assign('day', startMoment.date());
                result.start.assign('month', startMoment.month() + 1);
                result.start.assign('year', startMoment.year());
                result.tags['ENCasualDateParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 13: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = /(\W|^)((this)?\s*(morning|afternoon|evening|noon))/i;

        var TIME_MATCH = 4;

        exports.Parser = function ENCasualTimeParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var text = match[0].substr(match[1].length);
                var index = match.index + match[1].length;
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                if (!match[TIME_MATCH]) TIME_MATCH = 3;

                if (match[TIME_MATCH] == "afternoon") {

                    result.start.imply('hour', opt['afternoon'] ? opt['afternoon'] : 15);
                } else if (match[TIME_MATCH] == "evening") {

                    result.start.imply('hour', opt['evening'] ? opt['evening'] : 18);
                } else if (match[TIME_MATCH] == "morning") {

                    result.start.imply('hour', opt['morning'] ? opt['morning'] : 6);
                } else if (match[TIME_MATCH] == "noon") {

                    result.start.imply('hour', opt['noon'] ? opt['noon'] : 12);
                }

                result.tags['ENCasualTimeParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 14: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/EN');

        var PATTERN = new RegExp('(\\W|^)' + '(within|in)\\s*' + '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|an?(?:\\s*few)?|half(?:\\s*an?)?)\\s*' + '(seconds?|min(?:ute)?s?|hours?|days?|weeks?|months?|years?)\\s*' + '(?=\\W|$)', 'i');

        var STRICT_PATTERN = new RegExp('(\\W|^)' + '(within|in)\\s*' + '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|an?)\\s*' + '(seconds?|minutes?|hours?|days?)\\s*' + '(?=\\W|$)', 'i');

        exports.Parser = function ENDeadlineFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return this.isStrictMode() ? STRICT_PATTERN : PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var index = match.index + match[1].length;
                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var num = match[3].toLowerCase();
                if (util.INTEGER_WORDS[num] !== undefined) {
                    num = util.INTEGER_WORDS[num];
                } else if (num === 'a' || num === 'an') {
                    num = 1;
                } else if (num.match(/few/i)) {
                    num = 3;
                } else if (num.match(/half/i)) {
                    num = 0.5;
                } else {
                    num = parseInt(num);
                }

                var date = moment(ref);
                if (match[4].match(/day|week|month|year/i)) {

                    if (match[4].match(/day/i)) {
                        date.add(num, 'd');
                    } else if (match[4].match(/week/i)) {
                        date.add(num * 7, 'd');
                    } else if (match[4].match(/month/i)) {
                        date.add(num, 'month');
                    } else if (match[4].match(/year/i)) {
                        date.add(num, 'year');
                    }

                    result.start.assign('year', date.year());
                    result.start.assign('month', date.month() + 1);
                    result.start.assign('day', date.date());
                    return result;
                }

                if (match[4].match(/hour/i)) {

                    date.add(num, 'hour');
                } else if (match[4].match(/min/i)) {

                    date.add(num, 'minute');
                } else if (match[4].match(/second/i)) {

                    date.add(num, 'second');
                }

                result.start.imply('year', date.year());
                result.start.imply('month', date.month() + 1);
                result.start.imply('day', date.date());
                result.start.assign('hour', date.hour());
                result.start.assign('minute', date.minute());
                result.start.assign('second', date.second());
                result.tags['ENDeadlineFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/EN": 66, "../parser": 49, "moment": 72 }], 15: [function (require, module, exports) {
        /*
            ISO 8601
            http://www.w3.org/TR/NOTE-datetime
            - YYYY-MM-DD
            - YYYY-MM-DDThh:mmTZD
            - YYYY-MM-DDThh:mm:ssTZD
            - YYYY-MM-DDThh:mm:ss.sTZD 
            - TZD = (Z or +hh:mm or -hh:mm)
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = new RegExp('(\\W|^)' + '([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})' + '(?:T' //..
        + '([0-9]{1,2}):([0-9]{1,2})' // hh:mm
        + '(?::([0-9]{1,2})(?:\\.(\\d{1,4}))?)?' // :ss.s
        + '(?:Z|([+-]\\d{2}):?(\\d{2})?)?' // TZD (Z or ±hh:mm or ±hhmm or ±hh)
        + ')?' //..
        + '(?=\\W|$)', 'i');

        var YEAR_NUMBER_GROUP = 2;
        var MONTH_NUMBER_GROUP = 3;
        var DATE_NUMBER_GROUP = 4;
        var HOUR_NUMBER_GROUP = 5;
        var MINUTE_NUMBER_GROUP = 6;
        var SECOND_NUMBER_GROUP = 7;
        var MILLISECOND_NUMBER_GROUP = 8;
        var TZD_HOUR_OFFSET_GROUP = 9;
        var TZD_MINUTE_OFFSET_GROUP = 10;

        exports.Parser = function ENISOFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var text = match[0].substr(match[1].length);
                var index = match.index + match[1].length;

                var result = new ParsedResult({
                    text: text,
                    index: index,
                    ref: ref
                });

                result.start.assign('year', parseInt(match[YEAR_NUMBER_GROUP]));
                result.start.assign('month', parseInt(match[MONTH_NUMBER_GROUP]));
                result.start.assign('day', parseInt(match[DATE_NUMBER_GROUP]));

                if (moment(result.start.get('month')) > 12 || moment(result.start.get('month')) < 1 || moment(result.start.get('day')) > 31 || moment(result.start.get('day')) < 1) {
                    return null;
                }

                if (match[HOUR_NUMBER_GROUP] != null) {

                    result.start.assign('hour', parseInt(match[HOUR_NUMBER_GROUP]));
                    result.start.assign('minute', parseInt(match[MINUTE_NUMBER_GROUP]));

                    if (match[SECOND_NUMBER_GROUP] != null) {

                        result.start.assign('second', parseInt(match[SECOND_NUMBER_GROUP]));
                    }

                    if (match[MILLISECOND_NUMBER_GROUP] != null) {

                        result.start.assign('millisecond', parseInt(match[MILLISECOND_NUMBER_GROUP]));
                    }

                    if (match[TZD_HOUR_OFFSET_GROUP] == null) {

                        result.start.assign('timezoneOffset', 0);
                    } else {

                        var minuteOffset = 0;
                        var hourOffset = parseInt(match[TZD_HOUR_OFFSET_GROUP]);
                        if (match[TZD_MINUTE_OFFSET_GROUP] != null) minuteOffset = parseInt(match[TZD_MINUTE_OFFSET_GROUP]);

                        var offset = hourOffset * 60;
                        if (offset < 0) {
                            offset -= minuteOffset;
                        } else {
                            offset += minuteOffset;
                        }

                        result.start.assign('timezoneOffset', offset);
                    }
                }

                result.tags['ENISOFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 16: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');

        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/EN');

        var PATTERN = new RegExp('(\\W|^)' + '(?:on\\s*?)?' + '(?:(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sun|Mon|Tue|Wed|Thu|Fri|Sat)\\s*,?\\s*)?' + '(([0-9]{1,2})(?:st|nd|rd|th)?|' + util.ORDINAL_WORDS_PATTERN + ')' + '(?:\\s*' + '(?:to|\\-|\\–|until|through|till|\\s)\\s*' + '(([0-9]{1,2})(?:st|nd|rd|th)?|' + util.ORDINAL_WORDS_PATTERN + ')' + ')?' + '(?:-|\/|\\s*(?:of)?\\s*)' + '(Jan(?:uary|\\.)?|Feb(?:ruary|\\.)?|Mar(?:ch|\\.)?|Apr(?:il|\\.)?|May|Jun(?:e|\\.)?|Jul(?:y|\\.)?|Aug(?:ust|\\.)?|Sep(?:tember|\\.)?|Oct(?:ober|\\.)?|Nov(?:ember|\\.)?|Dec(?:ember|\\.)?)' + '(?:' + '(?:-|\/|,?\\s*)' + '([0-9]{1,4}(?![^\\s]\\d))' + '(\\s*(?:BE|AD|BC))?' + ')?' + '(?=\\W|$)', 'i');

        var WEEKDAY_GROUP = 2;
        var DATE_GROUP = 3;
        var DATE_NUM_GROUP = 4;
        var DATE_TO_GROUP = 5;
        var DATE_TO_NUM_GROUP = 6;
        var MONTH_NAME_GROUP = 7;
        var YEAR_GROUP = 8;
        var YEAR_BE_GROUP = 9;

        exports.Parser = function ENMonthNameLittleEndianParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var result = new ParsedResult({
                    text: match[0].substr(match[1].length, match[0].length - match[1].length),
                    index: match.index + match[1].length,
                    ref: ref
                });

                var month = match[MONTH_NAME_GROUP];
                month = util.MONTH_OFFSET[month.toLowerCase()];

                var day = match[DATE_NUM_GROUP] ? parseInt(match[DATE_NUM_GROUP]) : util.ORDINAL_WORDS[match[DATE_GROUP].trim().replace('-', ' ').toLowerCase()];

                var year = null;
                if (match[YEAR_GROUP]) {
                    year = match[YEAR_GROUP];
                    year = parseInt(year);

                    if (match[YEAR_BE_GROUP]) {

                        if (/BE/i.test(match[YEAR_BE_GROUP])) {
                            // Buddhist Era
                            year = year - 543;
                        } else if (/BC/i.test(match[YEAR_BE_GROUP])) {
                            // Before Christ
                            year = -year;
                        }
                    } else if (year < 10) {

                        // require single digit years to always have BC/AD
                        return null;
                    } else if (year < 100) {

                        year = year + 2000;
                    }
                }

                if (year) {
                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.assign('year', year);
                } else {

                    //Find the most appropriated year
                    var refMoment = moment(ref);
                    refMoment.month(month - 1);
                    refMoment.date(day);
                    refMoment.year(moment(ref).year());

                    var nextYear = refMoment.clone().add(1, 'y');
                    var lastYear = refMoment.clone().add(-1, 'y');
                    if (Math.abs(nextYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = nextYear;
                    } else if (Math.abs(lastYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = lastYear;
                    }

                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.imply('year', refMoment.year());
                }

                // Weekday component
                if (match[WEEKDAY_GROUP]) {
                    var weekday = match[WEEKDAY_GROUP];
                    weekday = util.WEEKDAY_OFFSET[weekday.toLowerCase()];
                    result.start.assign('weekday', weekday);
                }

                // Text can be 'range' value. Such as '12 - 13 January 2012'
                if (match[DATE_TO_GROUP]) {
                    var endDate = match[DATE_TO_NUM_GROUP] ? parseInt(match[DATE_TO_NUM_GROUP]) : util.ORDINAL_WORDS[match[DATE_TO_GROUP].trim().replace('-', ' ').toLowerCase()];

                    result.end = result.start.clone();
                    result.end.assign('day', endDate);
                }

                result.tags['ENMonthNameLittleEndianParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/EN": 66, "../parser": 49, "moment": 72 }], 17: [function (require, module, exports) {
        /*
        
            The parser for parsing US's date format that begin with month's name.
        
            EX.
                - January 13
                - January 13, 2012
                - January 13 - 15, 2012
                - Tuesday, January 13, 2012
        
            Watch out for:
                - January 12:00
                - January 12.44
                - January 1222344
        */

        var moment = require('moment');

        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/EN');

        var PATTERN = new RegExp('(\\W|^)' + '(?:' + '(?:on\\s*?)?' + '(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sun\\.?|Mon\\.?|Tue\\.?|Wed\\.?|Thu\\.?|Fri\\.?|Sat\\.?)' + '\\s*,?\\s*)?' + '(Jan\\.?|January|Feb\\.?|February|Mar\\.?|March|Apr\\.?|April|May\\.?|Jun\\.?|June|Jul\\.?|July|Aug\\.?|August|Sep\\.?|Sept\\.?|September|Oct\\.?|October|Nov\\.?|November|Dec\\.?|December)' + '(?:-|\/|\\s*,?\\s*)' + '(([0-9]{1,2})(?:st|nd|rd|th)?|' + util.ORDINAL_WORDS_PATTERN + ')\\s*' + '(?:' + '(?:to|\\-)\\s*' + '(([0-9]{1,2})(?:st|nd|rd|th)?| ' + util.ORDINAL_WORDS_PATTERN + ')\\s*' + ')?' + '(?:' + '(?:-|\/|\\s*,?\\s*)' + '(?:([0-9]{4})\\s*(BE|AD|BC)?|([0-9]{1,4})\\s*(AD|BC))\\s*' + ')?' + '(?=\\W|$)(?!\\:\\d)', 'i');

        var WEEKDAY_GROUP = 2;
        var MONTH_NAME_GROUP = 3;
        var DATE_GROUP = 4;
        var DATE_NUM_GROUP = 5;
        var DATE_TO_GROUP = 6;
        var DATE_TO_NUM_GROUP = 7;
        var YEAR_GROUP = 8;
        var YEAR_BE_GROUP = 9;
        var YEAR_GROUP2 = 10;
        var YEAR_BE_GROUP2 = 11;

        exports.Parser = function ENMonthNameMiddleEndianParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var result = new ParsedResult({
                    text: match[0].substr(match[1].length, match[0].length - match[1].length),
                    index: match.index + match[1].length,
                    ref: ref
                });

                var month = match[MONTH_NAME_GROUP];
                month = util.MONTH_OFFSET[month.toLowerCase()];
                var day = match[DATE_NUM_GROUP] ? parseInt(match[DATE_NUM_GROUP]) : util.ORDINAL_WORDS[match[DATE_GROUP].trim().replace('-', ' ').toLowerCase()];

                var year = null;
                if (match[YEAR_GROUP] || match[YEAR_GROUP2]) {
                    year = match[YEAR_GROUP] || match[YEAR_GROUP2];
                    year = parseInt(year);

                    var yearBE = match[YEAR_BE_GROUP] || match[YEAR_BE_GROUP2];
                    if (yearBE) {
                        if (/BE/i.test(yearBE)) {
                            // Buddhist Era
                            year = year - 543;
                        } else if (/BC/i.test(yearBE)) {
                            // Before Christ
                            year = -year;
                        }
                    } else if (year < 100) {

                        year = year + 2000;
                    }
                }

                if (year) {
                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.assign('year', year);
                } else {

                    //Find the most appropriated year
                    var refMoment = moment(ref);
                    refMoment.month(month - 1);
                    refMoment.date(day);

                    var nextYear = refMoment.clone().add(1, 'y');
                    var lastYear = refMoment.clone().add(-1, 'y');
                    if (Math.abs(nextYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = nextYear;
                    } else if (Math.abs(lastYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = lastYear;
                    }

                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.imply('year', refMoment.year());
                }

                // Weekday component
                if (match[WEEKDAY_GROUP]) {
                    var weekday = match[WEEKDAY_GROUP];
                    weekday = util.WEEKDAY_OFFSET[weekday.toLowerCase()];
                    result.start.assign('weekday', weekday);
                }

                // Text can be 'range' value. Such as 'January 12 - 13, 2012'
                if (match[DATE_TO_GROUP]) {
                    var endDate = match[DATE_TO_NUM_GROUP] ? endDate = parseInt(match[DATE_TO_NUM_GROUP]) : util.ORDINAL_WORDS[match[DATE_TO_GROUP].replace('-', ' ').trim().toLowerCase()];

                    result.end = result.start.clone();
                    result.end.assign('day', endDate);
                }

                result.tags['ENMonthNameMiddleEndianParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/EN": 66, "../parser": 49, "moment": 72 }], 18: [function (require, module, exports) {
        /*
            
            The parser for parsing month name and year.
            
            EX. 
                - January
                - January 2012
                - January, 2012
        */

        var moment = require('moment');

        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/EN');

        var PATTERN = new RegExp('(^|\\D\\s+|[^\\w\\s])' + '(Jan\\.?|January|Feb\\.?|February|Mar\\.?|March|Apr\\.?|April|May\\.?|Jun\\.?|June|Jul\\.?|July|Aug\\.?|August|Sep\\.?|Sept\\.?|September|Oct\\.?|October|Nov\\.?|November|Dec\\.?|December)' + '\\s*' + '(?:' + '[,-]?\\s*([0-9]{4})(\\s*BE|AD|BC)?' + ')?' + '(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)', 'i');

        var MONTH_NAME_GROUP = 2;
        var YEAR_GROUP = 3;
        var YEAR_BE_GROUP = 4;

        exports.Parser = function ENMonthNameParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var result = new ParsedResult({
                    text: match[0].substr(match[1].length, match[0].length - match[1].length),
                    index: match.index + match[1].length,
                    ref: ref
                });

                var month = match[MONTH_NAME_GROUP];
                month = util.MONTH_OFFSET[month.toLowerCase()];

                var day = 1;

                var year = null;
                if (match[YEAR_GROUP]) {
                    year = match[YEAR_GROUP];
                    year = parseInt(year);

                    if (match[YEAR_BE_GROUP]) {
                        if (match[YEAR_BE_GROUP].match(/BE/)) {
                            // Buddhist Era
                            year = year - 543;
                        } else if (match[YEAR_BE_GROUP].match(/BC/)) {
                            // Before Christ
                            year = -year;
                        }
                    } else if (year < 100) {

                        year = year + 2000;
                    }
                }

                if (year) {
                    result.start.imply('day', day);
                    result.start.assign('month', month);
                    result.start.assign('year', year);
                } else {

                    //Find the most appropriated year
                    var refMoment = moment(ref);
                    refMoment.month(month - 1);
                    refMoment.date(day);

                    var nextYear = refMoment.clone().add(1, 'y');
                    var lastYear = refMoment.clone().add(-1, 'y');
                    if (Math.abs(nextYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = nextYear;
                    } else if (Math.abs(lastYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = lastYear;
                    }

                    result.start.imply('day', day);
                    result.start.assign('month', month);
                    result.start.imply('year', refMoment.year());
                }

                result.tags['ENMonthNameParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/EN": 66, "../parser": 49, "moment": 72 }], 19: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/EN');

        var PATTERN = new RegExp('(\\W|^)' + '(next|last|past)\\s*' + '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|few|half(?:\\s*an?)?)?\\s*' + '(seconds?|min(?:ute)?s?|hours?|days?|weeks?|months?|years?)(?=\\s*)' + '(?=\\W|$)', 'i');

        var MODIFIER_WORD_GROUP = 2;
        var MULTIPLIER_WORD_GROUP = 3;
        var RELATIVE_WORD_GROUP = 4;

        exports.Parser = function ENRelativeDateFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var index = match.index + match[1].length;
                var modifier = match[MODIFIER_WORD_GROUP].toLowerCase().match(/^next/) ? 1 : -1;
                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });
                result.tags['ENRelativeDateFormatParser'] = true;

                var num = match[MULTIPLIER_WORD_GROUP] === undefined ? '' : match[3].toLowerCase();
                if (util.INTEGER_WORDS[num] !== undefined) {
                    num = util.INTEGER_WORDS[num];
                } else if (num === '') {
                    num = 1;
                } else if (num.match(/few/i)) {
                    num = 3;
                } else if (num.match(/half/i)) {
                    num = 0.5;
                } else {
                    num = parseInt(num);
                }

                num *= modifier;

                var date = moment(ref);
                if (match[RELATIVE_WORD_GROUP].match(/day|week|month|year/i)) {

                    if (match[RELATIVE_WORD_GROUP].match(/day/i)) {
                        date.add(num, 'd');
                        result.start.assign('year', date.year());
                        result.start.assign('month', date.month() + 1);
                        result.start.assign('day', date.date());
                    } else if (match[RELATIVE_WORD_GROUP].match(/week/i)) {
                        date.add(num * 7, 'd');
                        // We don't know the exact date for next/last week so we imply
                        // them
                        result.start.imply('day', date.date());
                        result.start.imply('month', date.month() + 1);
                        result.start.imply('year', date.year());
                    } else if (match[RELATIVE_WORD_GROUP].match(/month/i)) {
                        date.add(num, 'month');
                        // We don't know the exact day for next/last month
                        result.start.imply('day', date.date());
                        result.start.assign('year', date.year());
                        result.start.assign('month', date.month() + 1);
                    } else if (match[RELATIVE_WORD_GROUP].match(/year/i)) {
                        date.add(num, 'year');
                        // We don't know the exact day for month on next/last year
                        result.start.imply('day', date.date());
                        result.start.imply('month', date.month() + 1);
                        result.start.assign('year', date.year());
                    }

                    return result;
                }

                if (match[RELATIVE_WORD_GROUP].match(/hour/i)) {

                    date.add(num, 'hour');
                    result.start.imply('minute', date.minute());
                    result.start.imply('second', date.second());
                } else if (match[RELATIVE_WORD_GROUP].match(/min/i)) {

                    date.add(num, 'minute');
                    result.start.assign('minute', date.minute());
                    result.start.imply('second', date.second());
                } else if (match[RELATIVE_WORD_GROUP].match(/second/i)) {

                    date.add(num, 'second');
                    result.start.assign('second', date.second());
                    result.start.assign('minute', date.minute());
                }

                result.start.assign('hour', date.hour());
                result.start.assign('year', date.year());
                result.start.assign('month', date.month() + 1);
                result.start.assign('day', date.date());
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/EN": 66, "../parser": 49, "moment": 72 }], 20: [function (require, module, exports) {
        /*
            Date format with slash "/" (also "-" and ".") between numbers
            - Tuesday 11/3/2015 
            - 11/3/2015
            - 11/3
        
            By default the paser us "middle-endien" format (US English),
            then fallback to little-endian if failed.
            - 11/3/2015 = November 3rd, 2015
            - 23/4/2015 = April 23th, 2015
        
            If "littleEndian" config is set, the parser will try the little-endian first. 
            - 11/3/2015 = March 11th, 2015
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = new RegExp('(\\W|^)' + '(?:' + '(?:on\\s*?)?' + '((?:sun|mon|tues?|wed(?:nes)?|thu(?:rs?)?|fri|sat(?:ur)?)(?:day)?)' + '\\s*\\,?\\s*' + ')?' + '([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})' + '(?:' + '[\\/\\.\\-]' + '([0-9]{4}\s*\,?\s*|[0-9]{2}\s*\,?\s*)' + ')?' + '(\\W|$)', 'i');

        var DAYS_OFFSET = { 'sunday': 0, 'sun': 0, 'monday': 1, 'mon': 1, 'tuesday': 2, 'wednesday': 3, 'wed': 3,
            'thursday': 4, 'thur': 4, 'friday': 5, 'fri': 5, 'saturday': 6, 'sat': 6 };

        var OPENNING_GROUP = 1;
        var ENDING_GROUP = 6;

        var WEEKDAY_GROUP = 2;

        var FIRST_NUMBERS_GROUP = 3;
        var SECOND_NUMBERS_GROUP = 4;

        var YEAR_GROUP = 5;

        exports.Parser = function ENSlashDateFormatParser(config) {
            Parser.apply(this, arguments);
            config = config || {};
            var littleEndian = config.littleEndian;
            var MONTH_GROUP = littleEndian ? SECOND_NUMBERS_GROUP : FIRST_NUMBERS_GROUP;
            var DAY_GROUP = littleEndian ? FIRST_NUMBERS_GROUP : SECOND_NUMBERS_GROUP;

            this.pattern = function () {
                return PATTERN;
            };
            this.extract = function (text, ref, match, opt) {

                if (match[OPENNING_GROUP] == '/' || match[ENDING_GROUP] == '/') {
                    // Long skip, if there is some overlapping like:
                    // XX[/YY/ZZ]
                    // [XX/YY/]ZZ
                    match.index += match[0].length;
                    return;
                }

                var index = match.index + match[OPENNING_GROUP].length;
                var text = match[0].substr(match[OPENNING_GROUP].length, match[0].length - match[ENDING_GROUP].length);

                var result = new ParsedResult({
                    text: text,
                    index: index,
                    ref: ref
                });

                if (text.match(/^\d\.\d$/)) return;
                if (text.match(/^\d\.\d{1,2}\.\d{1,2}$/)) return;

                // MM/dd -> OK
                // MM.dd -> NG
                if (!match[YEAR_GROUP] && match[0].indexOf('/') < 0) return;

                var date = null;
                var year = match[YEAR_GROUP] || moment(ref).year() + '';
                var month = match[MONTH_GROUP];
                var day = match[DAY_GROUP];

                month = parseInt(month);
                day = parseInt(day);
                year = parseInt(year);

                if (month < 1 || month > 12) {
                    if (month > 12) {
                        // dd/mm/yyyy date format if day looks like a month, and month
                        // looks like a day.
                        if (day >= 1 && day <= 12 && month >= 13 && month <= 31) {
                            // unambiguous
                            var tday = month;
                            month = day;
                            day = tday;
                        } else {
                            // both month and day are <= 12
                            return null;
                        }
                    }
                }
                if (day < 1 || day > 31) return null;

                if (year < 100) {
                    if (year > 50) {
                        year = year + 1900;
                    } else {
                        year = year + 2000;
                    }
                }

                result.start.assign('day', day);
                result.start.assign('month', month);
                result.start.assign('year', year);

                //Day of week
                if (match[WEEKDAY_GROUP]) {
                    result.start.assign('weekday', DAYS_OFFSET[match[WEEKDAY_GROUP].toLowerCase()]);
                }

                result.tags['ENSlashDateFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 21: [function (require, module, exports) {
        /*
            Date format with slash "/" between numbers like ENSlashDateFormatParser,
            but this parser expect year before month and date. 
            - YYYY/MM/DD
            - YYYY-MM-DD
            - YYYY.MM.DD
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = new RegExp('(\\W|^)' + '([0-9]{4})[\\-\\.\\/]([0-9]{1,2})[\\-\\.\\/]([0-9]{1,2})' + '(?=\\W|$)', 'i');

        var YEAR_NUMBER_GROUP = 2;
        var MONTH_NUMBER_GROUP = 3;
        var DATE_NUMBER_GROUP = 4;

        exports.Parser = function ENSlashDateFormatStartWithYearParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var text = match[0].substr(match[1].length);
                var index = match.index + match[1].length;

                var result = new ParsedResult({
                    text: text,
                    index: index,
                    ref: ref
                });

                result.start.assign('year', parseInt(match[YEAR_NUMBER_GROUP]));
                result.start.assign('month', parseInt(match[MONTH_NUMBER_GROUP]));
                result.start.assign('day', parseInt(match[DATE_NUMBER_GROUP]));

                if (moment(result.start.get('month')) > 12 || moment(result.start.get('month')) < 1 || moment(result.start.get('day')) > 31 || moment(result.start.get('day')) < 1) {
                    return null;
                }

                result.tags['ENDateFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 22: [function (require, module, exports) {
        /*
            Month/Year date format with slash "/" (also "-" and ".") between numbers 
            - 11/05
            - 06/2005
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = new RegExp('(^|[^\\d/]\\s+|[^\\w\\s])' + '([0-9]|0[1-9]|1[012])/([0-9]{4})' + '([^\\d/]|$)', 'i');

        var OPENNING_GROUP = 1;
        var ENDING_GROUP = 4;

        var MONTH_GROUP = 2;
        var YEAR_GROUP = 3;

        exports.Parser = function ENSlashMonthFormatParser(argument) {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };
            this.extract = function (text, ref, match, opt) {

                var index = match.index + match[OPENNING_GROUP].length;
                var text = match[0].substr(match[OPENNING_GROUP].length, match[0].length - (1 + match[ENDING_GROUP].length)).trim();

                var result = new ParsedResult({
                    text: text,
                    index: index,
                    ref: ref
                });

                var date = null;
                var year = match[YEAR_GROUP];
                var month = match[MONTH_GROUP];
                var day = 1;

                month = parseInt(month);
                year = parseInt(year);

                result.start.imply('day', day);
                result.start.assign('month', month);
                result.start.assign('year', year);

                result.tags['ENSlashMonthFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 23: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/EN');

        var TIME_UNIT = '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|an?(?:\\s*few)?|half(?:\\s*an?)?)\\s*' + '(sec(?:onds?)?|min(?:ute)?s?|hours?|weeks?|days?|months?|years?)\\s*';

        var TIME_UNIT_STRICT = '([0-9]+|an?)\\s*' + '(seconds?|minutes?|hours?|days?)\\s*';

        var PATTERN_TIME_UNIT = new RegExp(TIME_UNIT, 'i');
        var PATTERN = new RegExp('' + '(\\W|^)' + '(?:within\\s*)?' + '((?:' + TIME_UNIT + ')+)' + '(?:ago|before|earlier)(?=(?:\\W|$))', 'i');

        var STRICT_PATTERN = new RegExp('' + '(\\W|^)' + '(?:within\\s*)?' + '((?:' + TIME_UNIT_STRICT + ')+)' + 'ago(?=(?:\\W|$))', 'i');

        exports.Parser = function ENTimeAgoFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return this.isStrictMode() ? STRICT_PATTERN : PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                if (match.index > 0 && text[match.index - 1].match(/\w/)) return null;

                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);
                index = match.index + match[1].length;

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var fragments = extractDateTimeUnitFragments(match[2]);
                var date = moment(ref);

                for (var key in fragments) {
                    date.add(-fragments[key], key);
                }

                if (fragments['hour'] > 0 || fragments['minute'] > 0 || fragments['second'] > 0) {
                    result.start.assign('hour', date.hour());
                    result.start.assign('minute', date.minute());
                    result.start.assign('second', date.second());
                    result.tags['ENTimeAgoFormatParser'] = true;
                }

                if (fragments['d'] > 0 || fragments['month'] > 0 || fragments['year'] > 0) {
                    result.start.assign('day', date.date());
                    result.start.assign('month', date.month() + 1);
                    result.start.assign('year', date.year());
                } else {
                    if (fragments['week'] > 0) {
                        result.start.imply('weekday', date.day());
                    }

                    result.start.imply('day', date.date());
                    result.start.imply('month', date.month() + 1);
                    result.start.imply('year', date.year());
                }

                return result;
            };

            function extractDateTimeUnitFragments(timeunitText) {
                var fragments = {};
                var remainingText = timeunitText;
                var match = PATTERN_TIME_UNIT.exec(remainingText);
                while (match) {
                    collectDateTimeFragment(match, fragments);
                    remainingText = remainingText.substring(match[0].length);
                    match = PATTERN_TIME_UNIT.exec(remainingText);
                }
                return fragments;
            };

            function collectDateTimeFragment(match, fragments) {

                var num = match[1].toLowerCase();
                if (util.INTEGER_WORDS[num] !== undefined) {
                    num = util.INTEGER_WORDS[num];
                } else if (num === 'a' || num === 'an') {
                    num = 1;
                } else if (num.match(/few/)) {
                    num = 3;
                } else if (num.match(/half/)) {
                    num = 0.5;
                } else {
                    num = parseInt(num);
                }

                if (match[2].match(/hour/i)) {
                    fragments['hour'] = num;
                } else if (match[2].match(/min/i)) {
                    fragments['minute'] = num;
                } else if (match[2].match(/sec/i)) {
                    fragments['second'] = num;
                } else if (match[2].match(/week/i)) {
                    fragments['week'] = num;
                } else if (match[2].match(/day/i)) {
                    fragments['d'] = num;
                } else if (match[2].match(/month/i)) {
                    fragments['month'] = num;
                } else if (match[2].match(/year/i)) {
                    fragments['year'] = num;
                }

                return fragments;
            }
        };
    }, { "../../result": 64, "../../utils/EN": 66, "../parser": 49, "moment": 72 }], 24: [function (require, module, exports) {
        /*
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var ParsedComponents = require('../../result').ParsedComponents;

        var FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" + "(?:(?:at|from)\\s*)??" + "(\\d{1,4}|noon|midnight)" + "(?:" + "(?:\\.|\\:|\\：)(\\d{1,2})" + "(?:" + "(?:\\:|\\：)(\\d{2})" + ")?" + ")?" + "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" + "(?=\\W|$)", 'i');

        var SECOND_REG_PATTERN = new RegExp("^\\s*" + "(\\-|\\–|\\~|\\〜|to|\\?)\\s*" + "(\\d{1,4})" + "(?:" + "(?:\\.|\\:|\\：)(\\d{1,2})" + "(?:" + "(?:\\.|\\:|\\：)(\\d{1,2})" + ")?" + ")?" + "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" + "(?=\\W|$)", 'i');

        var HOUR_GROUP = 2;
        var MINUTE_GROUP = 3;
        var SECOND_GROUP = 4;
        var AM_PM_HOUR_GROUP = 5;

        exports.Parser = function ENTimeExpressionParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return FIRST_REG_PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                // This pattern can be overlaped Ex. [12] AM, 1[2] AM
                if (match.index > 0 && text[match.index - 1].match(/\w/)) return null;
                var refMoment = moment(ref);
                var result = new ParsedResult();
                result.ref = ref;
                result.index = match.index + match[1].length;
                result.text = match[0].substring(match[1].length);
                result.tags['ENTimeExpressionParser'] = true;

                result.start.imply('day', refMoment.date());
                result.start.imply('month', refMoment.month() + 1);
                result.start.imply('year', refMoment.year());

                var hour = 0;
                var minute = 0;
                var meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP] != null) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (second >= 60) return null;

                    result.start.assign('second', second);
                }

                // ----- Hours
                if (match[HOUR_GROUP].toLowerCase() == "noon") {
                    meridiem = 1;
                    hour = 12;
                } else if (match[HOUR_GROUP].toLowerCase() == "midnight") {
                    meridiem = 0;
                    hour = 0;
                } else {
                    hour = parseInt(match[HOUR_GROUP]);
                }

                // ----- Minutes
                if (match[MINUTE_GROUP] != null) {
                    minute = parseInt(match[MINUTE_GROUP]);
                } else if (hour > 100) {
                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM  
                if (match[AM_PM_HOUR_GROUP] != null) {
                    if (hour > 12) return null;
                    var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                    if (ampm == "a") {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    }

                    if (ampm == "p") {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                }

                result.start.assign('hour', hour);
                result.start.assign('minute', minute);

                if (meridiem >= 0) {
                    result.start.assign('meridiem', meridiem);
                } else {
                    if (hour < 12) {
                        result.start.imply('meridiem', 0);
                    } else {
                        result.start.imply('meridiem', 1);
                    }
                }

                // ==============================================================
                //                  Extracting the 'to' chunk
                // ==============================================================
                match = SECOND_REG_PATTERN.exec(text.substring(result.index + result.text.length));
                if (!match) {
                    // Not accept number only result
                    if (result.text.match(/^\d+$/)) {
                        return null;
                    }
                    return result;
                }

                // Pattern "YY.YY -XXXX" is more like timezone offset
                if (match[0].match(/^\s*(\+|\-)\s*\d{3,4}$/)) {
                    return result;
                }

                if (result.end == null) {
                    result.end = new ParsedComponents(null, result.start.date());
                }

                var hour = 0;
                var minute = 0;
                var meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP] != null) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (second >= 60) return null;

                    result.end.assign('second', second);
                }

                hour = parseInt(match[2]);

                // ----- Minute
                if (match[MINUTE_GROUP] != null) {

                    minute = parseInt(match[MINUTE_GROUP]);
                    if (minute >= 60) return result;
                } else if (hour > 100) {

                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM 
                if (match[AM_PM_HOUR_GROUP] != null) {

                    if (hour > 12) return null;

                    var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                    if (ampm == "a") {
                        meridiem = 0;
                        if (hour == 12) {
                            hour = 0;
                            if (!result.end.isCertain('day')) {
                                result.end.imply('day', result.end.get('day') + 1);
                            }
                        }
                    }

                    if (ampm == "p") {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }

                    if (!result.start.isCertain('meridiem')) {
                        if (meridiem == 0) {

                            result.start.imply('meridiem', 0);

                            if (result.start.get('hour') == 12) {
                                result.start.assign('hour', 0);
                            }
                        } else {

                            result.start.imply('meridiem', 1);

                            if (result.start.get('hour') != 12) {
                                result.start.assign('hour', result.start.get('hour') + 12);
                            }
                        }
                    }
                }

                result.text = result.text + match[0];
                result.end.assign('hour', hour);
                result.end.assign('minute', minute);
                if (meridiem >= 0) {
                    result.end.assign('meridiem', meridiem);
                } else {
                    var startAtPM = result.start.isCertain('meridiem') && result.start.get('meridiem') == 1;
                    if (startAtPM && result.start.get('hour') > hour) {
                        // 10pm - 1 (am)
                        result.end.imply('meridiem', 0);
                    } else if (hour > 12) {
                        result.end.imply('meridiem', 1);
                    }
                }

                if (result.end.date().getTime() < result.start.date().getTime()) {
                    result.end.imply('day', result.end.get('day') + 1);
                }

                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 25: [function (require, module, exports) {
        /*
            Allows future dates according to 'days from now'
            eg:
            90 days from now
            90 days forward
            90 days out
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/EN');

        var PATTERN = new RegExp('' + '(\\W|^)' + '(?:within\\s*)?' + '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|an?(?:\\s*few)?|half(?:\\s*an?)?)\\s*' + '(seconds?|min(?:ute)?s?|hours?|weeks?|days?|months?|years?)\\s*' + '(?:from now|henceforth|forward|out)(?=(?:\\W|$))', 'i');

        var STRICT_PATTERN = new RegExp('' + '(\\W|^)' + '(?:within\\s*)?' + '([0-9]+|an?)\\s*' + '(seconds?|minutes?|hours?|days?)\\s*' + 'from now(?=(?:\\W|$))', 'i');

        exports.Parser = function ENTimeFromNowFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return this.isStrictMode() ? STRICT_PATTERN : PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                if (match.index > 0 && text[match.index - 1].match(/\w/)) {
                    return null;
                }

                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);
                index = match.index + match[1].length;

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var num = match[2].toLowerCase();
                if (util.INTEGER_WORDS[num] !== undefined) {
                    num = util.INTEGER_WORDS[num];
                } else if (num === 'a' || num === 'an') {
                    num = 1;
                } else if (num.match(/few/)) {
                    num = 3;
                } else if (num.match(/half/)) {
                    num = 0.5;
                } else {
                    num = parseInt(num);
                }

                var date = moment(ref);

                if (match[3].match(/hour|min|second/i)) {
                    if (match[3].match(/hour/i)) {

                        date.add(+num, 'hour');
                    } else if (match[3].match(/min/i)) {

                        date.add(+num, 'minute');
                    } else if (match[3].match(/second/i)) {

                        date.add(+num, 'second');
                    }

                    result.start.imply('day', date.date());
                    result.start.imply('month', date.month() + 1);
                    result.start.imply('year', date.year());
                    result.start.assign('hour', date.hour());
                    result.start.assign('minute', date.minute());
                    result.start.assign('second', date.second());
                    result.tags['ENTimeFromNowFormatParser'] = true;
                    return result;
                }

                if (match[3].match(/week/i)) {
                    date.add(+num, 'week');

                    result.start.imply('day', date.date());
                    result.start.imply('month', date.month() + 1);
                    result.start.imply('year', date.year());
                    result.start.imply('weekday', date.day());
                    return result;
                }

                if (match[3].match(/day/i)) {
                    date.add(+num, 'd');
                }

                if (match[3].match(/month/i)) {
                    date.add(+num, 'month');
                }

                if (match[3].match(/year/i)) {

                    date.add(+num, 'year');
                }

                result.start.assign('day', date.date());
                result.start.assign('month', date.month() + 1);
                result.start.assign('year', date.year());
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/EN": 66, "../parser": 49, "moment": 72 }], 26: [function (require, module, exports) {
        /*
        
        
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var DAYS_OFFSET = { 'sunday': 0, 'sun': 0, 'monday': 1, 'mon': 1, 'tuesday': 2, 'tues': 2, 'tue': 2, 'wednesday': 3, 'wed': 3,
            'thursday': 4, 'thurs': 4, 'thur': 4, 'thu': 4, 'friday': 5, 'fri': 5, 'saturday': 6, 'sat': 6 };

        var PATTERN = new RegExp('(\\W|^)' + '(?:(?:\\,|\\(|\\（)\\s*)?' + '(?:on\\s*?)?' + '(?:(this|last|past|next)\\s*)?' + '(' + Object.keys(DAYS_OFFSET).join('|') + ')' + '(?:\\s*(?:\\,|\\)|\\）))?' + '(?:\\s*(this|last|past|next)\\s*week)?' + '(?=\\W|$)', 'i');

        var PREFIX_GROUP = 2;
        var WEEKDAY_GROUP = 3;
        var POSTFIX_GROUP = 4;

        exports.updateParsedComponent = function updateParsedComponent(result, ref, offset, modifier) {

            var startMoment = moment(ref);
            var startMomentFixed = false;
            var refOffset = startMoment.day();

            if (modifier == 'last' || modifier == 'past') {
                startMoment.day(offset - 7);
                startMomentFixed = true;
            } else if (modifier == 'next') {
                startMoment.day(offset + 7);
                startMomentFixed = true;
            } else if (modifier == 'this') {
                startMoment.day(offset);
            } else {
                if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                    startMoment.day(offset - 7);
                } else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                    startMoment.day(offset + 7);
                } else {
                    startMoment.day(offset);
                }
            }

            result.start.assign('weekday', offset);
            if (startMomentFixed) {
                result.start.assign('day', startMoment.date());
                result.start.assign('month', startMoment.month() + 1);
                result.start.assign('year', startMoment.year());
            } else {
                result.start.imply('day', startMoment.date());
                result.start.imply('month', startMoment.month() + 1);
                result.start.imply('year', startMoment.year());
            }

            return result;
        };

        exports.Parser = function ENWeekdayParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var index = match.index + match[1].length;
                var text = match[0].substr(match[1].length, match[0].length - match[1].length);
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                var offset = DAYS_OFFSET[dayOfWeek];
                if (offset === undefined) {
                    return null;
                }

                var prefix = match[PREFIX_GROUP];
                var postfix = match[POSTFIX_GROUP];
                var norm = prefix || postfix;
                norm = norm || '';
                norm = norm.toLowerCase();

                exports.updateParsedComponent(result, ref, offset, norm);
                result.tags['ENWeekdayParser'] = true;

                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 27: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        /*
          Valid patterns:
          - esta mañana -> today in the morning
          - esta tarde -> today in the afternoon/evening
          - esta noche -> tonight
          - ayer por la mañana -> yesterday in the morning
          - ayer por la tarde -> yesterday in the afternoon/evening
          - ayer por la noche -> yesterday at night
          - mañana por la mañana -> tomorrow in the morning
          - mañana por la tarde -> tomorrow in the afternoon/evening
          - mañana por la noche -> tomorrow at night
          - anoche -> tomorrow at night
          - hoy -> today
          - ayer -> yesterday
          - mañana -> tomorrow
         */
        var PATTERN = /(\W|^)(ahora|esta\s*(mañana|tarde|noche)|(ayer|mañana)\s*por\s*la\s*(mañana|tarde|noche)|hoy|mañana|ayer|anoche)(?=\W|$)/i;

        exports.Parser = function ESCasualDateParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var text = match[0].substr(match[1].length);
                var index = match.index + match[1].length;
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var refMoment = moment(ref);
                var startMoment = refMoment.clone();
                var lowerText = text.toLowerCase().replace(/\s+/g, ' ');

                if (lowerText == 'mañana') {

                    // Check not "Tomorrow" on late night
                    if (refMoment.hour() > 1) {
                        startMoment.add(1, 'day');
                    }
                } else if (lowerText == 'ayer') {

                    startMoment.add(-1, 'day');
                } else if (lowerText == 'anoche') {

                    result.start.imply('hour', 0);
                    if (refMoment.hour() > 6) {
                        startMoment.add(-1, 'day');
                    }
                } else if (lowerText.match("esta")) {

                    var secondMatch = match[3].toLowerCase();
                    if (secondMatch == "tarde") {

                        result.start.imply('hour', 18);
                    } else if (secondMatch == "mañana") {

                        result.start.imply('hour', 6);
                    } else if (secondMatch == "noche") {

                        // Normally means this coming midnight
                        result.start.imply('hour', 22);
                        result.start.imply('meridiem', 1);
                    }
                } else if (lowerText.match(/por\s*la/)) {

                    var firstMatch = match[4].toLowerCase();
                    if (firstMatch === 'ayer') {

                        startMoment.add(-1, 'day');
                    } else if (firstMatch === 'mañana') {

                        startMoment.add(1, 'day');
                    }

                    var secondMatch = match[5].toLowerCase();
                    if (secondMatch == "tarde") {

                        result.start.imply('hour', 18);
                    } else if (secondMatch == "mañana") {

                        result.start.imply('hour', 9);
                    } else if (secondMatch == "noche") {

                        // Normally means this coming midnight
                        result.start.imply('hour', 22);
                        result.start.imply('meridiem', 1);
                    }
                } else if (lowerText.match("ahora")) {

                    result.start.imply('hour', refMoment.hour());
                    result.start.imply('minute', refMoment.minute());
                    result.start.imply('second', refMoment.second());
                    result.start.imply('millisecond', refMoment.millisecond());
                }

                result.start.assign('day', startMoment.date());
                result.start.assign('month', startMoment.month() + 1);
                result.start.assign('year', startMoment.year());
                result.tags['ESCasualDateParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 28: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = /(\W|^)(dentro\s*de|en)\s*([0-9]+|medi[oa]|una?)\s*(minutos?|horas?|d[ií]as?)\s*(?=(?:\W|$))/i;

        exports.Parser = function ESDeadlineFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var index = match.index + match[1].length;
                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var num = parseInt(match[3]);
                if (isNaN(num)) {
                    if (match[3].match(/medi/)) {
                        num = 0.5;
                    } else {
                        num = 1;
                    }
                }

                var date = moment(ref);
                if (match[4].match(/d[ií]a/)) {
                    date.add(num, 'd');

                    result.start.assign('year', date.year());
                    result.start.assign('month', date.month() + 1);
                    result.start.assign('day', date.date());
                    return result;
                }

                if (match[4].match(/hora/)) {

                    date.add(num, 'hour');
                } else if (match[4].match(/minuto/)) {

                    date.add(num, 'minute');
                }

                result.start.imply('year', date.year());
                result.start.imply('month', date.month() + 1);
                result.start.imply('day', date.date());
                result.start.assign('hour', date.hour());
                result.start.assign('minute', date.minute());
                result.tags['ESDeadlineFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 29: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');

        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var util = require('../../utils/ES');

        var DAYS_OFFSET = util.WEEKDAY_OFFSET;

        var PATTERN = new RegExp('(\\W|^)' + '(?:(Domingo|Lunes|Martes|Miércoles|Miercoles|Jueves|Viernes|Sábado|Sabado|Dom|Lun|Mar|Mie|Jue|Vie|Sab)\\s*,?\\s*)?' + '([0-9]{1,2})(?:º|ª|°)?' + '(?:\\s*(?:desde|de|\\-|\\–|al?|hasta|\\s)\\s*([0-9]{1,2})(?:º|ª|°)?)?\\s*(?:de)?\\s*' + '(Ene(?:ro|\\.)?|Feb(?:rero|\\.)?|Mar(?:zo|\\.)?|Abr(?:il|\\.)?|May(?:o|\\.)?|Jun(?:io|\\.)?|Jul(?:io|\\.)?|Ago(?:sto|\\.)?|Sep(?:tiembre|\\.)?|Oct(?:ubre|\\.)?|Nov(?:iembre|\\.)?|Dic(?:iembre|\\.)?)' + '(?:\\s*(?:del?)?(\\s*[0-9]{1,4}(?![^\\s]\\d))(\\s*[ad]\\.?\\s*c\\.?|a\\.?\\s*d\\.?)?)?' + '(?=\\W|$)', 'i');

        var WEEKDAY_GROUP = 2;
        var DATE_GROUP = 3;
        var DATE_TO_GROUP = 4;
        var MONTH_NAME_GROUP = 5;
        var YEAR_GROUP = 6;
        var YEAR_BE_GROUP = 7;

        exports.Parser = function ESMonthNameLittleEndianParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var result = new ParsedResult({
                    text: match[0].substr(match[1].length, match[0].length - match[1].length),
                    index: match.index + match[1].length,
                    ref: ref
                });

                var month = match[MONTH_NAME_GROUP];
                month = util.MONTH_OFFSET[month.toLowerCase()];

                var day = match[DATE_GROUP];
                day = parseInt(day);

                var year = null;
                if (match[YEAR_GROUP]) {
                    year = match[YEAR_GROUP];
                    year = parseInt(year);

                    if (match[YEAR_BE_GROUP]) {
                        if (/a\.?\s*c\.?/i.test(match[YEAR_BE_GROUP])) {
                            // antes de Cristo
                            year = -year;
                        }
                    } else if (year < 100) {

                        year = year + 2000;
                    }
                }

                if (year) {
                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.assign('year', year);
                } else {

                    //Find the most appropriated year
                    var refMoment = moment(ref);
                    refMoment.month(month - 1);
                    refMoment.date(day);
                    refMoment.year(moment(ref).year());

                    var nextYear = refMoment.clone().add(1, 'y');
                    var lastYear = refMoment.clone().add(-1, 'y');
                    if (Math.abs(nextYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = nextYear;
                    } else if (Math.abs(lastYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = lastYear;
                    }

                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.imply('year', refMoment.year());
                }

                // Weekday component
                if (match[WEEKDAY_GROUP]) {
                    var weekday = match[WEEKDAY_GROUP];
                    weekday = util.WEEKDAY_OFFSET[weekday.toLowerCase()];
                    result.start.assign('weekday', weekday);
                }

                // Text can be 'range' value. Such as '12 - 13 January 2012'
                if (match[DATE_TO_GROUP]) {
                    result.end = result.start.clone();
                    result.end.assign('day', parseInt(match[DATE_TO_GROUP]));
                }

                result.tags['ESMonthNameLittleEndianParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/ES": 67, "../parser": 49, "moment": 72 }], 30: [function (require, module, exports) {
        /*
            Date format with slash "/" (also "-" and ".") between numbers
            - Martes 3/11/2015
            - 3/11/2015
            - 3/11
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = new RegExp('(\\W|^)' + '(?:' + '((?:domingo|dom|lunes|lun|martes|mar|mi[ée]rcoles|mie|jueves|jue|viernes|vie|s[áa]bado|sab))' + '\\s*\\,?\\s*' + ')?' + '([0-1]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})' + '(?:' + '[\\/\\.\\-]' + '([0-9]{4}\s*\,?\s*|[0-9]{2}\s*\,?\s*)' + ')?' + '(\\W|$)', 'i');

        var DAYS_OFFSET = { 'domingo': 0, 'dom': 0, 'lunes': 1, 'lun': 1, 'martes': 2, 'mar': 2, 'miercoles': 3, 'miércoles': 3, 'mie': 3,
            'jueves': 4, 'jue': 4, 'viernes': 5, 'vier': 5, 'sábado': 6, 'sabado': 6, 'sab': 6 };

        var OPENNING_GROUP = 1;
        var ENDING_GROUP = 6;

        // in Spanish we use day/month/year
        var WEEKDAY_GROUP = 2;
        var MONTH_GROUP = 4;
        var DAY_GROUP = 3;
        var YEAR_GROUP = 5;

        exports.Parser = function ESSlashDateFormatParser(argument) {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };
            this.extract = function (text, ref, match, opt) {

                if (match[OPENNING_GROUP] == '/' || match[ENDING_GROUP] == '/') {
                    // Long skip, if there is some overlapping like:
                    // XX[/YY/ZZ]
                    // [XX/YY/]ZZ
                    match.index += match[0].length;
                    return;
                }

                var index = match.index + match[OPENNING_GROUP].length;
                var text = match[0].substr(match[OPENNING_GROUP].length, match[0].length - match[ENDING_GROUP].length);

                var result = new ParsedResult({
                    text: text,
                    index: index,
                    ref: ref
                });

                if (text.match(/^\d\.\d$/)) return;
                if (text.match(/^\d\.\d{1,2}\.\d{1,2}$/)) return;

                // MM/dd -> OK
                // MM.dd -> NG
                if (!match[YEAR_GROUP] && match[0].indexOf('/') < 0) return;

                var date = null;
                var year = match[YEAR_GROUP] || moment(ref).year() + '';
                var month = match[MONTH_GROUP];
                var day = match[DAY_GROUP];

                month = parseInt(month);
                day = parseInt(day);
                year = parseInt(year);

                if (month < 1 || month > 12) {
                    if (month > 12) {
                        // dd/mm/yyyy date format if day looks like a month, and month
                        // looks like a day.
                        if (day >= 1 && day <= 12 && month >= 13 && month <= 31) {
                            // unambiguous
                            var tday = month;
                            month = day;
                            day = tday;
                        } else {
                            // both month and day are <= 12
                            return null;
                        }
                    }
                }
                if (day < 1 || day > 31) return null;

                if (year < 100) {
                    if (year > 50) {
                        year = year + 1900;
                    } else {
                        year = year + 2000;
                    }
                }

                result.start.assign('day', day);
                result.start.assign('month', month);
                result.start.assign('year', year);

                //Day of week
                if (match[WEEKDAY_GROUP]) {
                    result.start.assign('weekday', DAYS_OFFSET[match[WEEKDAY_GROUP].toLowerCase()]);
                }

                result.tags['ESSlashDateFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 31: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = /(\W|^)hace\s*([0-9]+|medi[oa]|una?)\s*(minutos?|horas?|semanas?|d[ií]as?|mes(es)?|años?)(?=(?:\W|$))/i;

        exports.Parser = function ESTimeAgoFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                if (match.index > 0 && text[match.index - 1].match(/\w/)) return null;

                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);
                index = match.index + match[1].length;

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var num = parseInt(match[2]);
                if (isNaN(num)) {
                    if (match[2].match(/medi/)) {
                        num = 0.5;
                    } else {
                        num = 1;
                    }
                }

                var date = moment(ref);

                if (match[3].match(/hora/) || match[3].match(/minuto/)) {
                    if (match[3].match(/hora/)) {

                        date.add(-num, 'hour');
                    } else if (match[3].match(/minuto/)) {

                        date.add(-num, 'minute');
                    }

                    result.start.imply('day', date.date());
                    result.start.imply('month', date.month() + 1);
                    result.start.imply('year', date.year());
                    result.start.assign('hour', date.hour());
                    result.start.assign('minute', date.minute());
                    result.tags['ESTimeAgoFormatParser'] = true;
                    return result;
                }

                if (match[3].match(/semana/)) {
                    date.add(-num, 'week');

                    result.start.imply('day', date.date());
                    result.start.imply('month', date.month() + 1);
                    result.start.imply('year', date.year());
                    result.start.imply('weekday', date.day());
                    return result;
                }

                if (match[3].match(/d[ií]a/)) {
                    date.add(-num, 'd');
                }

                if (match[3].match(/mes/)) {
                    date.add(-num, 'month');
                }

                if (match[3].match(/año/)) {

                    date.add(-num, 'year');
                }

                result.start.assign('day', date.date());
                result.start.assign('month', date.month() + 1);
                result.start.assign('year', date.year());
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 32: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var ParsedComponents = require('../../result').ParsedComponents;

        var FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" + "(?:(?:a las?|al?|desde|de)\\s*)?" + "(\\d{1,4}|mediod[ií]a|medianoche)" + "(?:" + "(?:\\.|\\:|\\：)(\\d{1,2})" + "(?:" + "(?:\\:|\\：)(\\d{2})" + ")?" + ")?" + "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" + "(?=\\W|$)", 'i');

        var SECOND_REG_PATTERN = new RegExp("^\\s*" + "(\\-|\\–|\\~|\\〜|a(?:\s*las)?|\\?)\\s*" + "(\\d{1,4})" + "(?:" + "(?:\\.|\\:|\\：)(\\d{1,2})" + "(?:" + "(?:\\.|\\:|\\：)(\\d{1,2})" + ")?" + ")?" + "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" + "(?=\\W|$)", 'i');

        var HOUR_GROUP = 2;
        var MINUTE_GROUP = 3;
        var SECOND_GROUP = 4;
        var AM_PM_HOUR_GROUP = 5;

        exports.Parser = function ESTimeExpressionParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return FIRST_REG_PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                // This pattern can be overlaped Ex. [12] AM, 1[2] AM
                if (match.index > 0 && text[match.index - 1].match(/\w/)) return null;
                var refMoment = moment(ref);
                var result = new ParsedResult();
                result.ref = ref;
                result.index = match.index + match[1].length;
                result.text = match[0].substring(match[1].length);
                result.tags['ESTimeExpressionParser'] = true;

                result.start.imply('day', refMoment.date());
                result.start.imply('month', refMoment.month() + 1);
                result.start.imply('year', refMoment.year());

                var hour = 0;
                var minute = 0;
                var meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP] != null) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (second >= 60) return null;

                    result.start.assign('second', second);
                }

                // ----- Hours
                if (match[HOUR_GROUP].toLowerCase().match(/mediod/)) {
                    meridiem = 1;
                    hour = 12;
                } else if (match[HOUR_GROUP].toLowerCase() == "medianoche") {
                    meridiem = 0;
                    hour = 0;
                } else {
                    hour = parseInt(match[HOUR_GROUP]);
                }

                // ----- Minutes
                if (match[MINUTE_GROUP] != null) {
                    minute = parseInt(match[MINUTE_GROUP]);
                } else if (hour > 100) {
                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM
                if (match[AM_PM_HOUR_GROUP] != null) {
                    if (hour > 12) return null;
                    var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                    if (ampm == "a") {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    }

                    if (ampm == "p") {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                }
                result.start.assign('hour', hour);
                result.start.assign('minute', minute);
                if (meridiem >= 0) {
                    result.start.assign('meridiem', meridiem);
                }

                // ==============================================================
                //                  Extracting the 'to' chunk
                // ==============================================================
                match = SECOND_REG_PATTERN.exec(text.substring(result.index + result.text.length));
                if (!match) {
                    // Not accept number only result
                    if (result.text.match(/^\d+$/)) {
                        return null;
                    }
                    return result;
                }

                // Pattern "YY.YY -XXXX" is more like timezone offset
                if (match[0].match(/^\s*(\+|\-)\s*\d{3,4}$/)) {
                    return result;
                }

                if (result.end == null) {
                    result.end = new ParsedComponents(null, result.start.date());
                }

                var hour = 0;
                var minute = 0;
                var meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP] != null) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (second >= 60) return null;

                    result.end.assign('second', second);
                }

                hour = parseInt(match[2]);

                // ----- Minute
                if (match[MINUTE_GROUP] != null) {

                    minute = parseInt(match[MINUTE_GROUP]);
                    if (minute >= 60) return result;
                } else if (hour > 100) {

                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM
                if (match[AM_PM_HOUR_GROUP] != null) {

                    if (hour > 12) return null;

                    if (match[AM_PM_HOUR_GROUP][0].toLowerCase() == "a") {
                        meridiem = 0;
                        if (hour == 12) {
                            hour = 0;
                            if (!result.end.isCertain('day')) {
                                result.end.imply('day', result.end.get('day') + 1);
                            }
                        }
                    }

                    if (match[AM_PM_HOUR_GROUP][0].toLowerCase() == "p") {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }

                    if (!result.start.isCertain('meridiem')) {
                        if (meridiem == 0) {

                            result.start.imply('meridiem', 0);

                            if (result.start.get('hour') == 12) {
                                result.start.assign('hour', 0);
                            }
                        } else {

                            result.start.imply('meridiem', 1);

                            if (result.start.get('hour') != 12) {
                                result.start.assign('hour', result.start.get('hour') + 12);
                            }
                        }
                    }
                } else if (hour >= 12) {
                    meridiem = 1;
                }

                result.text = result.text + match[0];
                result.end.assign('hour', hour);
                result.end.assign('minute', minute);
                if (meridiem >= 0) {
                    result.end.assign('meridiem', meridiem);
                }

                if (result.end.date().getTime() < result.start.date().getTime()) {
                    result.end.imply('day', result.end.get('day') + 1);
                }

                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 33: [function (require, module, exports) {
        /*
        
        
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var updateParsedComponent = require('../EN/ENWeekdayParser').updateParsedComponent;

        var DAYS_OFFSET = { 'domingo': 0, 'dom': 0, 'lunes': 1, 'lun': 1, 'martes': 2, 'mar': 2, 'miercoles': 3, 'miércoles': 3, 'mie': 3,
            'jueves': 4, 'jue': 4, 'viernes': 5, 'vier': 5, 'sabado': 6, 'sábado': 6, 'sab': 6 };

        var PATTERN = new RegExp('(\\W|^)' + '(?:(?:\\,|\\(|\\（)\\s*)?' + '(?:(este|pasado|pr[oó]ximo)\\s*)?' + '(' + Object.keys(DAYS_OFFSET).join('|') + ')' + '(?:\\s*(?:\\,|\\)|\\）))?' + '(?:\\s*(este|pasado|pr[óo]ximo)\\s*week)?' + '(?=\\W|$)', 'i');

        var PREFIX_GROUP = 2;
        var WEEKDAY_GROUP = 3;
        var POSTFIX_GROUP = 4;

        exports.Parser = function ESWeekdayParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var index = match.index + match[1].length;
                var text = match[0].substr(match[1].length, match[0].length - match[1].length);
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                var offset = DAYS_OFFSET[dayOfWeek];
                if (offset === undefined) return null;

                var modifier = null;
                var prefix = match[PREFIX_GROUP];
                var postfix = match[POSTFIX_GROUP];
                if (prefix || postfix) {
                    var norm = prefix || postfix;
                    norm = norm.toLowerCase();

                    if (norm == 'pasado') {
                        modifier = 'this';
                    } else if (norm == 'próximo' || norm == 'proximo') {
                        modifier = 'next';
                    } else if (norm == 'este') {
                        modifier = 'this';
                    }
                }

                updateParsedComponent(result, ref, offset, modifier);
                result.tags['ESWeekdayParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../EN/ENWeekdayParser": 26, "../parser": 49, "moment": 72 }], 34: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = /(\W|^)(maintenant|aujourd'hui|ajd|cette\s*nuit|la\s*veille|(demain|hier)(\s*(matin|soir|aprem|après-midi))?|ce\s*(matin|soir)|cet\s*(après-midi|aprem))(?=\W|$)/i;

        exports.Parser = function FRCasualDateParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var text = match[0].substr(match[1].length);
                var index = match.index + match[1].length;
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var refMoment = moment(ref);
                var startMoment = refMoment.clone();
                var lowerText = text.toLowerCase();

                if (lowerText.match(/demain/)) {
                    // Check not "Tomorrow" on late night
                    if (refMoment.hour() > 1) {
                        startMoment.add(1, 'day');
                    }
                }

                if (lowerText.match(/hier/)) {
                    startMoment.add(-1, 'day');
                }

                if (lowerText.match(/cette\s*nuit/)) {
                    // Normally means this coming midnight
                    result.start.imply('hour', 22);
                    result.start.imply('meridiem', 1);
                } else if (lowerText.match(/la\s*veille/)) {

                    result.start.imply('hour', 0);
                    if (refMoment.hour() > 6) {
                        startMoment.add(-1, 'day');
                    }
                } else if (lowerText.match(/(après-midi|aprem)/)) {

                    result.start.imply('hour', 14);
                } else if (lowerText.match(/(soir)/)) {

                    result.start.imply('hour', 18);
                } else if (lowerText.match(/matin/)) {

                    result.start.imply('hour', 8);
                } else if (lowerText.match("maintenant")) {

                    result.start.imply('hour', refMoment.hour());
                    result.start.imply('minute', refMoment.minute());
                    result.start.imply('second', refMoment.second());
                    result.start.imply('millisecond', refMoment.millisecond());
                }

                result.start.assign('day', startMoment.date());
                result.start.assign('month', startMoment.month() + 1);
                result.start.assign('year', startMoment.year());
                result.tags['FRCasualDateParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 35: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/FR');

        var PATTERN = new RegExp('(\\W|^)' + '(dans|en)\\s*' + '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|une?|(?:\\s*quelques)?|demi(?:\\s*|-?)?)\\s*' + '(secondes?|min(?:ute)?s?|heures?|jours?|semaines?|mois|années?)\\s*' + '(?=\\W|$)', 'i');

        var STRICT_PATTERN = new RegExp('(\\W|^)' + '(dans|en)\\s*' + '(' + util.INTEGER_WORDS_PATTERN + '|[0-9]+|un?)\\s*' + '(secondes?|minutes?|heures?|jours?)\\s*' + '(?=\\W|$)', 'i');

        exports.Parser = function FRDeadlineFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return this.isStrictMode() ? STRICT_PATTERN : PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var index = match.index + match[1].length;
                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var num = match[3];
                if (util.INTEGER_WORDS[num] !== undefined) {
                    num = util.INTEGER_WORDS[num];
                } else if (num === 'un' || num === 'une') {
                    num = 1;
                } else if (num.match(/quelques?/i)) {
                    num = 3;
                } else if (num.match(/demi-?/i)) {
                    num = 0.5;
                } else {
                    num = parseInt(num);
                }

                var date = moment(ref);
                if (match[4].match(/jour|semaine|mois|année/i)) {

                    if (match[4].match(/jour/)) {
                        date.add(num, 'd');
                    } else if (match[4].match(/semaine/i)) {
                        date.add(num * 7, 'd');
                    } else if (match[4].match(/mois/i)) {
                        date.add(num, 'month');
                    } else if (match[4].match(/année/i)) {
                        date.add(num, 'year');
                    }

                    result.start.assign('year', date.year());
                    result.start.assign('month', date.month() + 1);
                    result.start.assign('day', date.date());
                    return result;
                }

                if (match[4].match(/heure/i)) {

                    date.add(num, 'hour');
                } else if (match[4].match(/min/i)) {

                    date.add(num, 'minutes');
                } else if (match[4].match(/secondes/i)) {

                    date.add(num, 'second');
                }

                result.start.imply('year', date.year());
                result.start.imply('month', date.month() + 1);
                result.start.imply('day', date.date());
                result.start.assign('hour', date.hour());
                result.start.assign('minute', date.minute());
                result.start.assign('second', date.second());
                result.tags['FRDeadlineFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/FR": 68, "../parser": 49, "moment": 72 }], 36: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');

        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var util = require('../../utils/FR');

        var DAYS_OFFSET = util.WEEKDAY_OFFSET;

        var PATTERN = new RegExp('(\\W|^)' + '(?:(Dimanche|Lundi|Mardi|mercredi|Jeudi|Vendredi|Samedi|Dim|Lun|Mar|Mer|Jeu|Ven|Sam)\\s*,?\\s*)?' + '([0-9]{1,2}|1er)' + '(?:\\s*(?:au|\\-|\\–|jusqu\'au?|\\s)\\s*([0-9]{1,2})(?:er)?)?\\s*(?:de)?\\s*' + '(Jan(?:vier|\\.)?|F[ée]v(?:rier|\\.)?|Mars|Avr(?:il|\\.)?|Mai|Juin|Juil(?:let|\\.)?|Ao[uû]t|Sept(?:embre|\\.)?|Oct(?:obre|\\.)?|Nov(?:embre|\\.)?|d[ée]c(?:embre|\\.)?)' + '(?:\\s*(\\s*[0-9]{1,4}(?![^\\s]\\d))(?:\\s*(AC|[ap]\\.?\\s*c(?:h(?:r)?)?\\.?\\s*n\\.?))?)?' + '(?=\\W|$)', 'i');

        var WEEKDAY_GROUP = 2;
        var DATE_GROUP = 3;
        var DATE_TO_GROUP = 4;
        var MONTH_NAME_GROUP = 5;
        var YEAR_GROUP = 6;
        var YEAR_BE_GROUP = 7;

        exports.Parser = function FRMonthNameLittleEndianParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var result = new ParsedResult({
                    text: match[0].substr(match[1].length, match[0].length - match[1].length),
                    index: match.index + match[1].length,
                    ref: ref
                });

                var month = match[MONTH_NAME_GROUP];
                month = util.MONTH_OFFSET[month.toLowerCase()];

                var day = match[DATE_GROUP];
                day = parseInt(day);

                var year = null;
                if (match[YEAR_GROUP]) {
                    year = match[YEAR_GROUP];
                    year = parseInt(year);

                    if (match[YEAR_BE_GROUP]) {
                        if (/a/i.test(match[YEAR_BE_GROUP])) {
                            // Ante Christe natum
                            year = -year;
                        }
                    } else if (year < 100) {

                        year = year + 2000;
                    }
                }

                if (year) {
                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.assign('year', year);
                } else {

                    // Find the most appropriated year
                    var refMoment = moment(ref);
                    refMoment.month(month - 1);
                    refMoment.date(day);
                    refMoment.year(moment(ref).year());

                    var nextYear = refMoment.clone().add(1, 'y');
                    var lastYear = refMoment.clone().add(-1, 'y');
                    if (Math.abs(nextYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = nextYear;
                    } else if (Math.abs(lastYear.diff(moment(ref))) < Math.abs(refMoment.diff(moment(ref)))) {
                        refMoment = lastYear;
                    }

                    result.start.assign('day', day);
                    result.start.assign('month', month);
                    result.start.imply('year', refMoment.year());
                }

                // Weekday component
                if (match[WEEKDAY_GROUP]) {
                    var weekday = match[WEEKDAY_GROUP];
                    weekday = util.WEEKDAY_OFFSET[weekday.toLowerCase()];
                    result.start.assign('weekday', weekday);
                }

                // Text can be 'range' value. Such as '12 - 13 janvier 2012'
                if (match[DATE_TO_GROUP]) {
                    result.end = result.start.clone();
                    result.end.assign('day', parseInt(match[DATE_TO_GROUP]));
                }

                result.tags['FRMonthNameLittleEndianParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/FR": 68, "../parser": 49, "moment": 72 }], 37: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var util = require('../../utils/FR');

        // Force load fr localization data from moment for the locale files to be linkded durning browserify.
        // NOTE: The function moment.defineLocale() also has a side effect that it change global locale
        //  We also need to save and restore the previous locale (see. moment.js, loadLocale)
        var originalLocale = moment.locale();
        require('moment/locale/fr');
        moment.locale(originalLocale);

        var PATTERN = new RegExp('(\\W|^)' + '(?:les?|la|l\'|du|des?)\\s*' + '(' + util.INTEGER_WORDS_PATTERN + '|\\d+)?\\s*' + '(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?)?\\s*' + '(secondes?|min(?:ute)?s?|heures?|jours?|semaines?|mois|trimestres?|années?)\\s*' + '(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?)?' + '(?=\\W|$)', 'i');

        var MULTIPLIER_GROUP = 2;
        var MODIFIER_1_GROUP = 3;
        var RELATIVE_WORD_GROUP = 4;
        var MODIFIER_2_GROUP = 5;

        exports.Parser = function FRRelativeDateFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var index = match.index + match[1].length;
                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);

                // Multiplier
                var multiplier = match[MULTIPLIER_GROUP] === undefined ? '1' : match[MULTIPLIER_GROUP];
                if (util.INTEGER_WORDS[multiplier] !== undefined) {
                    multiplier = util.INTEGER_WORDS[multiplier];
                } else {
                    multiplier = parseInt(multiplier);
                }

                // Modifier
                var modifier = match[MODIFIER_1_GROUP] === undefined ? match[MODIFIER_2_GROUP] === undefined ? '' : match[MODIFIER_2_GROUP].toLowerCase() : match[MODIFIER_1_GROUP].toLowerCase();
                if (!modifier) {
                    // At least one modifier is mandatory to match this parser
                    return;
                }

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });
                result.tags['FRRelativeDateFormatParser'] = true;

                var modifierFactor;
                switch (true) {
                    case /prochaine?s?/.test(modifier):
                    case /suivants?/.test(modifier):
                        modifierFactor = 1;
                        break;
                    case /derni[eè]re?s?/.test(modifier):
                    case /pass[ée]e?s?/.test(modifier):
                    case /pr[ée]c[ée]dents?/.test(modifier):
                        modifierFactor = -1;
                        break;
                }

                var total = multiplier * modifierFactor;

                var dateFrom = moment(ref),
                    dateTo = moment(ref);
                dateFrom.locale('fr');
                dateTo.locale('fr');
                var relative = match[RELATIVE_WORD_GROUP];
                var startOf;
                switch (true) {
                    case /secondes?/.test(relative):
                        dateFrom.add(total, 's');
                        dateTo.add(modifierFactor, 's');
                        startOf = 'second';
                        break;
                    case /min(?:ute)?s?/.test(relative):
                        dateFrom.add(total, 'm');
                        dateTo.add(modifierFactor, 'm');
                        startOf = 'minute';
                        break;
                    case /heures?/.test(relative):
                        dateFrom.add(total, 'h');
                        dateTo.add(modifierFactor, 'h');
                        startOf = 'hour';
                        break;
                    case /jours?/.test(relative):
                        dateFrom.add(total, 'd');
                        dateTo.add(modifierFactor, 'd');
                        startOf = 'day';
                        break;
                    case /semaines?/.test(relative):
                        dateFrom.add(total, 'w');
                        dateTo.add(modifierFactor, 'w');
                        startOf = 'week';
                        break;
                    case /mois?/.test(relative):
                        dateFrom.add(total, 'M');
                        dateTo.add(modifierFactor, 'M');
                        startOf = 'month';
                        break;
                    case /trimestres?/.test(relative):
                        dateFrom.add(total, 'Q');
                        dateTo.add(modifierFactor, 'Q');
                        startOf = 'quarter';
                        break;
                    case /années?/.test(relative):
                        dateFrom.add(total, 'y');
                        dateTo.add(modifierFactor, 'y');
                        startOf = 'year';
                        break;
                }

                // if we go forward, switch the start and end dates
                if (modifierFactor > 0) {
                    var dateTmp = dateFrom;
                    dateFrom = dateTo;
                    dateTo = dateTmp;
                }

                // Get start and end of dates
                dateFrom.startOf(startOf);
                dateTo.endOf(startOf);

                // Assign results
                result.start.assign('year', dateFrom.year());
                result.start.assign('month', dateFrom.month() + 1);
                result.start.assign('day', dateFrom.date());
                result.start.assign('minute', dateFrom.minute());
                result.start.assign('second', dateFrom.second());
                result.start.assign('hour', dateFrom.hour());
                result.start.assign('millisecond', dateFrom.millisecond());

                result.end = result.start.clone();
                result.end.assign('year', dateTo.year());
                result.end.assign('month', dateTo.month() + 1);
                result.end.assign('day', dateTo.date());
                result.end.assign('minute', dateTo.minute());
                result.end.assign('second', dateTo.second());
                result.end.assign('hour', dateTo.hour());
                result.end.assign('millisecond', dateTo.millisecond());
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/FR": 68, "../parser": 49, "moment": 72, "moment/locale/fr": 71 }], 38: [function (require, module, exports) {
        /*
            Date format with slash "/" (also "-" and ".") between numbers
            - Martes 3/11/2015
            - 3/11/2015
            - 3/11
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = new RegExp('(\\W|^)' + '(?:' + '((?:dimanche|dim|lundi|lun|mardi|mar|mercredi|mer|jeudi|jeu|vendredi|ven|samedi|sam|le))' + '\\s*\\,?\\s*' + ')?' + '([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})' + '(?:' + '[\\/\\.\\-]' + '([0-9]{4}\s*\,?\s*|[0-9]{2}\s*\,?\s*)' + ')?' + '(\\W|$)', 'i');

        var DAYS_OFFSET = { 'dimanche': 0, 'dim': 0, 'lundi': 1, 'lun': 1, 'mardi': 2, 'mar': 2, 'mercredi': 3, 'mer': 3,
            'jeudi': 4, 'jeu': 4, 'vendredi': 5, 'ven': 5, 'samedi': 6, 'sam': 6 };

        var OPENNING_GROUP = 1;
        var ENDING_GROUP = 6;

        // In French we use day/month/year
        var WEEKDAY_GROUP = 2;
        var DAY_GROUP = 3;
        var MONTH_GROUP = 4;
        var YEAR_GROUP = 5;

        exports.Parser = function FRSlashDateFormatParser(argument) {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };
            this.extract = function (text, ref, match, opt) {

                if (match[OPENNING_GROUP] == '/' || match[ENDING_GROUP] == '/') {
                    // Long skip, if there is some overlapping like:
                    // XX[/YY/ZZ]
                    // [XX/YY/]ZZ
                    match.index += match[0].length;
                    return;
                }

                var index = match.index + match[OPENNING_GROUP].length;
                var text = match[0].substr(match[OPENNING_GROUP].length, match[0].length - match[ENDING_GROUP].length);

                var result = new ParsedResult({
                    text: text,
                    index: index,
                    ref: ref
                });

                if (text.match(/^\d\.\d$/)) return;
                if (text.match(/^\d\.\d{1,2}\.\d{1,2}$/)) return;

                // MM/dd -> OK
                // MM.dd -> NG
                if (!match[YEAR_GROUP] && match[0].indexOf('/') < 0) return;

                var date = null;
                var year = match[YEAR_GROUP] || moment(ref).year() + '';
                var month = match[MONTH_GROUP];
                var day = match[DAY_GROUP];

                day = parseInt(day);
                month = parseInt(month);
                year = parseInt(year);

                if (month < 1 || month > 12) {
                    if (month > 12) {
                        // dd/mm/yyyy date format if day looks like a month, and month looks like a day.
                        if (day >= 1 && day <= 12 && month >= 13 && month <= 31) {
                            // unambiguous
                            var tday = month;
                            month = day;
                            day = tday;
                        } else {
                            // both month and day are <= 12
                            return null;
                        }
                    }
                }
                if (day < 1 || day > 31) return null;

                if (year < 100) {
                    if (year > 50) {
                        year = year + 1900;
                    } else {
                        year = year + 2000;
                    }
                }

                result.start.assign('day', day);
                result.start.assign('month', month);
                result.start.assign('year', year);

                // Day of week
                if (match[WEEKDAY_GROUP]) {
                    result.start.assign('weekday', DAYS_OFFSET[match[WEEKDAY_GROUP].toLowerCase()]);
                }

                result.tags['FRSlashDateFormatParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 39: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = /(\W|^)il y a\s*([0-9]+|une?)\s*(minutes?|heures?|semaines?|jours?|mois|années?|ans?)(?=(?:\W|$))/i;

        exports.Parser = function FRTimeAgoFormatParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                if (match.index > 0 && text[match.index - 1].match(/\w/)) return null;

                var text = match[0];
                text = match[0].substr(match[1].length, match[0].length - match[1].length);
                index = match.index + match[1].length;

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });
                result.tags['FRTimeAgoFormatParser'] = true;

                var num = parseInt(match[2]);
                if (isNaN(num)) {
                    if (match[2].match(/demi/)) {
                        num = 0.5;
                    } else {
                        num = 1;
                    }
                }

                var date = moment(ref);

                if (match[3].match(/heure/) || match[3].match(/minute/)) {
                    if (match[3].match(/heure/)) {

                        date.add(-num, 'hour');
                    } else if (match[3].match(/minute/)) {

                        date.add(-num, 'minute');
                    }

                    result.start.imply('day', date.date());
                    result.start.imply('month', date.month() + 1);
                    result.start.imply('year', date.year());
                    result.start.assign('hour', date.hour());
                    result.start.assign('minute', date.minute());

                    return result;
                }

                if (match[3].match(/semaine/)) {
                    date.add(-num, 'week');

                    result.start.imply('day', date.date());
                    result.start.imply('month', date.month() + 1);
                    result.start.imply('year', date.year());
                    result.start.imply('weekday', date.day());
                    return result;
                }

                if (match[3].match(/jour/)) {
                    date.add(-num, 'd');
                }

                if (match[3].match(/mois/)) {
                    date.add(-num, 'month');
                }

                if (match[3].match(/années?|ans?/)) {

                    date.add(-num, 'year');
                }

                result.start.assign('day', date.date());
                result.start.assign('month', date.month() + 1);
                result.start.assign('year', date.year());
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 40: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var ParsedComponents = require('../../result').ParsedComponents;

        var FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" + "(?:(?:[àa])\\s*)?" + "(\\d{1,2}(?:h)?|midi|minuit)" + "(?:" + "(?:\\.|\\:|\\：|h)(\\d{1,2})(?:m)?" + "(?:" + "(?:\\:|\\：|m)(\\d{0,2})(?:s)?" + ")?" + ")?" + "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" + "(?=\\W|$)", 'i');

        var SECOND_REG_PATTERN = new RegExp("^\\s*" + "(\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*" + "(\\d{1,2}(?:h)?)" + "(?:" + "(?:\\.|\\:|\\：|h)(\\d{1,2})(?:m)?" + "(?:" + "(?:\\.|\\:|\\：|m)(\\d{1,2})(?:s)?" + ")?" + ")?" + "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" + "(?=\\W|$)", 'i');

        var HOUR_GROUP = 2;
        var MINUTE_GROUP = 3;
        var SECOND_GROUP = 4;
        var AM_PM_HOUR_GROUP = 5;

        exports.Parser = function FRTimeExpressionParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return FIRST_REG_PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                // This pattern can be overlaped Ex. [12] AM, 1[2] AM
                if (match.index > 0 && text[match.index - 1].match(/\w/)) return null;
                var refMoment = moment(ref);
                var result = new ParsedResult();
                result.ref = ref;
                result.index = match.index + match[1].length;
                result.text = match[0].substring(match[1].length);
                result.tags['FRTimeExpressionParser'] = true;

                result.start.imply('day', refMoment.date());
                result.start.imply('month', refMoment.month() + 1);
                result.start.imply('year', refMoment.year());

                var hour = 0;
                var minute = 0;
                var meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP] != null) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (second >= 60) return null;

                    result.start.assign('second', second);
                }

                // ----- Hours
                if (match[HOUR_GROUP].toLowerCase() == "midi") {
                    meridiem = 1;
                    hour = 12;
                } else if (match[HOUR_GROUP].toLowerCase() == "minuit") {
                    meridiem = 0;
                    hour = 0;
                } else {
                    hour = parseInt(match[HOUR_GROUP]);
                }

                // ----- Minutes
                if (match[MINUTE_GROUP] != null) {
                    minute = parseInt(match[MINUTE_GROUP]);
                } else if (hour > 100) {
                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM
                if (match[AM_PM_HOUR_GROUP] != null) {
                    if (hour > 12) return null;
                    var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                    if (ampm == "a") {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    }

                    if (ampm == "p") {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                }
                result.start.assign('hour', hour);
                result.start.assign('minute', minute);
                if (meridiem >= 0) {
                    result.start.assign('meridiem', meridiem);
                }

                // ==============================================================
                //                  Extracting the 'to' chunk
                // ==============================================================
                match = SECOND_REG_PATTERN.exec(text.substring(result.index + result.text.length));
                if (!match) {
                    // Not accept number only result
                    if (result.text.match(/^\d+$/)) {
                        return null;
                    }
                    return result;
                }

                // Pattern "YY.YY -XXXX" is more like timezone offset
                if (match[0].match(/^\s*(\+|\-)\s*\d{3,4}$/)) {
                    return result;
                }

                if (result.end == null) {
                    result.end = new ParsedComponents(null, result.start.date());
                }

                var hour = 0;
                var minute = 0;
                var meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP] != null) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (second >= 60) return null;

                    result.end.assign('second', second);
                }

                hour = parseInt(match[2]);

                // ----- Minute
                if (match[MINUTE_GROUP] != null) {

                    minute = parseInt(match[MINUTE_GROUP]);
                    if (minute >= 60) return result;
                } else if (hour > 100) {

                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM
                if (match[AM_PM_HOUR_GROUP] != null) {

                    if (hour > 12) return null;

                    if (match[AM_PM_HOUR_GROUP][0].toLowerCase() == "a") {
                        meridiem = 0;
                        if (hour == 12) {
                            hour = 0;
                            if (!result.end.isCertain('day')) {
                                result.end.imply('day', result.end.get('day') + 1);
                            }
                        }
                    }

                    if (match[AM_PM_HOUR_GROUP][0].toLowerCase() == "p") {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }

                    if (!result.start.isCertain('meridiem')) {
                        if (meridiem == 0) {

                            result.start.imply('meridiem', 0);

                            if (result.start.get('hour') == 12) {
                                result.start.assign('hour', 0);
                            }
                        } else {

                            result.start.imply('meridiem', 1);

                            if (result.start.get('hour') != 12) {
                                result.start.assign('hour', result.start.get('hour') + 12);
                            }
                        }
                    }
                } else if (hour >= 12) {
                    meridiem = 1;
                }

                result.text = result.text + match[0];
                result.end.assign('hour', hour);
                result.end.assign('minute', minute);
                if (meridiem >= 0) {
                    result.end.assign('meridiem', meridiem);
                }

                if (result.end.date().getTime() < result.start.date().getTime()) {
                    result.end.imply('day', result.end.get('day') + 1);
                }

                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 41: [function (require, module, exports) {
        /*
        
        
        */
        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var updateParsedComponent = require('../EN/ENWeekdayParser').updateParsedComponent;

        var DAYS_OFFSET = { 'dimanche': 0, 'dim': 0, 'lundi': 1, 'lun': 1, 'mardi': 2, 'mar': 2, 'mercredi': 3, 'mer': 3,
            'jeudi': 4, 'jeu': 4, 'vendredi': 5, 'ven': 5, 'samedi': 6, 'sam': 6 };

        var PATTERN = new RegExp('(\\s|^)' + '(?:(?:\\,|\\(|\\（)\\s*)?' + '(?:(ce)\\s*)?' + '(' + Object.keys(DAYS_OFFSET).join('|') + ')' + '(?:\\s*(?:\\,|\\)|\\）))?' + '(?:\\s*(dernier|prochain)\\s*)?' + '(?=\\W|$)', 'i');

        var PREFIX_GROUP = 2;
        var WEEKDAY_GROUP = 3;
        var POSTFIX_GROUP = 4;

        exports.Parser = function FRWeekdayParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var index = match.index + match[1].length;
                var text = match[0].substr(match[1].length, match[0].length - match[1].length);
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                var offset = DAYS_OFFSET[dayOfWeek];
                if (offset === undefined) return null;

                var modifier = null;
                var prefix = match[PREFIX_GROUP];
                var postfix = match[POSTFIX_GROUP];
                if (prefix || postfix) {
                    var norm = prefix || postfix;
                    norm = norm.toLowerCase();

                    if (norm == 'dernier') {
                        modifier = 'last';
                    } else if (norm == 'prochain') {
                        modifier = 'next';
                    } else if (norm == 'ce') {
                        modifier = 'this';
                    }
                }

                updateParsedComponent(result, ref, offset, modifier);
                result.tags['FRWeekdayParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../EN/ENWeekdayParser": 26, "../parser": 49, "moment": 72 }], 42: [function (require, module, exports) {
        /*
            
            
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = /今日|当日|昨日|明日|今夜|今夕|今晩|今朝/i;

        exports.Parser = function JPCasualDateParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var index = match.index;
                var text = match[0];
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var refMoment = moment(ref);
                var startMoment = refMoment.clone();

                if (text == '今夜' || text == '今夕' || text == '今晩') {
                    // Normally means this coming midnight 
                    result.start.imply('hour', 22);
                    result.start.imply('meridiem', 1);
                } else if (text == '明日') {

                    // Check not "Tomorrow" on late night
                    if (refMoment.hour() > 4) {
                        startMoment.add(1, 'day');
                    }
                } else if (text == '昨日') {

                    startMoment.add(-1, 'day');
                } else if (text.match("今朝")) {

                    result.start.imply('hour', 6);
                    result.start.imply('meridiem', 0);
                }

                result.start.assign('day', startMoment.date());
                result.start.assign('month', startMoment.month() + 1);
                result.start.assign('year', startMoment.year());
                result.tags['JPCasualDateParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 43: [function (require, module, exports) {
        /*
            
            
        */

        var moment = require('moment');

        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var util = require('../../utils/JP');
        var PATTERN = /(?:(同|((昭和|平成)?([0-9０-９]{2,4})))年\s*)?([0-9０-９]{1,2})月\s*([0-9０-９]{1,2})日/i;

        var YEAR_GROUP = 2;
        var ERA_GROUP = 3;
        var YEAR_NUMBER_GROUP = 4;
        var MONTH_GROUP = 5;
        var DAY_GROUP = 6;

        exports.Parser = function JPStandardParser() {
            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                var startMoment = moment(ref);
                var result = new ParsedResult({
                    text: match[0],
                    index: match.index,
                    ref: ref
                });

                var month = match[MONTH_GROUP];
                month = util.toHankaku(month);
                month = parseInt(month);

                var day = match[DAY_GROUP];
                day = util.toHankaku(day);
                day = parseInt(day);

                startMoment.set('date', day);
                startMoment.set('month', month - 1);
                result.start.assign('day', startMoment.date());
                result.start.assign('month', startMoment.month() + 1);

                if (!match[YEAR_GROUP]) {

                    //Find the most appropriated year
                    startMoment.year(moment(ref).year());
                    var nextYear = startMoment.clone().add(1, 'y');
                    var lastYear = startMoment.clone().add(-1, 'y');
                    if (Math.abs(nextYear.diff(moment(ref))) < Math.abs(startMoment.diff(moment(ref)))) {
                        startMoment = nextYear;
                    } else if (Math.abs(lastYear.diff(moment(ref))) < Math.abs(startMoment.diff(moment(ref)))) {
                        startMoment = lastYear;
                    }

                    result.start.assign('day', startMoment.date());
                    result.start.assign('month', startMoment.month() + 1);
                    result.start.imply('year', startMoment.year());
                } else if (match[YEAR_GROUP].match('同年')) {

                    result.start.assign('year', startMoment.year());
                } else {
                    var year = match[YEAR_NUMBER_GROUP];
                    year = util.toHankaku(year);
                    year = parseInt(year);

                    if (match[ERA_GROUP] == '平成') {
                        year += 1988;
                    } else if (match[ERA_GROUP] == '昭和') {
                        year += 1925;
                    }

                    result.start.assign('year', year);
                }

                result.tags['JPStandardParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/JP": 69, "../parser": 49, "moment": 72 }], 44: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var PATTERN = new RegExp('(而家|立(?:刻|即)|即刻)|' + '(今|明|聽|昨|尋|琴)(早|朝|晚)|' + '(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|' + '(今|明|聽|昨|尋|琴)(?:日|天)' + '(?:[\\s|,|，]*)' + '(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?', 'i');

        var NOW_GROUP = 1;
        var DAY_GROUP_1 = 2;
        var TIME_GROUP_1 = 3;
        var TIME_GROUP_2 = 4;
        var DAY_GROUP_3 = 5;
        var TIME_GROUP_3 = 6;

        exports.Parser = function ZHHantCasualDateParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                text = match[0];
                var index = match.index;
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var refMoment = moment(ref);
                var startMoment = refMoment.clone();

                if (match[NOW_GROUP]) {
                    result.start.imply('hour', refMoment.hour());
                    result.start.imply('minute', refMoment.minute());
                    result.start.imply('second', refMoment.second());
                    result.start.imply('millisecond', refMoment.millisecond());
                } else if (match[DAY_GROUP_1]) {
                    var day1 = match[DAY_GROUP_1];
                    var time1 = match[TIME_GROUP_1];

                    if (day1 == '明' || day1 == '聽') {
                        // Check not "Tomorrow" on late night
                        if (refMoment.hour() > 1) {
                            startMoment.add(1, 'day');
                        }
                    } else if (day1 == '昨' || day1 == '尋' || day1 == '琴') {
                        startMoment.add(-1, 'day');
                    }

                    if (time1 == '早' || time1 == '朝') {
                        result.start.imply('hour', 6);
                    } else if (time1 == '晚') {
                        result.start.imply('hour', 22);
                        result.start.imply('meridiem', 1);
                    }
                } else if (match[TIME_GROUP_2]) {
                    var timeString2 = match[TIME_GROUP_2];
                    var time2 = timeString2[0];
                    if (time2 == '早' || time2 == '朝' || time2 == '上') {
                        result.start.imply('hour', 6);
                    } else if (time2 == '下' || time2 == '晏') {
                        result.start.imply('hour', 15);
                        result.start.imply('meridiem', 1);
                    } else if (time2 == '中') {
                        result.start.imply('hour', 12);
                        result.start.imply('meridiem', 1);
                    } else if (time2 == '夜' || time2 == '晚') {
                        result.start.imply('hour', 22);
                        result.start.imply('meridiem', 1);
                    } else if (time2 == '凌') {
                        result.start.imply('hour', 0);
                    }
                } else if (match[DAY_GROUP_3]) {
                    var day3 = match[DAY_GROUP_3];

                    if (day3 == '明' || day3 == '聽') {
                        // Check not "Tomorrow" on late night
                        if (refMoment.hour() > 1) {
                            startMoment.add(1, 'day');
                        }
                    } else if (day3 == '昨' || day3 == '尋' || day3 == '琴') {
                        startMoment.add(-1, 'day');
                    }

                    var timeString3 = match[TIME_GROUP_3];
                    if (timeString3) {
                        var time3 = timeString3[0];
                        if (time3 == '早' || time3 == '朝' || time3 == '上') {
                            result.start.imply('hour', 6);
                        } else if (time3 == '下' || time3 == '晏') {
                            result.start.imply('hour', 15);
                            result.start.imply('meridiem', 1);
                        } else if (time3 == '中') {
                            result.start.imply('hour', 12);
                            result.start.imply('meridiem', 1);
                        } else if (time3 == '夜' || time3 == '晚') {
                            result.start.imply('hour', 22);
                            result.start.imply('meridiem', 1);
                        } else if (time3 == '凌') {
                            result.start.imply('hour', 0);
                        }
                    }
                }

                result.start.assign('day', startMoment.date());
                result.start.assign('month', startMoment.month() + 1);
                result.start.assign('year', startMoment.year());
                result.tags.ZHHantCasualDateParser = true;
                return result;
            };
        };
    }, { "../../result": 64, "../parser": 49, "moment": 72 }], 45: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var util = require('../../utils/ZH-Hant.js');

        var PATTERN = new RegExp('(\\d{2,4}|[' + Object.keys(util.NUMBER).join('') + ']{2,4})?' + '(?:\\s*)' + '(?:年)?' + '(?:[\\s|,|，]*)' + '(\\d{1,2}|[' + Object.keys(util.NUMBER).join('') + ']{1,2})' + '(?:\\s*)' + '(?:月)' + '(?:\\s*)' + '(\\d{1,2}|[' + Object.keys(util.NUMBER).join('') + ']{1,2})?' + '(?:\\s*)' + '(?:日|號)?');

        var YEAR_GROUP = 1;
        var MONTH_GROUP = 2;
        var DAY_GROUP = 3;

        exports.Parser = function ZHHantDateParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var startMoment = moment(ref);
                var result = new ParsedResult({
                    text: match[0],
                    index: match.index,
                    ref: ref
                });

                //Month
                var month = parseInt(match[MONTH_GROUP]);
                if (isNaN(month)) month = util.zhStringToNumber(match[MONTH_GROUP]);
                result.start.assign('month', month);

                //Day
                if (match[DAY_GROUP]) {
                    var day = parseInt(match[DAY_GROUP]);
                    if (isNaN(day)) day = util.zhStringToNumber(match[DAY_GROUP]);
                    result.start.assign('day', day);
                } else {
                    result.start.imply('day', startMoment.date());
                }

                //Year
                if (match[YEAR_GROUP]) {
                    var year = parseInt(match[YEAR_GROUP]);
                    if (isNaN(year)) year = util.zhStringToYear(match[YEAR_GROUP]);
                    result.start.assign('year', year);
                } else {
                    result.start.imply('year', startMoment.year());
                }

                result.tags.ZHHantDateParser = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/ZH-Hant.js": 70, "../parser": 49, "moment": 72 }], 46: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;

        var util = require('../../utils/ZH-Hant.js');

        var PATTERN = new RegExp('(\\d+|[' + Object.keys(util.NUMBER).join('') + ']+|半|幾)(?:\\s*)' + '(?:個)?' + '(秒(?:鐘)?|分鐘|小時|鐘|日|天|星期|禮拜|月|年)' + '(?:(?:之|過)?後|(?:之)?內)', 'i');

        var NUMBER_GROUP = 1;
        var UNIT_GROUP = 2;

        exports.Parser = function ZHHantCasualDateParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var index = match.index;
                text = match[0];

                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var number = parseInt(match[NUMBER_GROUP]);
                if (isNaN(number)) {
                    number = util.zhStringToNumber(match[NUMBER_GROUP]);
                }

                if (isNaN(number)) {
                    var string = match[NUMBER_GROUP];
                    if (string === '幾') {
                        number = 3;
                    } else if (string === '半') {
                        number = 0.5;
                    } else {

                        //just in case
                        return null;
                    }
                }

                var date = moment(ref);
                var unit = match[UNIT_GROUP];
                var unitAbbr = unit[0];

                if (unitAbbr.match(/[日天星禮月年]/)) {
                    if (unitAbbr == '日' || unitAbbr == '天') {
                        date.add(number, 'd');
                    } else if (unitAbbr == '星' || unitAbbr == '禮') {
                        date.add(number * 7, 'd');
                    } else if (unitAbbr == '月') {
                        date.add(number, 'month');
                    } else if (unitAbbr == '年') {
                        date.add(number, 'year');
                    }

                    result.start.assign('year', date.year());
                    result.start.assign('month', date.month() + 1);
                    result.start.assign('day', date.date());
                    return result;
                }

                if (unitAbbr == '秒') {
                    date.add(number, 'second');
                } else if (unitAbbr == '分') {
                    date.add(number, 'minute');
                } else if (unitAbbr == '小' || unitAbbr == '鐘') {
                    date.add(number, 'hour');
                }

                result.start.imply('year', date.year());
                result.start.imply('month', date.month() + 1);
                result.start.imply('day', date.date());
                result.start.assign('hour', date.hour());
                result.start.assign('minute', date.minute());
                result.start.assign('second', date.second());
                result.tags.ZHHantDeadlineFormatParser = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/ZH-Hant.js": 70, "../parser": 49, "moment": 72 }], 47: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var ParsedComponents = require('../../result').ParsedComponents;

        var util = require('../../utils/ZH-Hant.js');

        var patternString1 = '(?:由|從|自)?' + '(?:' + '(今|明|聽|昨|尋|琴)(早|朝|晚)|' + '(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|' + '(今|明|聽|昨|尋|琴)(?:日|天)' + '(?:[\\s,，]*)' + '(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?' + ')?' + '(?:[\\s,，]*)' + '(?:(\\d+|[' + Object.keys(util.NUMBER).join('') + ']+)(?:\\s*)(?:點|時|:|：)' + '(?:\\s*)' + '(\\d+|半|正|整|[' + Object.keys(util.NUMBER).join('') + ']+)?(?:\\s*)(?:分|:|：)?' + '(?:\\s*)' + '(\\d+|[' + Object.keys(util.NUMBER).join('') + ']+)?(?:\\s*)(?:秒)?)' + '(?:\\s*(A\.M\.|P\.M\.|AM?|PM?))?';

        var patternString2 = '(?:\\s*(?:到|至|\\-|\\–|\\~|\\〜)\\s*)' + '(?:' + '(今|明|聽|昨|尋|琴)(早|朝|晚)|' + '(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|' + '(今|明|聽|昨|尋|琴)(?:日|天)' + '(?:[\\s,，]*)' + '(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?' + ')?' + '(?:[\\s,，]*)' + '(?:(\\d+|[' + Object.keys(util.NUMBER).join('') + ']+)(?:\\s*)(?:點|時|:|：)' + '(?:\\s*)' + '(\\d+|半|正|整|[' + Object.keys(util.NUMBER).join('') + ']+)?(?:\\s*)(?:分|:|：)?' + '(?:\\s*)' + '(\\d+|[' + Object.keys(util.NUMBER).join('') + ']+)?(?:\\s*)(?:秒)?)' + '(?:\\s*(A\.M\.|P\.M\.|AM?|PM?))?';

        var FIRST_REG_PATTERN = new RegExp(patternString1, 'i');
        var SECOND_REG_PATTERN = new RegExp(patternString2, 'i');

        var DAY_GROUP_1 = 1;
        var ZH_AM_PM_HOUR_GROUP_1 = 2;
        var ZH_AM_PM_HOUR_GROUP_2 = 3;
        var DAY_GROUP_3 = 4;
        var ZH_AM_PM_HOUR_GROUP_3 = 5;
        var HOUR_GROUP = 6;
        var MINUTE_GROUP = 7;
        var SECOND_GROUP = 8;
        var AM_PM_HOUR_GROUP = 9;

        exports.Parser = function ZHHantTimeExpressionParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return FIRST_REG_PATTERN;
            };

            this.extract = function (text, ref, match, opt) {

                // This pattern can be overlaped Ex. [12] AM, 1[2] AM
                if (match.index > 0 && text[match.index - 1].match(/\w/)) return null;
                var refMoment = moment(ref);
                var result = new ParsedResult();
                result.ref = ref;
                result.index = match.index;
                result.text = match[0];
                result.tags.ZHTimeExpressionParser = true;

                var startMoment = refMoment.clone();

                // ----- Day
                if (match[DAY_GROUP_1]) {
                    var day1 = match[DAY_GROUP_1];
                    if (day1 == '明' || day1 == '聽') {
                        // Check not "Tomorrow" on late night
                        if (refMoment.hour() > 1) {
                            startMoment.add(1, 'day');
                        }
                    } else if (day1 == '昨' || day1 == '尋' || day1 == '琴') {
                        startMoment.add(-1, 'day');
                    }
                    result.start.assign('day', startMoment.date());
                    result.start.assign('month', startMoment.month() + 1);
                    result.start.assign('year', startMoment.year());
                } else if (match[DAY_GROUP_3]) {
                    var day3 = match[DAY_GROUP_3];
                    if (day3 == '明' || day3 == '聽') {
                        startMoment.add(1, 'day');
                    } else if (day3 == '昨' || day3 == '尋' || day3 == '琴') {
                        startMoment.add(-1, 'day');
                    }
                    result.start.assign('day', startMoment.date());
                    result.start.assign('month', startMoment.month() + 1);
                    result.start.assign('year', startMoment.year());
                } else {
                    result.start.imply('day', startMoment.date());
                    result.start.imply('month', startMoment.month() + 1);
                    result.start.imply('year', startMoment.year());
                }

                var hour = 0;
                var minute = 0;
                var meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP]) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (isNaN(second)) {
                        second = util.zhStringToNumber(match[SECOND_GROUP]);
                    }
                    if (second >= 60) return null;
                    result.start.assign('second', second);
                }

                hour = parseInt(match[HOUR_GROUP]);
                if (isNaN(hour)) {
                    hour = util.zhStringToNumber(match[HOUR_GROUP]);
                }

                // ----- Minutes
                if (match[MINUTE_GROUP]) {
                    if (match[MINUTE_GROUP] == '半') {
                        minute = 30;
                    } else if (match[MINUTE_GROUP] == '正' || match[MINUTE_GROUP] == '整') {
                        minute = 0;
                    } else {
                        minute = parseInt(match[MINUTE_GROUP]);
                        if (isNaN(minute)) {
                            minute = util.zhStringToNumber(match[MINUTE_GROUP]);
                        }
                    }
                } else if (hour > 100) {
                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM
                if (match[AM_PM_HOUR_GROUP]) {
                    if (hour > 12) return null;
                    var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                    if (ampm == "a") {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    }

                    if (ampm == "p") {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                } else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
                    var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
                    var zhAMPM1 = zhAMPMString1[0];
                    if (zhAMPM1 == '朝' || zhAMPM1 == '早') {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    } else if (zhAMPM1 == '晚') {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                } else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
                    var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
                    var zhAMPM2 = zhAMPMString2[0];
                    if (zhAMPM2 == '上' || zhAMPM2 == '朝' || zhAMPM2 == '早' || zhAMPM2 == '凌') {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    } else if (zhAMPM2 == '下' || zhAMPM2 == '晏' || zhAMPM2 == '晚') {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                } else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
                    var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
                    var zhAMPM3 = zhAMPMString3[0];
                    if (zhAMPM3 == '上' || zhAMPM3 == '朝' || zhAMPM3 == '早' || zhAMPM3 == '凌') {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    } else if (zhAMPM3 == '下' || zhAMPM3 == '晏' || zhAMPM3 == '晚') {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                }

                result.start.assign('hour', hour);
                result.start.assign('minute', minute);

                if (meridiem >= 0) {
                    result.start.assign('meridiem', meridiem);
                } else {
                    if (hour < 12) {
                        result.start.imply('meridiem', 0);
                    } else {
                        result.start.imply('meridiem', 1);
                    }
                }

                // ==============================================================
                //                  Extracting the 'to' chunk
                // ==============================================================

                match = SECOND_REG_PATTERN.exec(text.substring(result.index + result.text.length));
                if (!match) {
                    // Not accept number only result
                    if (result.text.match(/^\d+$/)) {
                        return null;
                    }
                    return result;
                }

                var endMoment = startMoment.clone();
                result.end = new ParsedComponents(null, null);

                // ----- Day
                if (match[DAY_GROUP_1]) {
                    var day1 = match[DAY_GROUP_1];
                    if (day1 == '明' || day1 == '聽') {
                        // Check not "Tomorrow" on late night
                        if (refMoment.hour() > 1) {
                            endMoment.add(1, 'day');
                        }
                    } else if (day1 == '昨' || day1 == '尋' || day1 == '琴') {
                        endMoment.add(-1, 'day');
                    }
                    result.end.assign('day', endMoment.date());
                    result.end.assign('month', endMoment.month() + 1);
                    result.end.assign('year', endMoment.year());
                } else if (match[DAY_GROUP_3]) {
                    var day3 = match[DAY_GROUP_3];
                    if (day3 == '明' || day3 == '聽') {
                        endMoment.add(1, 'day');
                    } else if (day3 == '昨' || day3 == '尋' || day3 == '琴') {
                        endMoment.add(-1, 'day');
                    }
                    result.end.assign('day', endMoment.date());
                    result.end.assign('month', endMoment.month() + 1);
                    result.end.assign('year', endMoment.year());
                } else {
                    result.end.imply('day', endMoment.date());
                    result.end.imply('month', endMoment.month() + 1);
                    result.end.imply('year', endMoment.year());
                }

                hour = 0;
                minute = 0;
                meridiem = -1;

                // ----- Second
                if (match[SECOND_GROUP]) {
                    var second = parseInt(match[SECOND_GROUP]);
                    if (isNaN(second)) {
                        second = util.zhStringToNumber(match[SECOND_GROUP]);
                    }

                    if (second >= 60) return null;
                    result.end.assign('second', second);
                }

                hour = parseInt(match[HOUR_GROUP]);
                if (isNaN(hour)) {
                    hour = util.zhStringToNumber(match[HOUR_GROUP]);
                }

                // ----- Minutes
                if (match[MINUTE_GROUP]) {
                    if (match[MINUTE_GROUP] == '半') {
                        minute = 30;
                    } else if (match[MINUTE_GROUP] == '正' || match[MINUTE_GROUP] == '整') {
                        minute = 0;
                    } else {
                        minute = parseInt(match[MINUTE_GROUP]);
                        if (isNaN(minute)) {
                            minute = util.zhStringToNumber(match[MINUTE_GROUP]);
                        }
                    }
                } else if (hour > 100) {
                    minute = hour % 100;
                    hour = parseInt(hour / 100);
                }

                if (minute >= 60) {
                    return null;
                }

                if (hour > 24) {
                    return null;
                }
                if (hour >= 12) {
                    meridiem = 1;
                }

                // ----- AM & PM
                if (match[AM_PM_HOUR_GROUP]) {
                    if (hour > 12) return null;
                    var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                    if (ampm == "a") {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    }

                    if (ampm == "p") {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }

                    if (!result.start.isCertain('meridiem')) {
                        if (meridiem == 0) {

                            result.start.imply('meridiem', 0);

                            if (result.start.get('hour') == 12) {
                                result.start.assign('hour', 0);
                            }
                        } else {

                            result.start.imply('meridiem', 1);

                            if (result.start.get('hour') != 12) {
                                result.start.assign('hour', result.start.get('hour') + 12);
                            }
                        }
                    }
                } else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
                    var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
                    var zhAMPM1 = zhAMPMString1[0];
                    if (zhAMPM1 == '朝' || zhAMPM1 == '早') {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    } else if (zhAMPM1 == '晚') {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                } else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
                    var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
                    var zhAMPM2 = zhAMPMString2[0];
                    if (zhAMPM2 == '上' || zhAMPM2 == '朝' || zhAMPM2 == '早' || zhAMPM2 == '凌') {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    } else if (zhAMPM2 == '下' || zhAMPM2 == '晏' || zhAMPM2 == '晚') {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                } else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
                    var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
                    var zhAMPM3 = zhAMPMString3[0];
                    if (zhAMPM3 == '上' || zhAMPM3 == '朝' || zhAMPM3 == '早' || zhAMPM3 == '凌') {
                        meridiem = 0;
                        if (hour == 12) hour = 0;
                    } else if (zhAMPM3 == '下' || zhAMPM3 == '晏' || zhAMPM3 == '晚') {
                        meridiem = 1;
                        if (hour != 12) hour += 12;
                    }
                }

                result.text = result.text + match[0];
                result.end.assign('hour', hour);
                result.end.assign('minute', minute);
                if (meridiem >= 0) {
                    result.end.assign('meridiem', meridiem);
                } else {
                    var startAtPM = result.start.isCertain('meridiem') && result.start.get('meridiem') == 1;
                    if (startAtPM && result.start.get('hour') > hour) {
                        // 10pm - 1 (am)
                        result.end.imply('meridiem', 0);
                    } else if (hour > 12) {
                        result.end.imply('meridiem', 1);
                    }
                }

                if (result.end.date().getTime() < result.start.date().getTime()) {
                    result.end.imply('day', result.end.get('day') + 1);
                }

                return result;
            };
        };
    }, { "../../result": 64, "../../utils/ZH-Hant.js": 70, "../parser": 49, "moment": 72 }], 48: [function (require, module, exports) {
        /*
        
        
        */

        var moment = require('moment');
        var Parser = require('../parser').Parser;
        var ParsedResult = require('../../result').ParsedResult;
        var updateParsedComponent = require('../EN/ENWeekdayParser').updateParsedComponent;

        var util = require('../../utils/ZH-Hant.js');

        var PATTERN = new RegExp('(上|今|下|這|呢)?' + '(?:個)?' + '(?:星期|禮拜)' + '(' + Object.keys(util.WEEKDAY_OFFSET).join('|') + ')');

        var PREFIX_GROUP = 1;
        var WEEKDAY_GROUP = 2;

        exports.Parser = function ZHHantWeekdayParser() {

            Parser.apply(this, arguments);

            this.pattern = function () {
                return PATTERN;
            };

            this.extract = function (text, ref, match, opt) {
                var index = match.index;
                text = match[0];
                var result = new ParsedResult({
                    index: index,
                    text: text,
                    ref: ref
                });

                var dayOfWeek = match[WEEKDAY_GROUP];
                var offset = util.WEEKDAY_OFFSET[dayOfWeek];
                if (offset === undefined) return null;

                var modifier = null;
                var prefix = match[PREFIX_GROUP];

                if (prefix == '上') {
                    modifier = 'last';
                } else if (prefix == '下') {
                    modifier = 'next';
                } else if (prefix == '今' || prefix == '這' || prefix == '呢') {
                    modifier = 'this';
                }

                updateParsedComponent(result, ref, offset, modifier);
                result.tags['ZHHantWeekdayParser'] = true;
                return result;
            };
        };
    }, { "../../result": 64, "../../utils/ZH-Hant.js": 70, "../EN/ENWeekdayParser": 26, "../parser": 49, "moment": 72 }], 49: [function (require, module, exports) {

        function Parser(config) {

            config = config || {};
            var strictMode = config.strict;

            this.isStrictMode = function () {
                return strictMode == true;
            };

            this.pattern = function () {
                return (/./i
                );
            };

            this.extract = function (text, ref, match, opt) {
                return null;
            };

            this.execute = function (text, ref, opt) {

                var results = [];
                var regex = this.pattern();

                var remainingText = text;
                var match = regex.exec(remainingText);

                while (match) {

                    // Calculate match index on the full text;
                    match.index += text.length - remainingText.length;

                    var result = this.extract(text, ref, match, opt);
                    if (result) {

                        // If success, start from the end of the result
                        remainingText = text.substring(result.index + result.text.length);

                        if (!this.isStrictMode() || result.hasPossibleDates()) {
                            results.push(result);
                        }
                    } else {
                        // If fail, move on by 1
                        remainingText = text.substring(match.index + 1);
                    }

                    match = regex.exec(remainingText);
                }

                if (this.refiners) {
                    this.refiners.forEach(function () {
                        results = refiner.refine(results, text, options);
                    });
                }

                return results;
            };
        }

        exports.Parser = Parser;

        exports.ENISOFormatParser = require('./EN/ENISOFormatParser').Parser;
        exports.ENDeadlineFormatParser = require('./EN/ENDeadlineFormatParser').Parser;
        exports.ENRelativeDateFormatParser = require('./EN/ENRelativeDateFormatParser').Parser;
        exports.ENMonthNameLittleEndianParser = require('./EN/ENMonthNameLittleEndianParser').Parser;
        exports.ENMonthNameMiddleEndianParser = require('./EN/ENMonthNameMiddleEndianParser').Parser;
        exports.ENMonthNameParser = require('./EN/ENMonthNameParser').Parser;
        exports.ENSlashDateFormatParser = require('./EN/ENSlashDateFormatParser').Parser;
        exports.ENSlashDateFormatStartWithYearParser = require('./EN/ENSlashDateFormatStartWithYearParser').Parser;
        exports.ENSlashMonthFormatParser = require('./EN/ENSlashMonthFormatParser').Parser;
        exports.ENTimeAgoFormatParser = require('./EN/ENTimeAgoFormatParser').Parser;
        exports.ENTimeExpressionParser = require('./EN/ENTimeExpressionParser').Parser;
        exports.ENTimeFromNowFormatParser = require('./EN/ENTimeFromNowFormatParser').Parser;
        exports.ENWeekdayParser = require('./EN/ENWeekdayParser').Parser;
        exports.ENCasualDateParser = require('./EN/ENCasualDateParser').Parser;
        exports.ENCasualTimeParser = require('./EN/ENCasualTimeParser').Parser;

        exports.JPStandardParser = require('./JP/JPStandardParser').Parser;
        exports.JPCasualDateParser = require('./JP/JPCasualDateParser').Parser;

        exports.ESCasualDateParser = require('./ES/ESCasualDateParser').Parser;
        exports.ESDeadlineFormatParser = require('./ES/ESDeadlineFormatParser').Parser;
        exports.ESTimeAgoFormatParser = require('./ES/ESTimeAgoFormatParser').Parser;
        exports.ESTimeExpressionParser = require('./ES/ESTimeExpressionParser').Parser;
        exports.ESWeekdayParser = require('./ES/ESWeekdayParser').Parser;
        exports.ESMonthNameLittleEndianParser = require('./ES/ESMonthNameLittleEndianParser').Parser;
        exports.ESSlashDateFormatParser = require('./ES/ESSlashDateFormatParser').Parser;

        exports.FRCasualDateParser = require('./FR/FRCasualDateParser').Parser;
        exports.FRDeadlineFormatParser = require('./FR/FRDeadlineFormatParser').Parser;
        exports.FRMonthNameLittleEndianParser = require('./FR/FRMonthNameLittleEndianParser').Parser;
        exports.FRSlashDateFormatParser = require('./FR/FRSlashDateFormatParser').Parser;
        exports.FRTimeAgoFormatParser = require('./FR/FRTimeAgoFormatParser').Parser;
        exports.FRTimeExpressionParser = require('./FR/FRTimeExpressionParser').Parser;
        exports.FRWeekdayParser = require('./FR/FRWeekdayParser').Parser;
        exports.FRRelativeDateFormatParser = require('./FR/FRRelativeDateFormatParser').Parser;

        exports.ZHHantDateParser = require('./ZH-Hant/ZHHantDateParser').Parser;
        exports.ZHHantWeekdayParser = require('./ZH-Hant/ZHHantWeekdayParser').Parser;
        exports.ZHHantTimeExpressionParser = require('./ZH-Hant/ZHHantTimeExpressionParser').Parser;
        exports.ZHHantCasualDateParser = require('./ZH-Hant/ZHHantCasualDateParser').Parser;
        exports.ZHHantDeadlineFormatParser = require('./ZH-Hant/ZHHantDeadlineFormatParser').Parser;

        exports.DEDeadlineFormatParser = require('./DE/DEDeadlineFormatParser').Parser;
        exports.DEMonthNameLittleEndianParser = require('./DE/DEMonthNameLittleEndianParser').Parser;
        exports.DEMonthNameParser = require('./DE/DEMonthNameParser').Parser;
        exports.DESlashDateFormatParser = require('./DE/DESlashDateFormatParser').Parser;
        exports.DETimeAgoFormatParser = require('./DE/DETimeAgoFormatParser').Parser;
        exports.DETimeExpressionParser = require('./DE/DETimeExpressionParser').Parser;
        exports.DEWeekdayParser = require('./DE/DEWeekdayParser').Parser;
        exports.DECasualDateParser = require('./DE/DECasualDateParser').Parser;
    }, { "./DE/DECasualDateParser": 4, "./DE/DEDeadlineFormatParser": 5, "./DE/DEMonthNameLittleEndianParser": 6, "./DE/DEMonthNameParser": 7, "./DE/DESlashDateFormatParser": 8, "./DE/DETimeAgoFormatParser": 9, "./DE/DETimeExpressionParser": 10, "./DE/DEWeekdayParser": 11, "./EN/ENCasualDateParser": 12, "./EN/ENCasualTimeParser": 13, "./EN/ENDeadlineFormatParser": 14, "./EN/ENISOFormatParser": 15, "./EN/ENMonthNameLittleEndianParser": 16, "./EN/ENMonthNameMiddleEndianParser": 17, "./EN/ENMonthNameParser": 18, "./EN/ENRelativeDateFormatParser": 19, "./EN/ENSlashDateFormatParser": 20, "./EN/ENSlashDateFormatStartWithYearParser": 21, "./EN/ENSlashMonthFormatParser": 22, "./EN/ENTimeAgoFormatParser": 23, "./EN/ENTimeExpressionParser": 24, "./EN/ENTimeFromNowFormatParser": 25, "./EN/ENWeekdayParser": 26, "./ES/ESCasualDateParser": 27, "./ES/ESDeadlineFormatParser": 28, "./ES/ESMonthNameLittleEndianParser": 29, "./ES/ESSlashDateFormatParser": 30, "./ES/ESTimeAgoFormatParser": 31, "./ES/ESTimeExpressionParser": 32, "./ES/ESWeekdayParser": 33, "./FR/FRCasualDateParser": 34, "./FR/FRDeadlineFormatParser": 35, "./FR/FRMonthNameLittleEndianParser": 36, "./FR/FRRelativeDateFormatParser": 37, "./FR/FRSlashDateFormatParser": 38, "./FR/FRTimeAgoFormatParser": 39, "./FR/FRTimeExpressionParser": 40, "./FR/FRWeekdayParser": 41, "./JP/JPCasualDateParser": 42, "./JP/JPStandardParser": 43, "./ZH-Hant/ZHHantCasualDateParser": 44, "./ZH-Hant/ZHHantDateParser": 45, "./ZH-Hant/ZHHantDeadlineFormatParser": 46, "./ZH-Hant/ZHHantTimeExpressionParser": 47, "./ZH-Hant/ZHHantWeekdayParser": 48 }], 50: [function (require, module, exports) {
        /*
          
        */
        var ENMergeDateRangeRefiner = require('../EN/ENMergeDateRangeRefiner').Refiner;

        exports.Refiner = function DEMergeDateRangeRefiner() {
            ENMergeDateRangeRefiner.call(this);

            this.pattern = function () {
                return (/^\s*(bis(?:\s*(?:am|zum))?|\-)\s*$/i
                );
            };
        };
    }, { "../EN/ENMergeDateRangeRefiner": 52 }], 51: [function (require, module, exports) {
        /*
            
        */
        var ParsedComponents = require('../../result').ParsedComponents;
        var Refiner = require('../refiner').Refiner;

        var mergeDateTimeComponent = require('../EN/ENMergeDateTimeRefiner').mergeDateTimeComponent;
        var isDateOnly = require('../EN/ENMergeDateTimeRefiner').isDateOnly;
        var isTimeOnly = require('../EN/ENMergeDateTimeRefiner').isTimeOnly;

        var PATTERN = new RegExp("^\\s*(T|um|am|,|-)?\\s*$");

        function isAbleToMerge(text, prevResult, curResult) {
            var textBetween = text.substring(prevResult.index + prevResult.text.length, curResult.index);
            return textBetween.match(PATTERN);
        }

        function mergeResult(text, dateResult, timeResult) {

            var beginDate = dateResult.start;
            var beginTime = timeResult.start;
            var beginDateTime = mergeDateTimeComponent(beginDate, beginTime);

            if (dateResult.end != null || timeResult.end != null) {

                var endDate = dateResult.end == null ? dateResult.start : dateResult.end;
                var endTime = timeResult.end == null ? timeResult.start : timeResult.end;
                var endDateTime = mergeDateTimeComponent(endDate, endTime);

                if (dateResult.end == null && endDateTime.date().getTime() < beginDateTime.date().getTime()) {
                    // Ex. 9pm - 1am
                    if (endDateTime.isCertain('day')) {
                        endDateTime.assign('day', endDateTime.get('day') + 1);
                    } else {
                        endDateTime.imply('day', endDateTime.get('day') + 1);
                    }
                }

                dateResult.end = endDateTime;
            }

            dateResult.start = beginDateTime;

            var startIndex = Math.min(dateResult.index, timeResult.index);
            var endIndex = Math.max(dateResult.index + dateResult.text.length, timeResult.index + timeResult.text.length);

            dateResult.index = startIndex;
            dateResult.text = text.substring(startIndex, endIndex);

            for (var tag in timeResult.tags) {
                dateResult.tags[tag] = true;
            }
            dateResult.tags['DEMergeDateAndTimeRefiner'] = true;
            return dateResult;
        }

        exports.Refiner = function DEMergeDateTimeRefiner() {
            Refiner.call(this);

            this.refine = function (text, results, opt) {

                if (results.length < 2) return results;

                var mergedResult = [];
                var currResult = null;
                var prevResult = null;

                for (var i = 1; i < results.length; i++) {

                    currResult = results[i];
                    prevResult = results[i - 1];

                    if (isDateOnly(prevResult) && isTimeOnly(currResult) && isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = mergeResult(text, prevResult, currResult);
                        currResult = null;
                        i += 1;
                    } else if (isDateOnly(currResult) && isTimeOnly(prevResult) && isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = mergeResult(text, currResult, prevResult);
                        currResult = null;
                        i += 1;
                    }

                    mergedResult.push(prevResult);
                }

                if (currResult != null) {
                    mergedResult.push(currResult);
                }

                return mergedResult;
            };
        };
    }, { "../../result": 64, "../EN/ENMergeDateTimeRefiner": 53, "../refiner": 63 }], 52: [function (require, module, exports) {
        /*
          
        */
        var Refiner = require('../refiner').Refiner;

        exports.Refiner = function ENMergeDateRangeRefiner() {
            Refiner.call(this);

            this.pattern = function () {
                return (/^\s*(to|\-)\s*$/i
                );
            };

            this.refine = function (text, results, opt) {

                if (results.length < 2) return results;

                var mergedResult = [];
                var currResult = null;
                var prevResult = null;

                for (var i = 1; i < results.length; i++) {

                    currResult = results[i];
                    prevResult = results[i - 1];

                    if (!prevResult.end && !currResult.end && this.isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = this.mergeResult(text, prevResult, currResult);
                        currResult = null;
                        i += 1;
                    }

                    mergedResult.push(prevResult);
                }

                if (currResult != null) {
                    mergedResult.push(currResult);
                }

                return mergedResult;
            };

            this.isAbleToMerge = function (text, result1, result2) {
                var begin = result1.index + result1.text.length;
                var end = result2.index;
                var textBetween = text.substring(begin, end);

                return textBetween.match(this.pattern());
            };

            this.isWeekdayResult = function (result) {
                return result.start.isCertain('weekday') && !result.start.isCertain('day');
            };

            this.mergeResult = function (text, fromResult, toResult) {

                if (!this.isWeekdayResult(fromResult) && !this.isWeekdayResult(toResult)) {

                    var timeKeys = { 'hour': true, 'minute': true, 'second': true };

                    for (var key in toResult.start.knownValues) {
                        if (!fromResult.start.isCertain(key)) {
                            fromResult.start.assign(key, toResult.start.get(key));
                        }
                    }

                    for (var key in fromResult.start.knownValues) {
                        if (!toResult.start.isCertain(key)) {
                            toResult.start.assign(key, fromResult.start.get(key));
                        }
                    }
                }

                if (fromResult.start.date().getTime() > toResult.start.date().getTime()) {

                    var fromMoment = fromResult.start.moment();
                    var toMoment = toResult.start.moment();

                    if (this.isWeekdayResult(fromResult) && fromMoment.clone().add(-7, 'days').isBefore(toMoment)) {
                        fromMoment = fromMoment.add(-7, 'days');
                        fromResult.start.imply('day', fromMoment.date());
                        fromResult.start.imply('month', fromMoment.month() + 1);
                        fromResult.start.imply('year', fromMoment.year());
                    } else if (this.isWeekdayResult(toResult) && toMoment.clone().add(7, 'days').isAfter(fromMoment)) {
                        toMoment = toMoment.add(7, 'days');
                        toResult.start.imply('day', toMoment.date());
                        toResult.start.imply('month', toMoment.month() + 1);
                        toResult.start.imply('year', toMoment.year());
                    } else {
                        var tmp = toResult;
                        toResult = fromResult;
                        fromResult = tmp;
                    }
                }

                fromResult.end = toResult.start;

                for (var tag in toResult.tags) {
                    fromResult.tags[tag] = true;
                }

                var startIndex = Math.min(fromResult.index, toResult.index);
                var endIndex = Math.max(fromResult.index + fromResult.text.length, toResult.index + toResult.text.length);

                fromResult.index = startIndex;
                fromResult.text = text.substring(startIndex, endIndex);
                fromResult.tags[this.constructor.name] = true;
                return fromResult;
            };
        };
    }, { "../refiner": 63 }], 53: [function (require, module, exports) {
        /*
            
        */
        var ParsedComponents = require('../../result').ParsedComponents;
        var Refiner = require('../refiner').Refiner;

        var PATTERN = new RegExp("^\\s*(T|at|after|before|on|of|,|-)?\\s*$");

        var isDateOnly = exports.isDateOnly = function (result) {
            return !result.start.isCertain('hour');
        };

        var isTimeOnly = exports.isTimeOnly = function (result) {
            return !result.start.isCertain('month') && !result.start.isCertain('weekday');
        };

        var isAbleToMerge = exports.isAbleToMerge = function (text, prevResult, curResult) {
            var textBetween = text.substring(prevResult.index + prevResult.text.length, curResult.index);
            return textBetween.match(PATTERN);
        };

        var mergeDateTimeComponent = exports.mergeDateTimeComponent = function (dateComponent, timeComponent) {
            var dateTimeComponent = dateComponent.clone();

            if (timeComponent.isCertain('hour')) {
                dateTimeComponent.assign('hour', timeComponent.get('hour'));
                dateTimeComponent.assign('minute', timeComponent.get('minute'));
                dateTimeComponent.assign('second', timeComponent.get('second'));
            } else {
                dateTimeComponent.imply('hour', timeComponent.get('hour'));
                dateTimeComponent.imply('minute', timeComponent.get('minute'));
                dateTimeComponent.imply('second', timeComponent.get('second'));
            }

            if (timeComponent.isCertain('meridiem')) {
                dateTimeComponent.assign('meridiem', timeComponent.get('meridiem'));
            } else if (timeComponent.get('meridiem') !== undefined && dateTimeComponent.get('meridiem') === undefined) {
                dateTimeComponent.imply('meridiem', timeComponent.get('meridiem'));
            }

            if (dateTimeComponent.get('meridiem') == 1 && dateTimeComponent.get('hour') < 12) {
                if (timeComponent.isCertain('hour')) {
                    dateTimeComponent.assign('hour', dateTimeComponent.get('hour') + 12);
                } else {
                    dateTimeComponent.imply('hour', dateTimeComponent.get('hour') + 12);
                }
            }

            return dateTimeComponent;
        };

        function mergeResult(text, dateResult, timeResult) {

            var beginDate = dateResult.start;
            var beginTime = timeResult.start;
            var beginDateTime = mergeDateTimeComponent(beginDate, beginTime);

            if (dateResult.end != null || timeResult.end != null) {

                var endDate = dateResult.end == null ? dateResult.start : dateResult.end;
                var endTime = timeResult.end == null ? timeResult.start : timeResult.end;
                var endDateTime = mergeDateTimeComponent(endDate, endTime);

                if (dateResult.end == null && endDateTime.date().getTime() < beginDateTime.date().getTime()) {
                    // Ex. 9pm - 1am
                    if (endDateTime.isCertain('day')) {
                        endDateTime.assign('day', endDateTime.get('day') + 1);
                    } else {
                        endDateTime.imply('day', endDateTime.get('day') + 1);
                    }
                }

                dateResult.end = endDateTime;
            }

            dateResult.start = beginDateTime;

            var startIndex = Math.min(dateResult.index, timeResult.index);
            var endIndex = Math.max(dateResult.index + dateResult.text.length, timeResult.index + timeResult.text.length);

            dateResult.index = startIndex;
            dateResult.text = text.substring(startIndex, endIndex);

            for (var tag in timeResult.tags) {
                dateResult.tags[tag] = true;
            }
            dateResult.tags['ENMergeDateAndTimeRefiner'] = true;
            return dateResult;
        }

        exports.Refiner = function ENMergeDateTimeRefiner() {
            Refiner.call(this);

            this.refine = function (text, results, opt) {

                if (results.length < 2) return results;

                var mergedResult = [];
                var currResult = null;
                var prevResult = null;

                for (var i = 1; i < results.length; i++) {

                    currResult = results[i];
                    prevResult = results[i - 1];

                    if (isDateOnly(prevResult) && isTimeOnly(currResult) && isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = mergeResult(text, prevResult, currResult);
                        currResult = results[i + 1];
                        i += 1;
                    } else if (isDateOnly(currResult) && isTimeOnly(prevResult) && isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = mergeResult(text, currResult, prevResult);
                        currResult = results[i + 1];
                        i += 1;
                    }

                    mergedResult.push(prevResult);
                }

                if (currResult != null) {
                    mergedResult.push(currResult);
                }

                return mergedResult;
            };
        };
    }, { "../../result": 64, "../refiner": 63 }], 54: [function (require, module, exports) {
        /*
        
        */
        var ParsedComponents = require('../../result').ParsedComponents;
        var Refiner = require('../refiner').Refiner;

        var PATTERN = new RegExp("^\\s*(at|after|before|on|,|-|\\(|\\))?\\s*$");

        function isMoreSpecific(prevResult, currResult) {
            var moreSpecific = false;

            if (prevResult.start.isCertain('year')) {
                if (!currResult.start.isCertain('year')) {
                    moreSpecific = true;
                } else {
                    if (prevResult.start.isCertain('month')) {
                        if (!currResult.start.isCertain('month')) {
                            moreSpecific = true;
                        } else {
                            if (prevResult.start.isCertain('day') && !currResult.start.isCertain('day')) {
                                moreSpecific = true;
                            }
                        }
                    }
                }
            }

            return moreSpecific;
        }

        function isAbleToMerge(text, prevResult, currResult) {
            var textBetween = text.substring(prevResult.index + prevResult.text.length, currResult.index);

            // Only accepts merge if one of them comes from casual relative date
            var includesRelativeResult = prevResult.tags['ENRelativeDateFormatParser'] || currResult.tags['ENRelativeDateFormatParser'];

            // We assume they refer to the same date if all date fields are implied
            var referToSameDate = !prevResult.start.isCertain('day') && !prevResult.start.isCertain('month') && !prevResult.start.isCertain('year');

            // If both years are certain, that determines if they refer to the same date
            // but with one more specific than the other
            if (prevResult.start.isCertain('year') && currResult.start.isCertain('year')) referToSameDate = prevResult.start.get('year') === currResult.start.get('year');

            // We now test with the next level (month) if they refer to the same date
            if (prevResult.start.isCertain('month') && currResult.start.isCertain('month')) referToSameDate = prevResult.start.get('month') === currResult.start.get('month') && referToSameDate;

            return includesRelativeResult && textBetween.match(PATTERN) && referToSameDate;
        }

        function mergeResult(text, specificResult, nonSpecificResult) {

            var specificDate = specificResult.start;
            var nonSpecificDate = nonSpecificResult.start;

            var startIndex = Math.min(specificResult.index, nonSpecificResult.index);
            var endIndex = Math.max(specificResult.index + specificResult.text.length, nonSpecificResult.index + nonSpecificResult.text.length);

            specificResult.index = startIndex;
            specificResult.text = text.substring(startIndex, endIndex);

            for (var tag in nonSpecificResult.tags) {
                specificResult.tags[tag] = true;
            }
            specificResult.tags['ENPrioritizeSpecificDateRefiner'] = true;
            return specificResult;
        }

        exports.Refiner = function ENPrioritizeSpecificDateRefiner() {
            Refiner.call(this);

            this.refine = function (text, results, opt) {

                if (results.length < 2) return results;

                var mergedResult = [];
                var currResult = null;
                var prevResult = null;

                for (var i = 1; i < results.length; i++) {

                    currResult = results[i];
                    prevResult = results[i - 1];

                    if (isMoreSpecific(prevResult, currResult) && isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = mergeResult(text, prevResult, currResult);
                        currResult = null;
                        i += 1;
                    } else if (isMoreSpecific(currResult, prevResult) && isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = mergeResult(text, currResult, prevResult);
                        currResult = null;
                        i += 1;
                    }

                    mergedResult.push(prevResult);
                }

                if (currResult != null) {
                    mergedResult.push(currResult);
                }

                return mergedResult;
            };
        };
    }, { "../../result": 64, "../refiner": 63 }], 55: [function (require, module, exports) {
        /*
        
        */
        var Refiner = require('./refiner').Refiner;

        // Map ABBR -> Offset in minute
        var TIMEZONE_ABBR_MAP = {};
        var TIMEZONE_NAME_PATTERN = new RegExp("^\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)", 'i');

        exports.Refiner = function ExtractTimezoneAbbrRefiner() {
            Refiner.call(this);

            this.refine = function (text, results, opt) {

                results.forEach(function (result) {

                    if (!result.tags['ENTimeExpressionParser'] && !result.tags['ZHTimeExpressionParser'] && !result.tags['FRTimeExpressionParser'] && !result.tags['DETimeExpressionParser']) {
                        return;
                    }

                    var match = TIMEZONE_NAME_PATTERN.exec(text.substring(result.index + result.text.length));
                    if (match) {
                        var timezoneAbbr = match[1].toUpperCase();
                        if (TIMEZONE_ABBR_MAP[timezoneAbbr] === undefined) {
                            return;
                        }

                        var timezoneOffset = TIMEZONE_ABBR_MAP[timezoneAbbr];
                        if (!result.start.isCertain('timezoneOffset')) {
                            result.start.assign('timezoneOffset', timezoneOffset);
                        }

                        if (result.end != null && !result.end.isCertain('timezoneOffset')) {
                            result.end.assign('timezoneOffset', timezoneOffset);
                        }

                        result.text += match[0];
                        result.tags['ExtractTimezoneAbbrRefiner'] = true;
                    }
                });

                return results;
            };
        };

        // TODO: Move this to some configuration
        TIMEZONE_ABBR_MAP = { "ACDT": 630, "ACST": 570, "ADT": -180, "AEDT": 660, "AEST": 600, "AFT": 270, "AKDT": -480, "AKST": -540, "ALMT": 360, "AMST": -180, "AMT": -240, "ANAST": 720, "ANAT": 720, "AQTT": 300, "ART": -180, "AST": -240, "AWDT": 540, "AWST": 480, "AZOST": 0, "AZOT": -60, "AZST": 300, "AZT": 240, "BNT": 480, "BOT": -240, "BRST": -120, "BRT": -180, "BST": 60, "BTT": 360, "CAST": 480, "CAT": 120, "CCT": 390, "CDT": -300, "CEST": 120, "CET": 60, "CHADT": 825, "CHAST": 765, "CKT": -600, "CLST": -180, "CLT": -240, "COT": -300, "CST": -360, "CVT": -60, "CXT": 420, "ChST": 600, "DAVT": 420, "EASST": -300, "EAST": -360, "EAT": 180, "ECT": -300, "EDT": -240, "EEST": 180, "EET": 120, "EGST": 0, "EGT": -60, "EST": -300, "ET": -300, "FJST": 780, "FJT": 720, "FKST": -180, "FKT": -240, "FNT": -120, "GALT": -360, "GAMT": -540, "GET": 240, "GFT": -180, "GILT": 720, "GMT": 0, "GST": 240, "GYT": -240, "HAA": -180, "HAC": -300, "HADT": -540, "HAE": -240, "HAP": -420, "HAR": -360, "HAST": -600, "HAT": -90, "HAY": -480, "HKT": 480, "HLV": -210, "HNA": -240, "HNC": -360, "HNE": -300, "HNP": -480, "HNR": -420, "HNT": -150, "HNY": -540, "HOVT": 420, "ICT": 420, "IDT": 180, "IOT": 360, "IRDT": 270, "IRKST": 540, "IRKT": 540, "IRST": 210, "IST": 60, "JST": 540, "KGT": 360, "KRAST": 480, "KRAT": 480, "KST": 540, "KUYT": 240, "LHDT": 660, "LHST": 630, "LINT": 840, "MAGST": 720, "MAGT": 720, "MART": -510, "MAWT": 300, "MDT": -360, "MESZ": 120, "MEZ": 60, "MHT": 720, "MMT": 390, "MSD": 240, "MSK": 240, "MST": -420, "MUT": 240, "MVT": 300, "MYT": 480, "NCT": 660, "NDT": -90, "NFT": 690, "NOVST": 420, "NOVT": 360, "NPT": 345, "NST": -150, "NUT": -660, "NZDT": 780, "NZST": 720, "OMSST": 420, "OMST": 420, "PDT": -420, "PET": -300, "PETST": 720, "PETT": 720, "PGT": 600, "PHOT": 780, "PHT": 480, "PKT": 300, "PMDT": -120, "PMST": -180, "PONT": 660, "PST": -480, "PT": -480, "PWT": 540, "PYST": -180, "PYT": -240, "RET": 240, "SAMT": 240, "SAST": 120, "SBT": 660, "SCT": 240, "SGT": 480, "SRT": -180, "SST": -660, "TAHT": -600, "TFT": 300, "TJT": 300, "TKT": 780, "TLT": 540, "TMT": 300, "TVT": 720, "ULAT": 480, "UTC": 0, "UYST": -120, "UYT": -180, "UZT": 300, "VET": -210, "VLAST": 660, "VLAT": 660, "VUT": 660, "WAST": 120, "WAT": 60, "WEST": 60, "WESZ": 60, "WET": 0, "WEZ": 0, "WFT": 720, "WGST": -120, "WGT": -180, "WIB": 420, "WIT": 540, "WITA": 480, "WST": 780, "WT": 0, "YAKST": 600, "YAKT": 600, "YAPT": 600, "YEKST": 360, "YEKT": 360 };
    }, { "./refiner": 63 }], 56: [function (require, module, exports) {
        /*
          
        */
        var Refiner = require('./refiner').Refiner;

        var TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(GMT|UTC)?(\\+|\\-)(\\d{1,2}):?(\\d{2})", 'i');
        var TIMEZONE_OFFSET_SIGN_GROUP = 2;
        var TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 3;
        var TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 4;

        exports.Refiner = function ExtractTimezoneOffsetRefiner() {
            Refiner.call(this);

            this.refine = function (text, results, opt) {

                results.forEach(function (result) {

                    if (result.start.isCertain('timezoneOffset')) {
                        return;
                    }

                    var match = TIMEZONE_OFFSET_PATTERN.exec(text.substring(result.index + result.text.length));
                    if (!match) {
                        return;
                    }

                    var hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
                    var minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP]);
                    var timezoneOffset = hourOffset * 60 + minuteOffset;
                    if (match[TIMEZONE_OFFSET_SIGN_GROUP] === '-') {
                        timezoneOffset = -timezoneOffset;
                    }

                    if (result.end != null) {
                        result.end.assign('timezoneOffset', timezoneOffset);
                    }

                    result.start.assign('timezoneOffset', timezoneOffset);
                    result.text += match[0];
                    result.tags['ExtractTimezoneOffsetRefiner'] = true;
                });

                return results;
            };
        };
    }, { "./refiner": 63 }], 57: [function (require, module, exports) {
        /*
          
        */
        var Refiner = require('../refiner').Refiner;

        exports.Refiner = function FRMergeDateRangeRefiner() {
            Refiner.call(this);

            this.pattern = function () {
                return (/^\s*(à|a|\-)\s*$/i
                );
            };

            this.refine = function (text, results, opt) {

                if (results.length < 2) return results;

                var mergedResult = [];
                var currResult = null;
                var prevResult = null;

                for (var i = 1; i < results.length; i++) {

                    currResult = results[i];
                    prevResult = results[i - 1];

                    if (!prevResult.end && !currResult.end && this.isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = this.mergeResult(text, prevResult, currResult);
                        currResult = null;
                        i += 1;
                    }

                    mergedResult.push(prevResult);
                }

                if (currResult != null) {
                    mergedResult.push(currResult);
                }

                return mergedResult;
            };

            this.isAbleToMerge = function (text, result1, result2) {
                var begin = result1.index + result1.text.length;
                var end = result2.index;
                var textBetween = text.substring(begin, end);

                return textBetween.match(this.pattern());
            };

            this.isWeekdayResult = function (result) {
                return result.start.isCertain('weekday') && !result.start.isCertain('day');
            };

            this.mergeResult = function (text, fromResult, toResult) {

                if (!this.isWeekdayResult(fromResult) && !this.isWeekdayResult(toResult)) {

                    for (var key in toResult.start.knownValues) {
                        if (!fromResult.start.isCertain(key)) {
                            fromResult.start.assign(key, toResult.start.get(key));
                        }
                    }

                    for (var key in fromResult.start.knownValues) {
                        if (!toResult.start.isCertain(key)) {
                            toResult.start.assign(key, fromResult.start.get(key));
                        }
                    }
                }

                if (fromResult.start.date().getTime() > toResult.start.date()) {
                    var tmp = toResult;
                    toResult = fromResult;
                    fromResult = tmp;
                }

                fromResult.end = toResult.start;

                for (var tag in toResult.tags) {
                    fromResult.tags[tag] = true;
                }

                var startIndex = Math.min(fromResult.index, toResult.index);
                var endIndex = Math.max(fromResult.index + fromResult.text.length, toResult.index + toResult.text.length);

                fromResult.index = startIndex;
                fromResult.text = text.substring(startIndex, endIndex);
                fromResult.tags[this.constructor.name] = true;
                return fromResult;
            };
        };
    }, { "../refiner": 63 }], 58: [function (require, module, exports) {
        /*
            
        */
        var ParsedComponents = require('../../result').ParsedComponents;
        var Refiner = require('../refiner').Refiner;
        var mergeDateTimeComponent = require('../EN/ENMergeDateTimeRefiner').mergeDateTimeComponent;

        var PATTERN = new RegExp("^\\s*(T|à|a|vers|de|,|-)?\\s*$");

        function isDateOnly(result) {
            return !result.start.isCertain('hour') || result.tags['FRCasualDateParser'];
        }

        function isTimeOnly(result) {
            return !result.start.isCertain('month') && !result.start.isCertain('weekday');
        }

        function isAbleToMerge(text, prevResult, curResult) {
            var textBetween = text.substring(prevResult.index + prevResult.text.length, curResult.index);
            return textBetween.match(PATTERN);
        }

        function mergeResult(text, dateResult, timeResult) {

            var beginDate = dateResult.start;
            var beginTime = timeResult.start;
            var beginDateTime = mergeDateTimeComponent(beginDate, beginTime);

            if (dateResult.end != null || timeResult.end != null) {

                var endDate = dateResult.end == null ? dateResult.start : dateResult.end;
                var endTime = timeResult.end == null ? timeResult.start : timeResult.end;
                var endDateTime = mergeDateTimeComponent(endDate, endTime);

                if (dateResult.end == null && endDateTime.date().getTime() < beginDateTime.date().getTime()) {
                    // Ex. 9pm - 1am
                    if (endDateTime.isCertain('day')) {
                        endDateTime.assign('day', endDateTime.get('day') + 1);
                    } else {
                        endDateTime.imply('day', endDateTime.get('day') + 1);
                    }
                }

                dateResult.end = endDateTime;
            }

            dateResult.start = beginDateTime;

            var startIndex = Math.min(dateResult.index, timeResult.index);
            var endIndex = Math.max(dateResult.index + dateResult.text.length, timeResult.index + timeResult.text.length);

            dateResult.index = startIndex;
            dateResult.text = text.substring(startIndex, endIndex);

            for (var tag in timeResult.tags) {
                dateResult.tags[tag] = true;
            }
            dateResult.tags['FRMergeDateAndTimeRefiner'] = true;
            return dateResult;
        }

        exports.Refiner = function FRMergeDateTimeRefiner() {
            Refiner.call(this);

            this.refine = function (text, results, opt) {

                if (results.length < 2) return results;

                var mergedResult = [];
                var currResult = null;
                var prevResult = null;

                for (var i = 1; i < results.length; i++) {

                    currResult = results[i];
                    prevResult = results[i - 1];

                    if (isDateOnly(prevResult) && isTimeOnly(currResult) && isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = mergeResult(text, prevResult, currResult);
                        currResult = null;
                        i += 1;
                    } else if (isDateOnly(currResult) && isTimeOnly(prevResult) && isAbleToMerge(text, prevResult, currResult)) {

                        prevResult = mergeResult(text, currResult, prevResult);
                        currResult = null;
                        i += 1;
                    }

                    mergedResult.push(prevResult);
                }

                if (currResult != null) {
                    mergedResult.push(currResult);
                }

                return mergedResult;
            };
        };
    }, { "../../result": 64, "../EN/ENMergeDateTimeRefiner": 53, "../refiner": 63 }], 59: [function (require, module, exports) {
        /*
            Enforce 'forwardDate' option to on the results. When there are missing component,
            e.g. "March 12-13 (without year)" or "Thursday", the refiner will try to adjust the result
            into the future instead of the past.
        */
        var moment = require('moment');
        var Refiner = require('./refiner').Refiner;

        exports.Refiner = function ForwardDateRefiner() {
            Refiner.call(this);

            this.refine = function (text, results, opt) {

                if (!opt['forwardDate'] && !opt['forwardDatesOnly']) {
                    return results;
                }

                results.forEach(function (result) {

                    var refMoment = moment(result.ref);

                    if (result.start.isCertain('day') && result.start.isCertain('month') && !result.start.isCertain('year') && refMoment.isAfter(result.start.moment())) {
                        // Adjust year into the future
                        for (var i = 0; i < 3 && refMoment.isAfter(result.start.moment()); i++) {
                            result.start.imply('year', result.start.get('year') + 1);

                            if (result.end && !result.end.isCertain('year')) {
                                result.end.imply('year', result.end.get('year') + 1);
                            }
                        }

                        result.tags['ExtractTimezoneOffsetRefiner'] = true;
                    }

                    if (!result.start.isCertain('day') && !result.start.isCertain('month') && !result.start.isCertain('year') && result.start.isCertain('weekday') && refMoment.isAfter(result.start.moment())) {
                        // Adjust date to the coming week
                        if (refMoment.day() > result.start.get('weekday')) {
                            refMoment.day(result.start.get('weekday') + 7);
                        } else {
                            refMoment.day(result.start.get('weekday'));
                        }

                        result.start.imply('day', refMoment.date());
                        result.start.imply('month', refMoment.month() + 1);
                        result.start.imply('year', refMoment.year());
                        result.tags['ExtractTimezoneOffsetRefiner'] = true;
                    }
                });

                return results;
            };
        };
    }, { "./refiner": 63, "moment": 72 }], 60: [function (require, module, exports) {
        /*
          
        */
        var ENMergeDateRangeRefiner = require('../EN/ENMergeDateRangeRefiner').Refiner;

        exports.Refiner = function JPMergeDateRangeRefiner() {
            ENMergeDateRangeRefiner.call(this);

            this.pattern = function () {
                return (/^\s*(から|ー)\s*$/i
                );
            };
        };
    }, { "../EN/ENMergeDateRangeRefiner": 52 }], 61: [function (require, module, exports) {
        /*
          
        */
        var Refiner = require('./refiner').Refiner;

        exports.Refiner = function OverlapRemovalRefiner() {
            Refiner.call(this);

            this.refine = function (text, results, opt) {

                if (results.length < 2) return results;

                var filteredResults = [];
                var prevResult = results[0];

                for (var i = 1; i < results.length; i++) {

                    var result = results[i];

                    // If overlap, compare the length and discard the shorter one
                    if (result.index < prevResult.index + prevResult.text.length) {

                        if (result.text.length > prevResult.text.length) {
                            prevResult = result;
                        }
                    } else {
                        filteredResults.push(prevResult);
                        prevResult = result;
                    }
                }

                // The last one
                if (prevResult != null) {
                    filteredResults.push(prevResult);
                }

                return filteredResults;
            };
        };
    }, { "./refiner": 63 }], 62: [function (require, module, exports) {
        /*
          
        */
        var Filter = require('./refiner').Filter;

        exports.Refiner = function UnlikelyFormatFilter() {
            Filter.call(this);

            this.isValid = function (text, result, opt) {

                if (result.text.replace(' ', '').match(/^\d*(\.\d*)?$/)) {
                    return false;
                }

                return true;
            };
        };
    }, { "./refiner": 63 }], 63: [function (require, module, exports) {

        exports.Refiner = function Refiner() {

            this.refine = function (text, results, opt) {
                return results;
            };
        };

        exports.Filter = function Filter() {

            exports.Refiner.call(this);

            this.isValid = function (text, result, opt) {
                return true;
            };
            this.refine = function (text, results, opt) {

                var filteredResult = [];
                for (var i = 0; i < results.length; i++) {

                    var result = results[i];
                    if (this.isValid(text, result, opt)) {
                        filteredResult.push(result);
                    }
                }

                return filteredResult;
            };
        };

        // Common refiners
        exports.OverlapRemovalRefiner = require('./OverlapRemovalRefiner').Refiner;
        exports.ExtractTimezoneOffsetRefiner = require('./ExtractTimezoneOffsetRefiner').Refiner;
        exports.ExtractTimezoneAbbrRefiner = require('./ExtractTimezoneAbbrRefiner').Refiner;
        exports.ForwardDateRefiner = require('./ForwardDateRefiner').Refiner;
        exports.UnlikelyFormatFilter = require('./UnlikelyFormatFilter').Refiner;

        // EN refiners
        exports.ENMergeDateTimeRefiner = require('./EN/ENMergeDateTimeRefiner').Refiner;
        exports.ENMergeDateRangeRefiner = require('./EN/ENMergeDateRangeRefiner').Refiner;
        exports.ENPrioritizeSpecificDateRefiner = require('./EN/ENPrioritizeSpecificDateRefiner').Refiner;

        // JP refiners
        exports.JPMergeDateRangeRefiner = require('./JP/JPMergeDateRangeRefiner').Refiner;

        // FR refiners
        exports.FRMergeDateRangeRefiner = require('./FR/FRMergeDateRangeRefiner').Refiner;
        exports.FRMergeDateTimeRefiner = require('./FR/FRMergeDateTimeRefiner').Refiner;

        // DE refiners
        exports.DEMergeDateRangeRefiner = require('./DE/DEMergeDateRangeRefiner').Refiner;
        exports.DEMergeDateTimeRefiner = require('./DE/DEMergeDateTimeRefiner').Refiner;
    }, { "./DE/DEMergeDateRangeRefiner": 50, "./DE/DEMergeDateTimeRefiner": 51, "./EN/ENMergeDateRangeRefiner": 52, "./EN/ENMergeDateTimeRefiner": 53, "./EN/ENPrioritizeSpecificDateRefiner": 54, "./ExtractTimezoneAbbrRefiner": 55, "./ExtractTimezoneOffsetRefiner": 56, "./FR/FRMergeDateRangeRefiner": 57, "./FR/FRMergeDateTimeRefiner": 58, "./ForwardDateRefiner": 59, "./JP/JPMergeDateRangeRefiner": 60, "./OverlapRemovalRefiner": 61, "./UnlikelyFormatFilter": 62 }], 64: [function (require, module, exports) {
        var moment = require('moment');

        function ParsedResult(result) {
            result = result || {};

            this.ref = result.ref;
            this.index = result.index;
            this.text = result.text;
            this.tags = result.tags || {};

            this.start = new ParsedComponents(result.start, result.ref);
            if (result.end) {
                this.end = new ParsedComponents(result.end, result.ref);
            }
        }

        ParsedResult.prototype.clone = function () {
            var result = new ParsedResult(this);
            result.tags = JSON.parse(JSON.stringify(this.tags));
            result.start = this.start.clone();
            if (this.end) {
                result.end = this.end.clone();
            }
        };

        ParsedResult.prototype.hasPossibleDates = function () {
            return this.start.isPossibleDate() && (!this.end || this.end.isPossibleDate());
        };

        function ParsedComponents(components, ref) {

            this.knownValues = {};
            this.impliedValues = {};

            if (components) {
                for (key in components) {
                    this.knownValues[key] = components[key];
                }
            }

            if (ref) {
                ref = moment(ref);
                this.imply('day', ref.date());
                this.imply('month', ref.month() + 1);
                this.imply('year', ref.year());
            }

            this.imply('hour', 12);
            this.imply('minute', 0);
            this.imply('second', 0);
            this.imply('millisecond', 0);
        }

        ParsedComponents.prototype.clone = function () {
            var component = new ParsedComponents();
            component.knownValues = JSON.parse(JSON.stringify(this.knownValues));
            component.impliedValues = JSON.parse(JSON.stringify(this.impliedValues));
            return component;
        };

        ParsedComponents.prototype.get = function (component, value) {
            if (component in this.knownValues) return this.knownValues[component];
            if (component in this.impliedValues) return this.impliedValues[component];
        };

        ParsedComponents.prototype.assign = function (component, value) {
            this.knownValues[component] = value;
            delete this.impliedValues[component];
        };

        ParsedComponents.prototype.imply = function (component, value) {
            if (component in this.knownValues) return;
            this.impliedValues[component] = value;
        };

        ParsedComponents.prototype.isCertain = function (component) {
            return component in this.knownValues;
        };

        ParsedComponents.prototype.isPossibleDate = function () {
            var dateMoment = this.moment();
            if (this.isCertain('timezoneOffset')) {
                dateMoment.utcOffset(this.get('timezoneOffset'));
            }

            if (dateMoment.get('year') != this.get('year')) return false;
            if (dateMoment.get('month') != this.get('month') - 1) return false;
            if (dateMoment.get('date') != this.get('day')) return false;
            if (dateMoment.get('hour') != this.get('hour')) return false;
            if (dateMoment.get('minute') != this.get('minute')) return false;

            return true;
        };

        ParsedComponents.prototype.date = function () {
            var dateMoment = this.moment();
            return dateMoment.toDate();
        };

        ParsedComponents.prototype.moment = function () {
            var dateMoment = moment();

            dateMoment.set('year', this.get('year'));
            dateMoment.set('month', this.get('month') - 1);
            dateMoment.set('date', this.get('day'));
            dateMoment.set('hour', this.get('hour'));
            dateMoment.set('minute', this.get('minute'));
            dateMoment.set('second', this.get('second'));
            dateMoment.set('millisecond', this.get('millisecond'));

            // Javascript Date Object return minus timezone offset
            var currentTimezoneOffset = dateMoment.utcOffset();
            var targetTimezoneOffset = this.isCertain('timezoneOffset') ? this.get('timezoneOffset') : currentTimezoneOffset;

            var adjustTimezoneOffset = targetTimezoneOffset - currentTimezoneOffset;
            dateMoment.add(-adjustTimezoneOffset, 'minutes');

            return dateMoment;
        };

        exports.ParsedComponents = ParsedComponents;
        exports.ParsedResult = ParsedResult;
    }, { "moment": 72 }], 65: [function (require, module, exports) {
        exports.WEEKDAY_OFFSET = {
            'sonntag': 0,
            'so': 0,
            'montag': 1,
            'mo': 1,
            'dienstag': 2,
            'di': 2,
            'mittwoch': 3,
            'mi': 3,
            'donnerstag': 4,
            'do': 4,
            'freitag': 5,
            'fr': 5,
            'samstag': 6,
            'sa': 6
        };

        exports.MONTH_OFFSET = {
            'januar': 1,
            'jan': 1,
            'jan.': 1,
            'februar': 2,
            'feb': 2,
            'feb.': 2,
            'märz': 3,
            'maerz': 3,
            'mär': 3,
            'mär.': 3,
            'mrz': 3,
            'mrz.': 3,
            'april': 4,
            'apr': 4,
            'apr.': 4,
            'mai': 5,
            'juni': 6,
            'jun': 6,
            'jun.': 6,
            'juli': 7,
            'jul': 7,
            'jul.': 7,
            'august': 8,
            'aug': 8,
            'aug.': 8,
            'september': 9,
            'sep': 9,
            'sep.': 9,
            'sept': 9,
            'sept.': 9,
            'oktober': 10,
            'okt': 10,
            'okt.': 10,
            'november': 11,
            'nov': 11,
            'nov.': 11,
            'dezember': 12,
            'dez': 12,
            'dez.': 12
        };

        exports.INTEGER_WORDS_PATTERN = '(?:eins|zwei|drei|vier|fünf|fuenf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwoelf)';
        exports.INTEGER_WORDS = {
            'eins': 1,
            'zwei': 2,
            'drei': 3,
            'vier': 4,
            'fünf': 5,
            'fuenf': 5,
            'sechs': 6,
            'sieben': 7,
            'acht': 8,
            'neun': 9,
            'zehn': 10,
            'elf': 11,
            'zwölf': 12,
            'zwoelf': 12
        };
    }, {}], 66: [function (require, module, exports) {
        exports.WEEKDAY_OFFSET = {
            'sunday': 0,
            'sun': 0,
            'monday': 1,
            'mon': 1,
            'tuesday': 2,
            'tue': 2,
            'wednesday': 3,
            'wed': 3,
            'thursday': 4,
            'thur': 4,
            'thu': 4,
            'friday': 5,
            'fri': 5,
            'saturday': 6,
            'sat': 6
        };

        exports.MONTH_OFFSET = {
            'january': 1,
            'jan': 1,
            'jan.': 1,
            'february': 2,
            'feb': 2,
            'feb.': 2,
            'march': 3,
            'mar': 3,
            'mar.': 3,
            'april': 4,
            'apr': 4,
            'apr.': 4,
            'may': 5,
            'june': 6,
            'jun': 6,
            'jun.': 6,
            'july': 7,
            'jul': 7,
            'jul.': 7,
            'august': 8,
            'aug': 8,
            'aug.': 8,
            'september': 9,
            'sep': 9,
            'sep.': 9,
            'sept': 9,
            'sept.': 9,
            'october': 10,
            'oct': 10,
            'oct.': 10,
            'november': 11,
            'nov': 11,
            'nov.': 11,
            'december': 12,
            'dec': 12,
            'dec.': 12
        };

        exports.INTEGER_WORDS = {
            'one': 1,
            'two': 2,
            'three': 3,
            'four': 4,
            'five': 5,
            'six': 6,
            'seven': 7,
            'eight': 8,
            'nine': 9,
            'ten': 10,
            'eleven': 11,
            'twelve': 12
        };
        exports.INTEGER_WORDS_PATTERN = '(?:' + Object.keys(exports.INTEGER_WORDS).join('|') + ')';

        exports.ORDINAL_WORDS = {
            'first': 1,
            'second': 2,
            'third': 3,
            'fourth': 4,
            'fifth': 5,
            'sixth': 6,
            'seventh': 7,
            'eighth': 8,
            'ninth': 9,
            'tenth': 10,
            'eleventh': 11,
            'twelfth': 12,
            'thirteenth': 13,
            'fourteenth': 14,
            'fifteenth': 15,
            'sixteenth': 16,
            'seventeenth': 17,
            'eighteenth': 18,
            'nineteenth': 19,
            'twentieth': 20,
            'twenty first': 21,
            'twenty second': 22,
            'twenty third': 23,
            'twenty fourth': 24,
            'twenty fifth': 25,
            'twenty sixth': 26,
            'twenty seventh': 27,
            'twenty eighth': 28,
            'twenty ninth': 29,
            'thirtieth': 30,
            'thirty first': 31
        };
        exports.ORDINAL_WORDS_PATTERN = '(?:' + Object.keys(exports.ORDINAL_WORDS).join('|').replace(/ /g, '[ -]') + ')';
    }, {}], 67: [function (require, module, exports) {
        exports.WEEKDAY_OFFSET = {
            'domingo': 0,
            'dom': 0,
            'lunes': 1,
            'lun': 1,
            'martes': 2,
            'mar': 2,
            'miércoles': 3,
            'miercoles': 3,
            'mie': 3,
            'jueves': 4,
            'jue': 4,
            'viernes': 5,
            'vie': 5,
            'sábado': 6,
            'sabado': 6,
            'sab': 6 };

        exports.MONTH_OFFSET = {
            'enero': 1,
            'ene': 1,
            'ene.': 1,
            'febrero': 2,
            'feb': 2,
            'feb.': 2,
            'marzo': 3,
            'mar': 3,
            'mar.': 3,
            'abril': 4,
            'abr': 4,
            'abr.': 4,
            'mayo': 5,
            'may': 5,
            'may.': 5,
            'junio': 6,
            'jun': 6,
            'jun.': 6,
            'julio': 7,
            'jul': 7,
            'jul.': 7,
            'agosto': 8,
            'ago': 8,
            'ago.': 8,
            'septiembre': 9,
            'sep': 9,
            'sept': 9,
            'sep.': 9,
            'sept.': 9,
            'octubre': 10,
            'oct': 10,
            'oct.': 10,
            'noviembre': 11,
            'nov': 11,
            'nov.': 11,
            'diciembre': 12,
            'dic': 12,
            'dic.': 12
        };
    }, {}], 68: [function (require, module, exports) {
        exports.WEEKDAY_OFFSET = {
            'dimanche': 0,
            'dim': 0,
            'lundi': 1,
            'lun': 1,
            'mardi': 2,
            'mar': 2,
            'mercredi': 3,
            'mer': 3,
            'jeudi': 4,
            'jeu': 4,
            'vendredi': 5,
            'ven': 5,
            'samedi': 6,
            'sam': 6
        };

        exports.MONTH_OFFSET = {
            'janvier': 1,
            'jan': 1,
            'jan.': 1,
            'février': 2,
            'fév': 2,
            'fév.': 2,
            'fevrier': 2,
            'fev': 2,
            'fev.': 2,
            'mars': 3,
            'mar': 3,
            'mar.': 3,
            'avril': 4,
            'avr': 4,
            'avr.': 4,
            'mai': 5,
            'juin': 6,
            'jun': 6,
            'juillet': 7,
            'jul': 7,
            'jul.': 7,
            'août': 8,
            'aout': 8,
            'septembre': 9,
            'sep': 9,
            'sep.': 9,
            'sept': 9,
            'sept.': 9,
            'octobre': 10,
            'oct': 10,
            'oct.': 10,
            'novembre': 11,
            'nov': 11,
            'nov.': 11,
            'décembre': 12,
            'decembre': 12,
            'dec': 12,
            'dec.': 12
        };

        exports.INTEGER_WORDS_PATTERN = '(?:un|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize)';
        exports.INTEGER_WORDS = {
            'un': 1,
            'deux': 2,
            'trois': 3,
            'quatre': 4,
            'cinq': 5,
            'six': 6,
            'sept': 7,
            'huit': 8,
            'neuf': 9,
            'dix': 10,
            'onze': 11,
            'douze': 12,
            'treize': 13
        };
    }, {}], 69: [function (require, module, exports) {

        /**
         * to-hankaku.js
         * convert to ascii code strings.
         *
         * @version 1.0.1
         * @author think49
         * @url https://gist.github.com/964592
         * @license http://www.opensource.org/licenses/mit-license.php (The MIT License)
         */

        exports.toHankaku = function (String, fromCharCode) {

            function toHankaku(string) {
                return String(string).replace(/\u2019/g, "'").replace(/\u201D/g, "\"").replace(/\u3000/g, " ").replace(/\uFFE5/g, "\xA5").replace(/[\uFF01\uFF03-\uFF06\uFF08\uFF09\uFF0C-\uFF19\uFF1C-\uFF1F\uFF21-\uFF3B\uFF3D\uFF3F\uFF41-\uFF5B\uFF5D\uFF5E]/g, alphaNum);
            }

            function alphaNum(token) {
                return fromCharCode(token.charCodeAt(0) - 65248);
            }

            return toHankaku;
        }(String, String.fromCharCode);

        /**
         * to-zenkaku.js
         * convert to multi byte strings.
         *
         * @version 1.0.2
         * @author think49
         * @url https://gist.github.com/964592
         * @license http://www.opensource.org/licenses/mit-license.php (The MIT License)
         */
        exports.toZenkaku = function (String, fromCharCode) {

            function toZenkaku(string) {
                return String(string).replace(/\u0020/g, "\u3000").replace(/\u0022/g, "\u201D").replace(/\u0027/g, "\u2019").replace(/\u00A5/g, "\uFFE5").replace(/[!#-&(),-9\u003C-?A-[\u005D_a-{}~]/g, alphaNum);
            }

            function alphaNum(token) {
                return fromCharCode(token.charCodeAt(0) + 65248);
            }

            return toZenkaku;
        }(String, String.fromCharCode);
    }, {}], 70: [function (require, module, exports) {
        var NUMBER = {
            '零': 0,
            '一': 1,
            '二': 2,
            '兩': 2,
            '三': 3,
            '四': 4,
            '五': 5,
            '六': 6,
            '七': 7,
            '八': 8,
            '九': 9,
            '十': 10,
            '廿': 20,
            '卅': 30
        };

        var WEEKDAY_OFFSET = {
            '天': 0,
            '日': 0,
            '一': 1,
            '二': 2,
            '三': 3,
            '四': 4,
            '五': 5,
            '六': 6
        };

        exports.NUMBER = NUMBER;
        exports.WEEKDAY_OFFSET = WEEKDAY_OFFSET;

        exports.zhStringToNumber = function (text) {
            var number = 0;
            for (var i = 0; i < text.length; i++) {
                var char = text[i];
                if (char === '十') {
                    number = number === 0 ? NUMBER[char] : number * NUMBER[char];
                } else {
                    number += NUMBER[char];
                }
            }
            return number;
        };

        exports.zhStringToYear = function (text) {
            var string = '';
            for (var i = 0; i < text.length; i++) {
                var char = text[i];
                string = string + NUMBER[char];
            }
            return parseInt(string);
        };
    }, {}], 71: [function (require, module, exports) {
        //! moment.js locale configuration
        //! locale : French [fr]
        //! author : John Fischer : https://github.com/jfroffice

        ;(function (global, factory) {
            (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' && typeof require === 'function' ? factory(require('../moment')) : typeof define === 'function' && define.amd ? define(['../moment'], factory) : factory(global.moment);
        })(this, function (moment) {
            'use strict';

            var fr = moment.defineLocale('fr', {
                months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
                monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
                monthsParseExact: true,
                weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
                weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
                weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
                weekdaysParseExact: true,
                longDateFormat: {
                    LT: 'HH:mm',
                    LTS: 'HH:mm:ss',
                    L: 'DD/MM/YYYY',
                    LL: 'D MMMM YYYY',
                    LLL: 'D MMMM YYYY HH:mm',
                    LLLL: 'dddd D MMMM YYYY HH:mm'
                },
                calendar: {
                    sameDay: '[Aujourd’hui à] LT',
                    nextDay: '[Demain à] LT',
                    nextWeek: 'dddd [à] LT',
                    lastDay: '[Hier à] LT',
                    lastWeek: 'dddd [dernier à] LT',
                    sameElse: 'L'
                },
                relativeTime: {
                    future: 'dans %s',
                    past: 'il y a %s',
                    s: 'quelques secondes',
                    m: 'une minute',
                    mm: '%d minutes',
                    h: 'une heure',
                    hh: '%d heures',
                    d: 'un jour',
                    dd: '%d jours',
                    M: 'un mois',
                    MM: '%d mois',
                    y: 'un an',
                    yy: '%d ans'
                },
                dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
                ordinal: function ordinal(number, period) {
                    switch (period) {
                        // TODO: Return 'e' when day of month > 1. Move this case inside
                        // block for masculine words below.
                        // See https://github.com/moment/moment/issues/3375
                        case 'D':
                            return number + (number === 1 ? 'er' : '');

                        // Words with masculine grammatical gender: mois, trimestre, jour
                        default:
                        case 'M':
                        case 'Q':
                        case 'DDD':
                        case 'd':
                            return number + (number === 1 ? 'er' : 'e');

                        // Words with feminine grammatical gender: semaine
                        case 'w':
                        case 'W':
                            return number + (number === 1 ? 're' : 'e');
                    }
                },
                week: {
                    dow: 1, // Monday is the first day of the week.
                    doy: 4 // The week that contains Jan 4th is the first week of the year.
                }
            });

            return fr;
        });
    }, { "../moment": 72 }], 72: [function (require, module, exports) {
        //! moment.js
        //! version : 2.18.1
        //! authors : Tim Wood, Iskren Chernev, Moment.js contributors
        //! license : MIT
        //! momentjs.com

        ;(function (global, factory) {
            (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.moment = factory();
        })(this, function () {
            'use strict';

            var hookCallback;

            function hooks() {
                return hookCallback.apply(null, arguments);
            }

            // This is done to register the method called with moment()
            // without creating circular dependencies.
            function setHookCallback(callback) {
                hookCallback = callback;
            }

            function isArray(input) {
                return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
            }

            function isObject(input) {
                // IE8 will treat undefined and null as object if it wasn't for
                // input != null
                return input != null && Object.prototype.toString.call(input) === '[object Object]';
            }

            function isObjectEmpty(obj) {
                var k;
                for (k in obj) {
                    // even if its not own property I'd still call it non-empty
                    return false;
                }
                return true;
            }

            function isUndefined(input) {
                return input === void 0;
            }

            function isNumber(input) {
                return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
            }

            function isDate(input) {
                return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
            }

            function map(arr, fn) {
                var res = [],
                    i;
                for (i = 0; i < arr.length; ++i) {
                    res.push(fn(arr[i], i));
                }
                return res;
            }

            function hasOwnProp(a, b) {
                return Object.prototype.hasOwnProperty.call(a, b);
            }

            function extend(a, b) {
                for (var i in b) {
                    if (hasOwnProp(b, i)) {
                        a[i] = b[i];
                    }
                }

                if (hasOwnProp(b, 'toString')) {
                    a.toString = b.toString;
                }

                if (hasOwnProp(b, 'valueOf')) {
                    a.valueOf = b.valueOf;
                }

                return a;
            }

            function createUTC(input, format, locale, strict) {
                return createLocalOrUTC(input, format, locale, strict, true).utc();
            }

            function defaultParsingFlags() {
                // We need to deep clone this object.
                return {
                    empty: false,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -2,
                    charsLeftOver: 0,
                    nullInput: false,
                    invalidMonth: null,
                    invalidFormat: false,
                    userInvalidated: false,
                    iso: false,
                    parsedDateParts: [],
                    meridiem: null,
                    rfc2822: false,
                    weekdayMismatch: false
                };
            }

            function getParsingFlags(m) {
                if (m._pf == null) {
                    m._pf = defaultParsingFlags();
                }
                return m._pf;
            }

            var some;
            if (Array.prototype.some) {
                some = Array.prototype.some;
            } else {
                some = function some(fun) {
                    var t = Object(this);
                    var len = t.length >>> 0;

                    for (var i = 0; i < len; i++) {
                        if (i in t && fun.call(this, t[i], i, t)) {
                            return true;
                        }
                    }

                    return false;
                };
            }

            var some$1 = some;

            function isValid(m) {
                if (m._isValid == null) {
                    var flags = getParsingFlags(m);
                    var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
                        return i != null;
                    });
                    var isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidMonth && !flags.invalidWeekday && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);

                    if (m._strict) {
                        isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
                    }

                    if (Object.isFrozen == null || !Object.isFrozen(m)) {
                        m._isValid = isNowValid;
                    } else {
                        return isNowValid;
                    }
                }
                return m._isValid;
            }

            function createInvalid(flags) {
                var m = createUTC(NaN);
                if (flags != null) {
                    extend(getParsingFlags(m), flags);
                } else {
                    getParsingFlags(m).userInvalidated = true;
                }

                return m;
            }

            // Plugins that add properties should also add the key here (null value),
            // so we can properly clone ourselves.
            var momentProperties = hooks.momentProperties = [];

            function copyConfig(to, from) {
                var i, prop, val;

                if (!isUndefined(from._isAMomentObject)) {
                    to._isAMomentObject = from._isAMomentObject;
                }
                if (!isUndefined(from._i)) {
                    to._i = from._i;
                }
                if (!isUndefined(from._f)) {
                    to._f = from._f;
                }
                if (!isUndefined(from._l)) {
                    to._l = from._l;
                }
                if (!isUndefined(from._strict)) {
                    to._strict = from._strict;
                }
                if (!isUndefined(from._tzm)) {
                    to._tzm = from._tzm;
                }
                if (!isUndefined(from._isUTC)) {
                    to._isUTC = from._isUTC;
                }
                if (!isUndefined(from._offset)) {
                    to._offset = from._offset;
                }
                if (!isUndefined(from._pf)) {
                    to._pf = getParsingFlags(from);
                }
                if (!isUndefined(from._locale)) {
                    to._locale = from._locale;
                }

                if (momentProperties.length > 0) {
                    for (i = 0; i < momentProperties.length; i++) {
                        prop = momentProperties[i];
                        val = from[prop];
                        if (!isUndefined(val)) {
                            to[prop] = val;
                        }
                    }
                }

                return to;
            }

            var updateInProgress = false;

            // Moment prototype object
            function Moment(config) {
                copyConfig(this, config);
                this._d = new Date(config._d != null ? config._d.getTime() : NaN);
                if (!this.isValid()) {
                    this._d = new Date(NaN);
                }
                // Prevent infinite loop in case updateOffset creates new moment
                // objects.
                if (updateInProgress === false) {
                    updateInProgress = true;
                    hooks.updateOffset(this);
                    updateInProgress = false;
                }
            }

            function isMoment(obj) {
                return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
            }

            function absFloor(number) {
                if (number < 0) {
                    // -0 -> 0
                    return Math.ceil(number) || 0;
                } else {
                    return Math.floor(number);
                }
            }

            function toInt(argumentForCoercion) {
                var coercedNumber = +argumentForCoercion,
                    value = 0;

                if (coercedNumber !== 0 && isFinite(coercedNumber)) {
                    value = absFloor(coercedNumber);
                }

                return value;
            }

            // compare two arrays, return the number of differences
            function compareArrays(array1, array2, dontConvert) {
                var len = Math.min(array1.length, array2.length),
                    lengthDiff = Math.abs(array1.length - array2.length),
                    diffs = 0,
                    i;
                for (i = 0; i < len; i++) {
                    if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
                        diffs++;
                    }
                }
                return diffs + lengthDiff;
            }

            function warn(msg) {
                if (hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
                    console.warn('Deprecation warning: ' + msg);
                }
            }

            function deprecate(msg, fn) {
                var firstTime = true;

                return extend(function () {
                    if (hooks.deprecationHandler != null) {
                        hooks.deprecationHandler(null, msg);
                    }
                    if (firstTime) {
                        var args = [];
                        var arg;
                        for (var i = 0; i < arguments.length; i++) {
                            arg = '';
                            if (_typeof(arguments[i]) === 'object') {
                                arg += '\n[' + i + '] ';
                                for (var key in arguments[0]) {
                                    arg += key + ': ' + arguments[0][key] + ', ';
                                }
                                arg = arg.slice(0, -2); // Remove trailing comma and space
                            } else {
                                arg = arguments[i];
                            }
                            args.push(arg);
                        }
                        warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + new Error().stack);
                        firstTime = false;
                    }
                    return fn.apply(this, arguments);
                }, fn);
            }

            var deprecations = {};

            function deprecateSimple(name, msg) {
                if (hooks.deprecationHandler != null) {
                    hooks.deprecationHandler(name, msg);
                }
                if (!deprecations[name]) {
                    warn(msg);
                    deprecations[name] = true;
                }
            }

            hooks.suppressDeprecationWarnings = false;
            hooks.deprecationHandler = null;

            function isFunction(input) {
                return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
            }

            function set(config) {
                var prop, i;
                for (i in config) {
                    prop = config[i];
                    if (isFunction(prop)) {
                        this[i] = prop;
                    } else {
                        this['_' + i] = prop;
                    }
                }
                this._config = config;
                // Lenient ordinal parsing accepts just a number in addition to
                // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
                // TODO: Remove "ordinalParse" fallback in next major release.
                this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source);
            }

            function mergeConfigs(parentConfig, childConfig) {
                var res = extend({}, parentConfig),
                    prop;
                for (prop in childConfig) {
                    if (hasOwnProp(childConfig, prop)) {
                        if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                            res[prop] = {};
                            extend(res[prop], parentConfig[prop]);
                            extend(res[prop], childConfig[prop]);
                        } else if (childConfig[prop] != null) {
                            res[prop] = childConfig[prop];
                        } else {
                            delete res[prop];
                        }
                    }
                }
                for (prop in parentConfig) {
                    if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
                        // make sure changes to properties don't modify parent config
                        res[prop] = extend({}, res[prop]);
                    }
                }
                return res;
            }

            function Locale(config) {
                if (config != null) {
                    this.set(config);
                }
            }

            var keys;

            if (Object.keys) {
                keys = Object.keys;
            } else {
                keys = function keys(obj) {
                    var i,
                        res = [];
                    for (i in obj) {
                        if (hasOwnProp(obj, i)) {
                            res.push(i);
                        }
                    }
                    return res;
                };
            }

            var keys$1 = keys;

            var defaultCalendar = {
                sameDay: '[Today at] LT',
                nextDay: '[Tomorrow at] LT',
                nextWeek: 'dddd [at] LT',
                lastDay: '[Yesterday at] LT',
                lastWeek: '[Last] dddd [at] LT',
                sameElse: 'L'
            };

            function calendar(key, mom, now) {
                var output = this._calendar[key] || this._calendar['sameElse'];
                return isFunction(output) ? output.call(mom, now) : output;
            }

            var defaultLongDateFormat = {
                LTS: 'h:mm:ss A',
                LT: 'h:mm A',
                L: 'MM/DD/YYYY',
                LL: 'MMMM D, YYYY',
                LLL: 'MMMM D, YYYY h:mm A',
                LLLL: 'dddd, MMMM D, YYYY h:mm A'
            };

            function longDateFormat(key) {
                var format = this._longDateFormat[key],
                    formatUpper = this._longDateFormat[key.toUpperCase()];

                if (format || !formatUpper) {
                    return format;
                }

                this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });

                return this._longDateFormat[key];
            }

            var defaultInvalidDate = 'Invalid date';

            function invalidDate() {
                return this._invalidDate;
            }

            var defaultOrdinal = '%d';
            var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

            function ordinal(number) {
                return this._ordinal.replace('%d', number);
            }

            var defaultRelativeTime = {
                future: 'in %s',
                past: '%s ago',
                s: 'a few seconds',
                ss: '%d seconds',
                m: 'a minute',
                mm: '%d minutes',
                h: 'an hour',
                hh: '%d hours',
                d: 'a day',
                dd: '%d days',
                M: 'a month',
                MM: '%d months',
                y: 'a year',
                yy: '%d years'
            };

            function relativeTime(number, withoutSuffix, string, isFuture) {
                var output = this._relativeTime[string];
                return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
            }

            function pastFuture(diff, output) {
                var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
                return isFunction(format) ? format(output) : format.replace(/%s/i, output);
            }

            var aliases = {};

            function addUnitAlias(unit, shorthand) {
                var lowerCase = unit.toLowerCase();
                aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
            }

            function normalizeUnits(units) {
                return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
            }

            function normalizeObjectUnits(inputObject) {
                var normalizedInput = {},
                    normalizedProp,
                    prop;

                for (prop in inputObject) {
                    if (hasOwnProp(inputObject, prop)) {
                        normalizedProp = normalizeUnits(prop);
                        if (normalizedProp) {
                            normalizedInput[normalizedProp] = inputObject[prop];
                        }
                    }
                }

                return normalizedInput;
            }

            var priorities = {};

            function addUnitPriority(unit, priority) {
                priorities[unit] = priority;
            }

            function getPrioritizedUnits(unitsObj) {
                var units = [];
                for (var u in unitsObj) {
                    units.push({ unit: u, priority: priorities[u] });
                }
                units.sort(function (a, b) {
                    return a.priority - b.priority;
                });
                return units;
            }

            function makeGetSet(unit, keepTime) {
                return function (value) {
                    if (value != null) {
                        set$1(this, unit, value);
                        hooks.updateOffset(this, keepTime);
                        return this;
                    } else {
                        return get(this, unit);
                    }
                };
            }

            function get(mom, unit) {
                return mom.isValid() ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
            }

            function set$1(mom, unit, value) {
                if (mom.isValid()) {
                    mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
                }
            }

            // MOMENTS

            function stringGet(units) {
                units = normalizeUnits(units);
                if (isFunction(this[units])) {
                    return this[units]();
                }
                return this;
            }

            function stringSet(units, value) {
                if ((typeof units === "undefined" ? "undefined" : _typeof(units)) === 'object') {
                    units = normalizeObjectUnits(units);
                    var prioritized = getPrioritizedUnits(units);
                    for (var i = 0; i < prioritized.length; i++) {
                        this[prioritized[i].unit](units[prioritized[i].unit]);
                    }
                } else {
                    units = normalizeUnits(units);
                    if (isFunction(this[units])) {
                        return this[units](value);
                    }
                }
                return this;
            }

            function zeroFill(number, targetLength, forceSign) {
                var absNumber = '' + Math.abs(number),
                    zerosToFill = targetLength - absNumber.length,
                    sign = number >= 0;
                return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
            }

            var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

            var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

            var formatFunctions = {};

            var formatTokenFunctions = {};

            // token:    'M'
            // padded:   ['MM', 2]
            // ordinal:  'Mo'
            // callback: function () { this.month() + 1 }
            function addFormatToken(token, padded, ordinal, callback) {
                var func = callback;
                if (typeof callback === 'string') {
                    func = function func() {
                        return this[callback]();
                    };
                }
                if (token) {
                    formatTokenFunctions[token] = func;
                }
                if (padded) {
                    formatTokenFunctions[padded[0]] = function () {
                        return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
                    };
                }
                if (ordinal) {
                    formatTokenFunctions[ordinal] = function () {
                        return this.localeData().ordinal(func.apply(this, arguments), token);
                    };
                }
            }

            function removeFormattingTokens(input) {
                if (input.match(/\[[\s\S]/)) {
                    return input.replace(/^\[|\]$/g, '');
                }
                return input.replace(/\\/g, '');
            }

            function makeFormatFunction(format) {
                var array = format.match(formattingTokens),
                    i,
                    length;

                for (i = 0, length = array.length; i < length; i++) {
                    if (formatTokenFunctions[array[i]]) {
                        array[i] = formatTokenFunctions[array[i]];
                    } else {
                        array[i] = removeFormattingTokens(array[i]);
                    }
                }

                return function (mom) {
                    var output = '',
                        i;
                    for (i = 0; i < length; i++) {
                        output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
                    }
                    return output;
                };
            }

            // format date using native date object
            function formatMoment(m, format) {
                if (!m.isValid()) {
                    return m.localeData().invalidDate();
                }

                format = expandFormat(format, m.localeData());
                formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

                return formatFunctions[format](m);
            }

            function expandFormat(format, locale) {
                var i = 5;

                function replaceLongDateFormatTokens(input) {
                    return locale.longDateFormat(input) || input;
                }

                localFormattingTokens.lastIndex = 0;
                while (i >= 0 && localFormattingTokens.test(format)) {
                    format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
                    localFormattingTokens.lastIndex = 0;
                    i -= 1;
                }

                return format;
            }

            var match1 = /\d/; //       0 - 9
            var match2 = /\d\d/; //      00 - 99
            var match3 = /\d{3}/; //     000 - 999
            var match4 = /\d{4}/; //    0000 - 9999
            var match6 = /[+-]?\d{6}/; // -999999 - 999999
            var match1to2 = /\d\d?/; //       0 - 99
            var match3to4 = /\d\d\d\d?/; //     999 - 9999
            var match5to6 = /\d\d\d\d\d\d?/; //   99999 - 999999
            var match1to3 = /\d{1,3}/; //       0 - 999
            var match1to4 = /\d{1,4}/; //       0 - 9999
            var match1to6 = /[+-]?\d{1,6}/; // -999999 - 999999

            var matchUnsigned = /\d+/; //       0 - inf
            var matchSigned = /[+-]?\d+/; //    -inf - inf

            var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
            var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

            var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

            // any word (or two) characters or numbers including two/three word month in arabic.
            // includes scottish gaelic two word and hyphenated months
            var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

            var regexes = {};

            function addRegexToken(token, regex, strictRegex) {
                regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
                    return isStrict && strictRegex ? strictRegex : regex;
                };
            }

            function getParseRegexForToken(token, config) {
                if (!hasOwnProp(regexes, token)) {
                    return new RegExp(unescapeFormat(token));
                }

                return regexes[token](config._strict, config._locale);
            }

            // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
            function unescapeFormat(s) {
                return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
                    return p1 || p2 || p3 || p4;
                }));
            }

            function regexEscape(s) {
                return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            }

            var tokens = {};

            function addParseToken(token, callback) {
                var i,
                    func = callback;
                if (typeof token === 'string') {
                    token = [token];
                }
                if (isNumber(callback)) {
                    func = function func(input, array) {
                        array[callback] = toInt(input);
                    };
                }
                for (i = 0; i < token.length; i++) {
                    tokens[token[i]] = func;
                }
            }

            function addWeekParseToken(token, callback) {
                addParseToken(token, function (input, array, config, token) {
                    config._w = config._w || {};
                    callback(input, config._w, config, token);
                });
            }

            function addTimeToArrayFromToken(token, input, config) {
                if (input != null && hasOwnProp(tokens, token)) {
                    tokens[token](input, config._a, config, token);
                }
            }

            var YEAR = 0;
            var MONTH = 1;
            var DATE = 2;
            var HOUR = 3;
            var MINUTE = 4;
            var SECOND = 5;
            var MILLISECOND = 6;
            var WEEK = 7;
            var WEEKDAY = 8;

            var indexOf;

            if (Array.prototype.indexOf) {
                indexOf = Array.prototype.indexOf;
            } else {
                indexOf = function indexOf(o) {
                    // I know
                    var i;
                    for (i = 0; i < this.length; ++i) {
                        if (this[i] === o) {
                            return i;
                        }
                    }
                    return -1;
                };
            }

            var indexOf$1 = indexOf;

            function daysInMonth(year, month) {
                return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
            }

            // FORMATTING

            addFormatToken('M', ['MM', 2], 'Mo', function () {
                return this.month() + 1;
            });

            addFormatToken('MMM', 0, 0, function (format) {
                return this.localeData().monthsShort(this, format);
            });

            addFormatToken('MMMM', 0, 0, function (format) {
                return this.localeData().months(this, format);
            });

            // ALIASES

            addUnitAlias('month', 'M');

            // PRIORITY

            addUnitPriority('month', 8);

            // PARSING

            addRegexToken('M', match1to2);
            addRegexToken('MM', match1to2, match2);
            addRegexToken('MMM', function (isStrict, locale) {
                return locale.monthsShortRegex(isStrict);
            });
            addRegexToken('MMMM', function (isStrict, locale) {
                return locale.monthsRegex(isStrict);
            });

            addParseToken(['M', 'MM'], function (input, array) {
                array[MONTH] = toInt(input) - 1;
            });

            addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
                var month = config._locale.monthsParse(input, token, config._strict);
                // if we didn't find a month name, mark the date as invalid.
                if (month != null) {
                    array[MONTH] = month;
                } else {
                    getParsingFlags(config).invalidMonth = input;
                }
            });

            // LOCALES

            var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
            var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
            function localeMonths(m, format) {
                if (!m) {
                    return isArray(this._months) ? this._months : this._months['standalone'];
                }
                return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
            }

            var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
            function localeMonthsShort(m, format) {
                if (!m) {
                    return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort['standalone'];
                }
                return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
            }

            function handleStrictParse(monthName, format, strict) {
                var i,
                    ii,
                    mom,
                    llc = monthName.toLocaleLowerCase();
                if (!this._monthsParse) {
                    // this is not used
                    this._monthsParse = [];
                    this._longMonthsParse = [];
                    this._shortMonthsParse = [];
                    for (i = 0; i < 12; ++i) {
                        mom = createUTC([2000, i]);
                        this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                        this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
                    }
                }

                if (strict) {
                    if (format === 'MMM') {
                        ii = indexOf$1.call(this._shortMonthsParse, llc);
                        return ii !== -1 ? ii : null;
                    } else {
                        ii = indexOf$1.call(this._longMonthsParse, llc);
                        return ii !== -1 ? ii : null;
                    }
                } else {
                    if (format === 'MMM') {
                        ii = indexOf$1.call(this._shortMonthsParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf$1.call(this._longMonthsParse, llc);
                        return ii !== -1 ? ii : null;
                    } else {
                        ii = indexOf$1.call(this._longMonthsParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf$1.call(this._shortMonthsParse, llc);
                        return ii !== -1 ? ii : null;
                    }
                }
            }

            function localeMonthsParse(monthName, format, strict) {
                var i, mom, regex;

                if (this._monthsParseExact) {
                    return handleStrictParse.call(this, monthName, format, strict);
                }

                if (!this._monthsParse) {
                    this._monthsParse = [];
                    this._longMonthsParse = [];
                    this._shortMonthsParse = [];
                }

                // TODO: add sorting
                // Sorting makes sure if one month (or abbr) is a prefix of another
                // see sorting in computeMonthsParse
                for (i = 0; i < 12; i++) {
                    // make the regex if we don't have it already
                    mom = createUTC([2000, i]);
                    if (strict && !this._longMonthsParse[i]) {
                        this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                        this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                    }
                    if (!strict && !this._monthsParse[i]) {
                        regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                        this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                    }
                    // test the regex
                    if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                        return i;
                    } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                        return i;
                    } else if (!strict && this._monthsParse[i].test(monthName)) {
                        return i;
                    }
                }
            }

            // MOMENTS

            function setMonth(mom, value) {
                var dayOfMonth;

                if (!mom.isValid()) {
                    // No op
                    return mom;
                }

                if (typeof value === 'string') {
                    if (/^\d+$/.test(value)) {
                        value = toInt(value);
                    } else {
                        value = mom.localeData().monthsParse(value);
                        // TODO: Another silent failure?
                        if (!isNumber(value)) {
                            return mom;
                        }
                    }
                }

                dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
                return mom;
            }

            function getSetMonth(value) {
                if (value != null) {
                    setMonth(this, value);
                    hooks.updateOffset(this, true);
                    return this;
                } else {
                    return get(this, 'Month');
                }
            }

            function getDaysInMonth() {
                return daysInMonth(this.year(), this.month());
            }

            var defaultMonthsShortRegex = matchWord;
            function monthsShortRegex(isStrict) {
                if (this._monthsParseExact) {
                    if (!hasOwnProp(this, '_monthsRegex')) {
                        computeMonthsParse.call(this);
                    }
                    if (isStrict) {
                        return this._monthsShortStrictRegex;
                    } else {
                        return this._monthsShortRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_monthsShortRegex')) {
                        this._monthsShortRegex = defaultMonthsShortRegex;
                    }
                    return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
                }
            }

            var defaultMonthsRegex = matchWord;
            function monthsRegex(isStrict) {
                if (this._monthsParseExact) {
                    if (!hasOwnProp(this, '_monthsRegex')) {
                        computeMonthsParse.call(this);
                    }
                    if (isStrict) {
                        return this._monthsStrictRegex;
                    } else {
                        return this._monthsRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_monthsRegex')) {
                        this._monthsRegex = defaultMonthsRegex;
                    }
                    return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
                }
            }

            function computeMonthsParse() {
                function cmpLenRev(a, b) {
                    return b.length - a.length;
                }

                var shortPieces = [],
                    longPieces = [],
                    mixedPieces = [],
                    i,
                    mom;
                for (i = 0; i < 12; i++) {
                    // make the regex if we don't have it already
                    mom = createUTC([2000, i]);
                    shortPieces.push(this.monthsShort(mom, ''));
                    longPieces.push(this.months(mom, ''));
                    mixedPieces.push(this.months(mom, ''));
                    mixedPieces.push(this.monthsShort(mom, ''));
                }
                // Sorting makes sure if one month (or abbr) is a prefix of another it
                // will match the longer piece.
                shortPieces.sort(cmpLenRev);
                longPieces.sort(cmpLenRev);
                mixedPieces.sort(cmpLenRev);
                for (i = 0; i < 12; i++) {
                    shortPieces[i] = regexEscape(shortPieces[i]);
                    longPieces[i] = regexEscape(longPieces[i]);
                }
                for (i = 0; i < 24; i++) {
                    mixedPieces[i] = regexEscape(mixedPieces[i]);
                }

                this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
                this._monthsShortRegex = this._monthsRegex;
                this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
                this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
            }

            // FORMATTING

            addFormatToken('Y', 0, 0, function () {
                var y = this.year();
                return y <= 9999 ? '' + y : '+' + y;
            });

            addFormatToken(0, ['YY', 2], 0, function () {
                return this.year() % 100;
            });

            addFormatToken(0, ['YYYY', 4], 0, 'year');
            addFormatToken(0, ['YYYYY', 5], 0, 'year');
            addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

            // ALIASES

            addUnitAlias('year', 'y');

            // PRIORITIES

            addUnitPriority('year', 1);

            // PARSING

            addRegexToken('Y', matchSigned);
            addRegexToken('YY', match1to2, match2);
            addRegexToken('YYYY', match1to4, match4);
            addRegexToken('YYYYY', match1to6, match6);
            addRegexToken('YYYYYY', match1to6, match6);

            addParseToken(['YYYYY', 'YYYYYY'], YEAR);
            addParseToken('YYYY', function (input, array) {
                array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
            });
            addParseToken('YY', function (input, array) {
                array[YEAR] = hooks.parseTwoDigitYear(input);
            });
            addParseToken('Y', function (input, array) {
                array[YEAR] = parseInt(input, 10);
            });

            // HELPERS

            function daysInYear(year) {
                return isLeapYear(year) ? 366 : 365;
            }

            function isLeapYear(year) {
                return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
            }

            // HOOKS

            hooks.parseTwoDigitYear = function (input) {
                return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
            };

            // MOMENTS

            var getSetYear = makeGetSet('FullYear', true);

            function getIsLeapYear() {
                return isLeapYear(this.year());
            }

            function createDate(y, m, d, h, M, s, ms) {
                // can't just apply() to create a date:
                // https://stackoverflow.com/q/181348
                var date = new Date(y, m, d, h, M, s, ms);

                // the date constructor remaps years 0-99 to 1900-1999
                if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
                    date.setFullYear(y);
                }
                return date;
            }

            function createUTCDate(y) {
                var date = new Date(Date.UTC.apply(null, arguments));

                // the Date.UTC function remaps years 0-99 to 1900-1999
                if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
                    date.setUTCFullYear(y);
                }
                return date;
            }

            // start-of-first-week - start-of-year
            function firstWeekOffset(year, dow, doy) {
                var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
                fwd = 7 + dow - doy,

                // first-week day local weekday -- which local weekday is fwd
                fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

                return -fwdlw + fwd - 1;
            }

            // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
            function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
                var localWeekday = (7 + weekday - dow) % 7,
                    weekOffset = firstWeekOffset(year, dow, doy),
                    dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
                    resYear,
                    resDayOfYear;

                if (dayOfYear <= 0) {
                    resYear = year - 1;
                    resDayOfYear = daysInYear(resYear) + dayOfYear;
                } else if (dayOfYear > daysInYear(year)) {
                    resYear = year + 1;
                    resDayOfYear = dayOfYear - daysInYear(year);
                } else {
                    resYear = year;
                    resDayOfYear = dayOfYear;
                }

                return {
                    year: resYear,
                    dayOfYear: resDayOfYear
                };
            }

            function weekOfYear(mom, dow, doy) {
                var weekOffset = firstWeekOffset(mom.year(), dow, doy),
                    week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
                    resWeek,
                    resYear;

                if (week < 1) {
                    resYear = mom.year() - 1;
                    resWeek = week + weeksInYear(resYear, dow, doy);
                } else if (week > weeksInYear(mom.year(), dow, doy)) {
                    resWeek = week - weeksInYear(mom.year(), dow, doy);
                    resYear = mom.year() + 1;
                } else {
                    resYear = mom.year();
                    resWeek = week;
                }

                return {
                    week: resWeek,
                    year: resYear
                };
            }

            function weeksInYear(year, dow, doy) {
                var weekOffset = firstWeekOffset(year, dow, doy),
                    weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
                return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
            }

            // FORMATTING

            addFormatToken('w', ['ww', 2], 'wo', 'week');
            addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

            // ALIASES

            addUnitAlias('week', 'w');
            addUnitAlias('isoWeek', 'W');

            // PRIORITIES

            addUnitPriority('week', 5);
            addUnitPriority('isoWeek', 5);

            // PARSING

            addRegexToken('w', match1to2);
            addRegexToken('ww', match1to2, match2);
            addRegexToken('W', match1to2);
            addRegexToken('WW', match1to2, match2);

            addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
                week[token.substr(0, 1)] = toInt(input);
            });

            // HELPERS

            // LOCALES

            function localeWeek(mom) {
                return weekOfYear(mom, this._week.dow, this._week.doy).week;
            }

            var defaultLocaleWeek = {
                dow: 0, // Sunday is the first day of the week.
                doy: 6 // The week that contains Jan 1st is the first week of the year.
            };

            function localeFirstDayOfWeek() {
                return this._week.dow;
            }

            function localeFirstDayOfYear() {
                return this._week.doy;
            }

            // MOMENTS

            function getSetWeek(input) {
                var week = this.localeData().week(this);
                return input == null ? week : this.add((input - week) * 7, 'd');
            }

            function getSetISOWeek(input) {
                var week = weekOfYear(this, 1, 4).week;
                return input == null ? week : this.add((input - week) * 7, 'd');
            }

            // FORMATTING

            addFormatToken('d', 0, 'do', 'day');

            addFormatToken('dd', 0, 0, function (format) {
                return this.localeData().weekdaysMin(this, format);
            });

            addFormatToken('ddd', 0, 0, function (format) {
                return this.localeData().weekdaysShort(this, format);
            });

            addFormatToken('dddd', 0, 0, function (format) {
                return this.localeData().weekdays(this, format);
            });

            addFormatToken('e', 0, 0, 'weekday');
            addFormatToken('E', 0, 0, 'isoWeekday');

            // ALIASES

            addUnitAlias('day', 'd');
            addUnitAlias('weekday', 'e');
            addUnitAlias('isoWeekday', 'E');

            // PRIORITY
            addUnitPriority('day', 11);
            addUnitPriority('weekday', 11);
            addUnitPriority('isoWeekday', 11);

            // PARSING

            addRegexToken('d', match1to2);
            addRegexToken('e', match1to2);
            addRegexToken('E', match1to2);
            addRegexToken('dd', function (isStrict, locale) {
                return locale.weekdaysMinRegex(isStrict);
            });
            addRegexToken('ddd', function (isStrict, locale) {
                return locale.weekdaysShortRegex(isStrict);
            });
            addRegexToken('dddd', function (isStrict, locale) {
                return locale.weekdaysRegex(isStrict);
            });

            addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
                var weekday = config._locale.weekdaysParse(input, token, config._strict);
                // if we didn't get a weekday name, mark the date as invalid
                if (weekday != null) {
                    week.d = weekday;
                } else {
                    getParsingFlags(config).invalidWeekday = input;
                }
            });

            addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
                week[token] = toInt(input);
            });

            // HELPERS

            function parseWeekday(input, locale) {
                if (typeof input !== 'string') {
                    return input;
                }

                if (!isNaN(input)) {
                    return parseInt(input, 10);
                }

                input = locale.weekdaysParse(input);
                if (typeof input === 'number') {
                    return input;
                }

                return null;
            }

            function parseIsoWeekday(input, locale) {
                if (typeof input === 'string') {
                    return locale.weekdaysParse(input) % 7 || 7;
                }
                return isNaN(input) ? null : input;
            }

            // LOCALES

            var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
            function localeWeekdays(m, format) {
                if (!m) {
                    return isArray(this._weekdays) ? this._weekdays : this._weekdays['standalone'];
                }
                return isArray(this._weekdays) ? this._weekdays[m.day()] : this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
            }

            var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
            function localeWeekdaysShort(m) {
                return m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
            }

            var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
            function localeWeekdaysMin(m) {
                return m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
            }

            function handleStrictParse$1(weekdayName, format, strict) {
                var i,
                    ii,
                    mom,
                    llc = weekdayName.toLocaleLowerCase();
                if (!this._weekdaysParse) {
                    this._weekdaysParse = [];
                    this._shortWeekdaysParse = [];
                    this._minWeekdaysParse = [];

                    for (i = 0; i < 7; ++i) {
                        mom = createUTC([2000, 1]).day(i);
                        this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                        this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                        this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
                    }
                }

                if (strict) {
                    if (format === 'dddd') {
                        ii = indexOf$1.call(this._weekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    } else if (format === 'ddd') {
                        ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    } else {
                        ii = indexOf$1.call(this._minWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    }
                } else {
                    if (format === 'dddd') {
                        ii = indexOf$1.call(this._weekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf$1.call(this._minWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    } else if (format === 'ddd') {
                        ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf$1.call(this._weekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf$1.call(this._minWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    } else {
                        ii = indexOf$1.call(this._minWeekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf$1.call(this._weekdaysParse, llc);
                        if (ii !== -1) {
                            return ii;
                        }
                        ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                        return ii !== -1 ? ii : null;
                    }
                }
            }

            function localeWeekdaysParse(weekdayName, format, strict) {
                var i, mom, regex;

                if (this._weekdaysParseExact) {
                    return handleStrictParse$1.call(this, weekdayName, format, strict);
                }

                if (!this._weekdaysParse) {
                    this._weekdaysParse = [];
                    this._minWeekdaysParse = [];
                    this._shortWeekdaysParse = [];
                    this._fullWeekdaysParse = [];
                }

                for (i = 0; i < 7; i++) {
                    // make the regex if we don't have it already

                    mom = createUTC([2000, 1]).day(i);
                    if (strict && !this._fullWeekdaysParse[i]) {
                        this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                        this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                        this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
                    }
                    if (!this._weekdaysParse[i]) {
                        regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                        this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                    }
                    // test the regex
                    if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                        return i;
                    } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                        return i;
                    } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                        return i;
                    } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                        return i;
                    }
                }
            }

            // MOMENTS

            function getSetDayOfWeek(input) {
                if (!this.isValid()) {
                    return input != null ? this : NaN;
                }
                var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                if (input != null) {
                    input = parseWeekday(input, this.localeData());
                    return this.add(input - day, 'd');
                } else {
                    return day;
                }
            }

            function getSetLocaleDayOfWeek(input) {
                if (!this.isValid()) {
                    return input != null ? this : NaN;
                }
                var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
                return input == null ? weekday : this.add(input - weekday, 'd');
            }

            function getSetISODayOfWeek(input) {
                if (!this.isValid()) {
                    return input != null ? this : NaN;
                }

                // behaves the same as moment#day except
                // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
                // as a setter, sunday should belong to the previous week.

                if (input != null) {
                    var weekday = parseIsoWeekday(input, this.localeData());
                    return this.day(this.day() % 7 ? weekday : weekday - 7);
                } else {
                    return this.day() || 7;
                }
            }

            var defaultWeekdaysRegex = matchWord;
            function weekdaysRegex(isStrict) {
                if (this._weekdaysParseExact) {
                    if (!hasOwnProp(this, '_weekdaysRegex')) {
                        computeWeekdaysParse.call(this);
                    }
                    if (isStrict) {
                        return this._weekdaysStrictRegex;
                    } else {
                        return this._weekdaysRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_weekdaysRegex')) {
                        this._weekdaysRegex = defaultWeekdaysRegex;
                    }
                    return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
                }
            }

            var defaultWeekdaysShortRegex = matchWord;
            function weekdaysShortRegex(isStrict) {
                if (this._weekdaysParseExact) {
                    if (!hasOwnProp(this, '_weekdaysRegex')) {
                        computeWeekdaysParse.call(this);
                    }
                    if (isStrict) {
                        return this._weekdaysShortStrictRegex;
                    } else {
                        return this._weekdaysShortRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                        this._weekdaysShortRegex = defaultWeekdaysShortRegex;
                    }
                    return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
                }
            }

            var defaultWeekdaysMinRegex = matchWord;
            function weekdaysMinRegex(isStrict) {
                if (this._weekdaysParseExact) {
                    if (!hasOwnProp(this, '_weekdaysRegex')) {
                        computeWeekdaysParse.call(this);
                    }
                    if (isStrict) {
                        return this._weekdaysMinStrictRegex;
                    } else {
                        return this._weekdaysMinRegex;
                    }
                } else {
                    if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                        this._weekdaysMinRegex = defaultWeekdaysMinRegex;
                    }
                    return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
                }
            }

            function computeWeekdaysParse() {
                function cmpLenRev(a, b) {
                    return b.length - a.length;
                }

                var minPieces = [],
                    shortPieces = [],
                    longPieces = [],
                    mixedPieces = [],
                    i,
                    mom,
                    minp,
                    shortp,
                    longp;
                for (i = 0; i < 7; i++) {
                    // make the regex if we don't have it already
                    mom = createUTC([2000, 1]).day(i);
                    minp = this.weekdaysMin(mom, '');
                    shortp = this.weekdaysShort(mom, '');
                    longp = this.weekdays(mom, '');
                    minPieces.push(minp);
                    shortPieces.push(shortp);
                    longPieces.push(longp);
                    mixedPieces.push(minp);
                    mixedPieces.push(shortp);
                    mixedPieces.push(longp);
                }
                // Sorting makes sure if one weekday (or abbr) is a prefix of another it
                // will match the longer piece.
                minPieces.sort(cmpLenRev);
                shortPieces.sort(cmpLenRev);
                longPieces.sort(cmpLenRev);
                mixedPieces.sort(cmpLenRev);
                for (i = 0; i < 7; i++) {
                    shortPieces[i] = regexEscape(shortPieces[i]);
                    longPieces[i] = regexEscape(longPieces[i]);
                    mixedPieces[i] = regexEscape(mixedPieces[i]);
                }

                this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
                this._weekdaysShortRegex = this._weekdaysRegex;
                this._weekdaysMinRegex = this._weekdaysRegex;

                this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
                this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
                this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
            }

            // FORMATTING

            function hFormat() {
                return this.hours() % 12 || 12;
            }

            function kFormat() {
                return this.hours() || 24;
            }

            addFormatToken('H', ['HH', 2], 0, 'hour');
            addFormatToken('h', ['hh', 2], 0, hFormat);
            addFormatToken('k', ['kk', 2], 0, kFormat);

            addFormatToken('hmm', 0, 0, function () {
                return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
            });

            addFormatToken('hmmss', 0, 0, function () {
                return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
            });

            addFormatToken('Hmm', 0, 0, function () {
                return '' + this.hours() + zeroFill(this.minutes(), 2);
            });

            addFormatToken('Hmmss', 0, 0, function () {
                return '' + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
            });

            function meridiem(token, lowercase) {
                addFormatToken(token, 0, 0, function () {
                    return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
                });
            }

            meridiem('a', true);
            meridiem('A', false);

            // ALIASES

            addUnitAlias('hour', 'h');

            // PRIORITY
            addUnitPriority('hour', 13);

            // PARSING

            function matchMeridiem(isStrict, locale) {
                return locale._meridiemParse;
            }

            addRegexToken('a', matchMeridiem);
            addRegexToken('A', matchMeridiem);
            addRegexToken('H', match1to2);
            addRegexToken('h', match1to2);
            addRegexToken('k', match1to2);
            addRegexToken('HH', match1to2, match2);
            addRegexToken('hh', match1to2, match2);
            addRegexToken('kk', match1to2, match2);

            addRegexToken('hmm', match3to4);
            addRegexToken('hmmss', match5to6);
            addRegexToken('Hmm', match3to4);
            addRegexToken('Hmmss', match5to6);

            addParseToken(['H', 'HH'], HOUR);
            addParseToken(['k', 'kk'], function (input, array, config) {
                var kInput = toInt(input);
                array[HOUR] = kInput === 24 ? 0 : kInput;
            });
            addParseToken(['a', 'A'], function (input, array, config) {
                config._isPm = config._locale.isPM(input);
                config._meridiem = input;
            });
            addParseToken(['h', 'hh'], function (input, array, config) {
                array[HOUR] = toInt(input);
                getParsingFlags(config).bigHour = true;
            });
            addParseToken('hmm', function (input, array, config) {
                var pos = input.length - 2;
                array[HOUR] = toInt(input.substr(0, pos));
                array[MINUTE] = toInt(input.substr(pos));
                getParsingFlags(config).bigHour = true;
            });
            addParseToken('hmmss', function (input, array, config) {
                var pos1 = input.length - 4;
                var pos2 = input.length - 2;
                array[HOUR] = toInt(input.substr(0, pos1));
                array[MINUTE] = toInt(input.substr(pos1, 2));
                array[SECOND] = toInt(input.substr(pos2));
                getParsingFlags(config).bigHour = true;
            });
            addParseToken('Hmm', function (input, array, config) {
                var pos = input.length - 2;
                array[HOUR] = toInt(input.substr(0, pos));
                array[MINUTE] = toInt(input.substr(pos));
            });
            addParseToken('Hmmss', function (input, array, config) {
                var pos1 = input.length - 4;
                var pos2 = input.length - 2;
                array[HOUR] = toInt(input.substr(0, pos1));
                array[MINUTE] = toInt(input.substr(pos1, 2));
                array[SECOND] = toInt(input.substr(pos2));
            });

            // LOCALES

            function localeIsPM(input) {
                // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
                // Using charAt should be more compatible.
                return (input + '').toLowerCase().charAt(0) === 'p';
            }

            var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
            function localeMeridiem(hours, minutes, isLower) {
                if (hours > 11) {
                    return isLower ? 'pm' : 'PM';
                } else {
                    return isLower ? 'am' : 'AM';
                }
            }

            // MOMENTS

            // Setting the hour should keep the time, because the user explicitly
            // specified which hour he wants. So trying to maintain the same hour (in
            // a new timezone) makes sense. Adding/subtracting hours does not follow
            // this rule.
            var getSetHour = makeGetSet('Hours', true);

            // months
            // week
            // weekdays
            // meridiem
            var baseConfig = {
                calendar: defaultCalendar,
                longDateFormat: defaultLongDateFormat,
                invalidDate: defaultInvalidDate,
                ordinal: defaultOrdinal,
                dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
                relativeTime: defaultRelativeTime,

                months: defaultLocaleMonths,
                monthsShort: defaultLocaleMonthsShort,

                week: defaultLocaleWeek,

                weekdays: defaultLocaleWeekdays,
                weekdaysMin: defaultLocaleWeekdaysMin,
                weekdaysShort: defaultLocaleWeekdaysShort,

                meridiemParse: defaultLocaleMeridiemParse
            };

            // internal storage for locale config files
            var locales = {};
            var localeFamilies = {};
            var globalLocale;

            function normalizeLocale(key) {
                return key ? key.toLowerCase().replace('_', '-') : key;
            }

            // pick the locale from the array
            // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
            // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
            function chooseLocale(names) {
                var i = 0,
                    j,
                    next,
                    locale,
                    split;

                while (i < names.length) {
                    split = normalizeLocale(names[i]).split('-');
                    j = split.length;
                    next = normalizeLocale(names[i + 1]);
                    next = next ? next.split('-') : null;
                    while (j > 0) {
                        locale = loadLocale(split.slice(0, j).join('-'));
                        if (locale) {
                            return locale;
                        }
                        if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                            //the next array item is better than a shallower substring of this one
                            break;
                        }
                        j--;
                    }
                    i++;
                }
                return null;
            }

            function loadLocale(name) {
                var oldLocale = null;
                // TODO: Find a better way to register and load all the locales in Node
                if (!locales[name] && typeof module !== 'undefined' && module && module.exports) {
                    try {
                        oldLocale = globalLocale._abbr;
                        require('./locale/' + name);
                        // because defineLocale currently also sets the global locale, we
                        // want to undo that for lazy loaded locales
                        getSetGlobalLocale(oldLocale);
                    } catch (e) {}
                }
                return locales[name];
            }

            // This function will load locale and then set the global locale.  If
            // no arguments are passed in, it will simply return the current global
            // locale key.
            function getSetGlobalLocale(key, values) {
                var data;
                if (key) {
                    if (isUndefined(values)) {
                        data = getLocale(key);
                    } else {
                        data = defineLocale(key, values);
                    }

                    if (data) {
                        // moment.duration._locale = moment._locale = data;
                        globalLocale = data;
                    }
                }

                return globalLocale._abbr;
            }

            function defineLocale(name, config) {
                if (config !== null) {
                    var parentConfig = baseConfig;
                    config.abbr = name;
                    if (locales[name] != null) {
                        deprecateSimple('defineLocaleOverride', 'use moment.updateLocale(localeName, config) to change ' + 'an existing locale. moment.defineLocale(localeName, ' + 'config) should only be used for creating a new locale ' + 'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                        parentConfig = locales[name]._config;
                    } else if (config.parentLocale != null) {
                        if (locales[config.parentLocale] != null) {
                            parentConfig = locales[config.parentLocale]._config;
                        } else {
                            if (!localeFamilies[config.parentLocale]) {
                                localeFamilies[config.parentLocale] = [];
                            }
                            localeFamilies[config.parentLocale].push({
                                name: name,
                                config: config
                            });
                            return null;
                        }
                    }
                    locales[name] = new Locale(mergeConfigs(parentConfig, config));

                    if (localeFamilies[name]) {
                        localeFamilies[name].forEach(function (x) {
                            defineLocale(x.name, x.config);
                        });
                    }

                    // backwards compat for now: also set the locale
                    // make sure we set the locale AFTER all child locales have been
                    // created, so we won't end up with the child locale set.
                    getSetGlobalLocale(name);

                    return locales[name];
                } else {
                    // useful for testing
                    delete locales[name];
                    return null;
                }
            }

            function updateLocale(name, config) {
                if (config != null) {
                    var locale,
                        parentConfig = baseConfig;
                    // MERGE
                    if (locales[name] != null) {
                        parentConfig = locales[name]._config;
                    }
                    config = mergeConfigs(parentConfig, config);
                    locale = new Locale(config);
                    locale.parentLocale = locales[name];
                    locales[name] = locale;

                    // backwards compat for now: also set the locale
                    getSetGlobalLocale(name);
                } else {
                    // pass null for config to unupdate, useful for tests
                    if (locales[name] != null) {
                        if (locales[name].parentLocale != null) {
                            locales[name] = locales[name].parentLocale;
                        } else if (locales[name] != null) {
                            delete locales[name];
                        }
                    }
                }
                return locales[name];
            }

            // returns locale data
            function getLocale(key) {
                var locale;

                if (key && key._locale && key._locale._abbr) {
                    key = key._locale._abbr;
                }

                if (!key) {
                    return globalLocale;
                }

                if (!isArray(key)) {
                    //short-circuit everything else
                    locale = loadLocale(key);
                    if (locale) {
                        return locale;
                    }
                    key = [key];
                }

                return chooseLocale(key);
            }

            function listLocales() {
                return keys$1(locales);
            }

            function checkOverflow(m) {
                var overflow;
                var a = m._a;

                if (a && getParsingFlags(m).overflow === -2) {
                    overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;

                    if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                        overflow = DATE;
                    }
                    if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                        overflow = WEEK;
                    }
                    if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                        overflow = WEEKDAY;
                    }

                    getParsingFlags(m).overflow = overflow;
                }

                return m;
            }

            // iso 8601 regex
            // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
            var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
            var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

            var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

            var isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/], ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/], ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/], ['GGGG-[W]WW', /\d{4}-W\d\d/, false], ['YYYY-DDD', /\d{4}-\d{3}/], ['YYYY-MM', /\d{4}-\d\d/, false], ['YYYYYYMMDD', /[+-]\d{10}/], ['YYYYMMDD', /\d{8}/],
            // YYYYMM is NOT allowed by the standard
            ['GGGG[W]WWE', /\d{4}W\d{3}/], ['GGGG[W]WW', /\d{4}W\d{2}/, false], ['YYYYDDD', /\d{7}/]];

            // iso time formats and regexes
            var isoTimes = [['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/], ['HH:mm:ss', /\d\d:\d\d:\d\d/], ['HH:mm', /\d\d:\d\d/], ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/], ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/], ['HHmmss', /\d\d\d\d\d\d/], ['HHmm', /\d\d\d\d/], ['HH', /\d\d/]];

            var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

            // date from iso format
            function configFromISO(config) {
                var i,
                    l,
                    string = config._i,
                    match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
                    allowTime,
                    dateFormat,
                    timeFormat,
                    tzFormat;

                if (match) {
                    getParsingFlags(config).iso = true;

                    for (i = 0, l = isoDates.length; i < l; i++) {
                        if (isoDates[i][1].exec(match[1])) {
                            dateFormat = isoDates[i][0];
                            allowTime = isoDates[i][2] !== false;
                            break;
                        }
                    }
                    if (dateFormat == null) {
                        config._isValid = false;
                        return;
                    }
                    if (match[3]) {
                        for (i = 0, l = isoTimes.length; i < l; i++) {
                            if (isoTimes[i][1].exec(match[3])) {
                                // match[2] should be 'T' or space
                                timeFormat = (match[2] || ' ') + isoTimes[i][0];
                                break;
                            }
                        }
                        if (timeFormat == null) {
                            config._isValid = false;
                            return;
                        }
                    }
                    if (!allowTime && timeFormat != null) {
                        config._isValid = false;
                        return;
                    }
                    if (match[4]) {
                        if (tzRegex.exec(match[4])) {
                            tzFormat = 'Z';
                        } else {
                            config._isValid = false;
                            return;
                        }
                    }
                    config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
                    configFromStringAndFormat(config);
                } else {
                    config._isValid = false;
                }
            }

            // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
            var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

            // date and time from ref 2822 format
            function configFromRFC2822(config) {
                var string, match, dayFormat, dateFormat, timeFormat, tzFormat;
                var timezones = {
                    ' GMT': ' +0000',
                    ' EDT': ' -0400',
                    ' EST': ' -0500',
                    ' CDT': ' -0500',
                    ' CST': ' -0600',
                    ' MDT': ' -0600',
                    ' MST': ' -0700',
                    ' PDT': ' -0700',
                    ' PST': ' -0800'
                };
                var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
                var timezone, timezoneIndex;

                string = config._i.replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
                .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
                .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
                match = basicRfcRegex.exec(string);

                if (match) {
                    dayFormat = match[1] ? 'ddd' + (match[1].length === 5 ? ', ' : ' ') : '';
                    dateFormat = 'D MMM ' + (match[2].length > 10 ? 'YYYY ' : 'YY ');
                    timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

                    // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
                    if (match[1]) {
                        // day of week given
                        var momentDate = new Date(match[2]);
                        var momentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][momentDate.getDay()];

                        if (match[1].substr(0, 3) !== momentDay) {
                            getParsingFlags(config).weekdayMismatch = true;
                            config._isValid = false;
                            return;
                        }
                    }

                    switch (match[5].length) {
                        case 2:
                            // military
                            if (timezoneIndex === 0) {
                                timezone = ' +0000';
                            } else {
                                timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
                                timezone = (timezoneIndex < 0 ? ' -' : ' +') + ('' + timezoneIndex).replace(/^-?/, '0').match(/..$/)[0] + '00';
                            }
                            break;
                        case 4:
                            // Zone
                            timezone = timezones[match[5]];
                            break;
                        default:
                            // UT or +/-9999
                            timezone = timezones[' GMT'];
                    }
                    match[5] = timezone;
                    config._i = match.splice(1).join('');
                    tzFormat = ' ZZ';
                    config._f = dayFormat + dateFormat + timeFormat + tzFormat;
                    configFromStringAndFormat(config);
                    getParsingFlags(config).rfc2822 = true;
                } else {
                    config._isValid = false;
                }
            }

            // date from iso format or fallback
            function configFromString(config) {
                var matched = aspNetJsonRegex.exec(config._i);

                if (matched !== null) {
                    config._d = new Date(+matched[1]);
                    return;
                }

                configFromISO(config);
                if (config._isValid === false) {
                    delete config._isValid;
                } else {
                    return;
                }

                configFromRFC2822(config);
                if (config._isValid === false) {
                    delete config._isValid;
                } else {
                    return;
                }

                // Final attempt, use Input Fallback
                hooks.createFromInputFallback(config);
            }

            hooks.createFromInputFallback = deprecate('value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' + 'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' + 'discouraged and will be removed in an upcoming major release. Please refer to ' + 'http://momentjs.com/guides/#/warnings/js-date/ for more info.', function (config) {
                config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
            });

            // Pick the first defined of two or three arguments.
            function defaults(a, b, c) {
                if (a != null) {
                    return a;
                }
                if (b != null) {
                    return b;
                }
                return c;
            }

            function currentDateArray(config) {
                // hooks is actually the exported moment object
                var nowValue = new Date(hooks.now());
                if (config._useUTC) {
                    return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
                }
                return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
            }

            // convert an array to a date.
            // the array should mirror the parameters below
            // note: all values past the year are optional and will default to the lowest possible value.
            // [year, month, day , hour, minute, second, millisecond]
            function configFromArray(config) {
                var i,
                    date,
                    input = [],
                    currentDate,
                    yearToUse;

                if (config._d) {
                    return;
                }

                currentDate = currentDateArray(config);

                //compute day of the year from weeks and weekdays
                if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
                    dayOfYearFromWeekInfo(config);
                }

                //if the day of the year is set, figure out what it is
                if (config._dayOfYear != null) {
                    yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

                    if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                        getParsingFlags(config)._overflowDayOfYear = true;
                    }

                    date = createUTCDate(yearToUse, 0, config._dayOfYear);
                    config._a[MONTH] = date.getUTCMonth();
                    config._a[DATE] = date.getUTCDate();
                }

                // Default to current date.
                // * if no year, month, day of month are given, default to today
                // * if day of month is given, default month and year
                // * if month is given, default only year
                // * if year is given, don't default anything
                for (i = 0; i < 3 && config._a[i] == null; ++i) {
                    config._a[i] = input[i] = currentDate[i];
                }

                // Zero out whatever was not defaulted, including time
                for (; i < 7; i++) {
                    config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
                }

                // Check for 24:00:00.000
                if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
                    config._nextDay = true;
                    config._a[HOUR] = 0;
                }

                config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
                // Apply timezone offset from input. The actual utcOffset can be changed
                // with parseZone.
                if (config._tzm != null) {
                    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
                }

                if (config._nextDay) {
                    config._a[HOUR] = 24;
                }
            }

            function dayOfYearFromWeekInfo(config) {
                var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

                w = config._w;
                if (w.GG != null || w.W != null || w.E != null) {
                    dow = 1;
                    doy = 4;

                    // TODO: We need to take the current isoWeekYear, but that depends on
                    // how we interpret now (local, utc, fixed offset). So create
                    // a now version of current config (take local/utc/offset flags, and
                    // create now).
                    weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
                    week = defaults(w.W, 1);
                    weekday = defaults(w.E, 1);
                    if (weekday < 1 || weekday > 7) {
                        weekdayOverflow = true;
                    }
                } else {
                    dow = config._locale._week.dow;
                    doy = config._locale._week.doy;

                    var curWeek = weekOfYear(createLocal(), dow, doy);

                    weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

                    // Default to current week.
                    week = defaults(w.w, curWeek.week);

                    if (w.d != null) {
                        // weekday -- low day numbers are considered next week
                        weekday = w.d;
                        if (weekday < 0 || weekday > 6) {
                            weekdayOverflow = true;
                        }
                    } else if (w.e != null) {
                        // local weekday -- counting starts from begining of week
                        weekday = w.e + dow;
                        if (w.e < 0 || w.e > 6) {
                            weekdayOverflow = true;
                        }
                    } else {
                        // default to begining of week
                        weekday = dow;
                    }
                }
                if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
                    getParsingFlags(config)._overflowWeeks = true;
                } else if (weekdayOverflow != null) {
                    getParsingFlags(config)._overflowWeekday = true;
                } else {
                    temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
                    config._a[YEAR] = temp.year;
                    config._dayOfYear = temp.dayOfYear;
                }
            }

            // constant that refers to the ISO standard
            hooks.ISO_8601 = function () {};

            // constant that refers to the RFC 2822 form
            hooks.RFC_2822 = function () {};

            // date from string and format string
            function configFromStringAndFormat(config) {
                // TODO: Move this to another part of the creation flow to prevent circular deps
                if (config._f === hooks.ISO_8601) {
                    configFromISO(config);
                    return;
                }
                if (config._f === hooks.RFC_2822) {
                    configFromRFC2822(config);
                    return;
                }
                config._a = [];
                getParsingFlags(config).empty = true;

                // This array is used to make a Date, either with `new Date` or `Date.UTC`
                var string = '' + config._i,
                    i,
                    parsedInput,
                    tokens,
                    token,
                    skipped,
                    stringLength = string.length,
                    totalParsedInputLength = 0;

                tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

                for (i = 0; i < tokens.length; i++) {
                    token = tokens[i];
                    parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
                    // console.log('token', token, 'parsedInput', parsedInput,
                    //         'regex', getParseRegexForToken(token, config));
                    if (parsedInput) {
                        skipped = string.substr(0, string.indexOf(parsedInput));
                        if (skipped.length > 0) {
                            getParsingFlags(config).unusedInput.push(skipped);
                        }
                        string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                        totalParsedInputLength += parsedInput.length;
                    }
                    // don't parse if it's not a known token
                    if (formatTokenFunctions[token]) {
                        if (parsedInput) {
                            getParsingFlags(config).empty = false;
                        } else {
                            getParsingFlags(config).unusedTokens.push(token);
                        }
                        addTimeToArrayFromToken(token, parsedInput, config);
                    } else if (config._strict && !parsedInput) {
                        getParsingFlags(config).unusedTokens.push(token);
                    }
                }

                // add remaining unparsed input length to the string
                getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
                if (string.length > 0) {
                    getParsingFlags(config).unusedInput.push(string);
                }

                // clear _12h flag if hour is <= 12
                if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
                    getParsingFlags(config).bigHour = undefined;
                }

                getParsingFlags(config).parsedDateParts = config._a.slice(0);
                getParsingFlags(config).meridiem = config._meridiem;
                // handle meridiem
                config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

                configFromArray(config);
                checkOverflow(config);
            }

            function meridiemFixWrap(locale, hour, meridiem) {
                var isPm;

                if (meridiem == null) {
                    // nothing to do
                    return hour;
                }
                if (locale.meridiemHour != null) {
                    return locale.meridiemHour(hour, meridiem);
                } else if (locale.isPM != null) {
                    // Fallback
                    isPm = locale.isPM(meridiem);
                    if (isPm && hour < 12) {
                        hour += 12;
                    }
                    if (!isPm && hour === 12) {
                        hour = 0;
                    }
                    return hour;
                } else {
                    // this is not supposed to happen
                    return hour;
                }
            }

            // date from string and array of format strings
            function configFromStringAndArray(config) {
                var tempConfig, bestMoment, scoreToBeat, i, currentScore;

                if (config._f.length === 0) {
                    getParsingFlags(config).invalidFormat = true;
                    config._d = new Date(NaN);
                    return;
                }

                for (i = 0; i < config._f.length; i++) {
                    currentScore = 0;
                    tempConfig = copyConfig({}, config);
                    if (config._useUTC != null) {
                        tempConfig._useUTC = config._useUTC;
                    }
                    tempConfig._f = config._f[i];
                    configFromStringAndFormat(tempConfig);

                    if (!isValid(tempConfig)) {
                        continue;
                    }

                    // if there is any input that was not parsed add a penalty for that format
                    currentScore += getParsingFlags(tempConfig).charsLeftOver;

                    //or tokens
                    currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

                    getParsingFlags(tempConfig).score = currentScore;

                    if (scoreToBeat == null || currentScore < scoreToBeat) {
                        scoreToBeat = currentScore;
                        bestMoment = tempConfig;
                    }
                }

                extend(config, bestMoment || tempConfig);
            }

            function configFromObject(config) {
                if (config._d) {
                    return;
                }

                var i = normalizeObjectUnits(config._i);
                config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
                    return obj && parseInt(obj, 10);
                });

                configFromArray(config);
            }

            function createFromConfig(config) {
                var res = new Moment(checkOverflow(prepareConfig(config)));
                if (res._nextDay) {
                    // Adding is smart enough around DST
                    res.add(1, 'd');
                    res._nextDay = undefined;
                }

                return res;
            }

            function prepareConfig(config) {
                var input = config._i,
                    format = config._f;

                config._locale = config._locale || getLocale(config._l);

                if (input === null || format === undefined && input === '') {
                    return createInvalid({ nullInput: true });
                }

                if (typeof input === 'string') {
                    config._i = input = config._locale.preparse(input);
                }

                if (isMoment(input)) {
                    return new Moment(checkOverflow(input));
                } else if (isDate(input)) {
                    config._d = input;
                } else if (isArray(format)) {
                    configFromStringAndArray(config);
                } else if (format) {
                    configFromStringAndFormat(config);
                } else {
                    configFromInput(config);
                }

                if (!isValid(config)) {
                    config._d = null;
                }

                return config;
            }

            function configFromInput(config) {
                var input = config._i;
                if (isUndefined(input)) {
                    config._d = new Date(hooks.now());
                } else if (isDate(input)) {
                    config._d = new Date(input.valueOf());
                } else if (typeof input === 'string') {
                    configFromString(config);
                } else if (isArray(input)) {
                    config._a = map(input.slice(0), function (obj) {
                        return parseInt(obj, 10);
                    });
                    configFromArray(config);
                } else if (isObject(input)) {
                    configFromObject(config);
                } else if (isNumber(input)) {
                    // from milliseconds
                    config._d = new Date(input);
                } else {
                    hooks.createFromInputFallback(config);
                }
            }

            function createLocalOrUTC(input, format, locale, strict, isUTC) {
                var c = {};

                if (locale === true || locale === false) {
                    strict = locale;
                    locale = undefined;
                }

                if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
                    input = undefined;
                }
                // object construction must be done this way.
                // https://github.com/moment/moment/issues/1423
                c._isAMomentObject = true;
                c._useUTC = c._isUTC = isUTC;
                c._l = locale;
                c._i = input;
                c._f = format;
                c._strict = strict;

                return createFromConfig(c);
            }

            function createLocal(input, format, locale, strict) {
                return createLocalOrUTC(input, format, locale, strict, false);
            }

            var prototypeMin = deprecate('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            });

            var prototypeMax = deprecate('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            });

            // Pick a moment m from moments so that m[fn](other) is true for all
            // other. This relies on the function fn to be transitive.
            //
            // moments should either be an array of moment objects or an array, whose
            // first element is an array of moment objects.
            function pickBy(fn, moments) {
                var res, i;
                if (moments.length === 1 && isArray(moments[0])) {
                    moments = moments[0];
                }
                if (!moments.length) {
                    return createLocal();
                }
                res = moments[0];
                for (i = 1; i < moments.length; ++i) {
                    if (!moments[i].isValid() || moments[i][fn](res)) {
                        res = moments[i];
                    }
                }
                return res;
            }

            // TODO: Use [].sort instead?
            function min() {
                var args = [].slice.call(arguments, 0);

                return pickBy('isBefore', args);
            }

            function max() {
                var args = [].slice.call(arguments, 0);

                return pickBy('isAfter', args);
            }

            var now = function now() {
                return Date.now ? Date.now() : +new Date();
            };

            var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

            function isDurationValid(m) {
                for (var key in m) {
                    if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                        return false;
                    }
                }

                var unitHasDecimal = false;
                for (var i = 0; i < ordering.length; ++i) {
                    if (m[ordering[i]]) {
                        if (unitHasDecimal) {
                            return false; // only allow non-integers for smallest unit
                        }
                        if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                            unitHasDecimal = true;
                        }
                    }
                }

                return true;
            }

            function isValid$1() {
                return this._isValid;
            }

            function createInvalid$1() {
                return createDuration(NaN);
            }

            function Duration(duration) {
                var normalizedInput = normalizeObjectUnits(duration),
                    years = normalizedInput.year || 0,
                    quarters = normalizedInput.quarter || 0,
                    months = normalizedInput.month || 0,
                    weeks = normalizedInput.week || 0,
                    days = normalizedInput.day || 0,
                    hours = normalizedInput.hour || 0,
                    minutes = normalizedInput.minute || 0,
                    seconds = normalizedInput.second || 0,
                    milliseconds = normalizedInput.millisecond || 0;

                this._isValid = isDurationValid(normalizedInput);

                // representation for dateAddRemove
                this._milliseconds = +milliseconds + seconds * 1e3 + // 1000
                minutes * 6e4 + // 1000 * 60
                hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
                // Because of dateAddRemove treats 24 hours as different from a
                // day when working around DST, we need to store them separately
                this._days = +days + weeks * 7;
                // It is impossible translate months into days without knowing
                // which months you are are talking about, so we have to store
                // it separately.
                this._months = +months + quarters * 3 + years * 12;

                this._data = {};

                this._locale = getLocale();

                this._bubble();
            }

            function isDuration(obj) {
                return obj instanceof Duration;
            }

            function absRound(number) {
                if (number < 0) {
                    return Math.round(-1 * number) * -1;
                } else {
                    return Math.round(number);
                }
            }

            // FORMATTING

            function offset(token, separator) {
                addFormatToken(token, 0, 0, function () {
                    var offset = this.utcOffset();
                    var sign = '+';
                    if (offset < 0) {
                        offset = -offset;
                        sign = '-';
                    }
                    return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
                });
            }

            offset('Z', ':');
            offset('ZZ', '');

            // PARSING

            addRegexToken('Z', matchShortOffset);
            addRegexToken('ZZ', matchShortOffset);
            addParseToken(['Z', 'ZZ'], function (input, array, config) {
                config._useUTC = true;
                config._tzm = offsetFromString(matchShortOffset, input);
            });

            // HELPERS

            // timezone chunker
            // '+10:00' > ['10',  '00']
            // '-1530'  > ['-15', '30']
            var chunkOffset = /([\+\-]|\d\d)/gi;

            function offsetFromString(matcher, string) {
                var matches = (string || '').match(matcher);

                if (matches === null) {
                    return null;
                }

                var chunk = matches[matches.length - 1] || [];
                var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
                var minutes = +(parts[1] * 60) + toInt(parts[2]);

                return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
            }

            // Return a moment from input, that is local/utc/zone equivalent to model.
            function cloneWithOffset(input, model) {
                var res, diff;
                if (model._isUTC) {
                    res = model.clone();
                    diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
                    // Use low-level api, because this fn is low-level api.
                    res._d.setTime(res._d.valueOf() + diff);
                    hooks.updateOffset(res, false);
                    return res;
                } else {
                    return createLocal(input).local();
                }
            }

            function getDateOffset(m) {
                // On Firefox.24 Date#getTimezoneOffset returns a floating point.
                // https://github.com/moment/moment/pull/1871
                return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
            }

            // HOOKS

            // This function will be called whenever a moment is mutated.
            // It is intended to keep the offset in sync with the timezone.
            hooks.updateOffset = function () {};

            // MOMENTS

            // keepLocalTime = true means only change the timezone, without
            // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
            // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
            // +0200, so we adjust the time as needed, to be valid.
            //
            // Keeping the time actually adds/subtracts (one hour)
            // from the actual represented time. That is why we call updateOffset
            // a second time. In case it wants us to change the offset again
            // _changeInProgress == true case, then we have to adjust, because
            // there is no such time in the given timezone.
            function getSetOffset(input, keepLocalTime, keepMinutes) {
                var offset = this._offset || 0,
                    localAdjust;
                if (!this.isValid()) {
                    return input != null ? this : NaN;
                }
                if (input != null) {
                    if (typeof input === 'string') {
                        input = offsetFromString(matchShortOffset, input);
                        if (input === null) {
                            return this;
                        }
                    } else if (Math.abs(input) < 16 && !keepMinutes) {
                        input = input * 60;
                    }
                    if (!this._isUTC && keepLocalTime) {
                        localAdjust = getDateOffset(this);
                    }
                    this._offset = input;
                    this._isUTC = true;
                    if (localAdjust != null) {
                        this.add(localAdjust, 'm');
                    }
                    if (offset !== input) {
                        if (!keepLocalTime || this._changeInProgress) {
                            addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                        } else if (!this._changeInProgress) {
                            this._changeInProgress = true;
                            hooks.updateOffset(this, true);
                            this._changeInProgress = null;
                        }
                    }
                    return this;
                } else {
                    return this._isUTC ? offset : getDateOffset(this);
                }
            }

            function getSetZone(input, keepLocalTime) {
                if (input != null) {
                    if (typeof input !== 'string') {
                        input = -input;
                    }

                    this.utcOffset(input, keepLocalTime);

                    return this;
                } else {
                    return -this.utcOffset();
                }
            }

            function setOffsetToUTC(keepLocalTime) {
                return this.utcOffset(0, keepLocalTime);
            }

            function setOffsetToLocal(keepLocalTime) {
                if (this._isUTC) {
                    this.utcOffset(0, keepLocalTime);
                    this._isUTC = false;

                    if (keepLocalTime) {
                        this.subtract(getDateOffset(this), 'm');
                    }
                }
                return this;
            }

            function setOffsetToParsedOffset() {
                if (this._tzm != null) {
                    this.utcOffset(this._tzm, false, true);
                } else if (typeof this._i === 'string') {
                    var tZone = offsetFromString(matchOffset, this._i);
                    if (tZone != null) {
                        this.utcOffset(tZone);
                    } else {
                        this.utcOffset(0, true);
                    }
                }
                return this;
            }

            function hasAlignedHourOffset(input) {
                if (!this.isValid()) {
                    return false;
                }
                input = input ? createLocal(input).utcOffset() : 0;

                return (this.utcOffset() - input) % 60 === 0;
            }

            function isDaylightSavingTime() {
                return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
            }

            function isDaylightSavingTimeShifted() {
                if (!isUndefined(this._isDSTShifted)) {
                    return this._isDSTShifted;
                }

                var c = {};

                copyConfig(c, this);
                c = prepareConfig(c);

                if (c._a) {
                    var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
                    this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
                } else {
                    this._isDSTShifted = false;
                }

                return this._isDSTShifted;
            }

            function isLocal() {
                return this.isValid() ? !this._isUTC : false;
            }

            function isUtcOffset() {
                return this.isValid() ? this._isUTC : false;
            }

            function isUtc() {
                return this.isValid() ? this._isUTC && this._offset === 0 : false;
            }

            // ASP.NET json date format regex
            var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

            // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
            // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
            // and further modified to allow for strings containing both week and day
            var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

            function createDuration(input, key) {
                var duration = input,

                // matching against regexp is expensive, do it on demand
                match = null,
                    sign,
                    ret,
                    diffRes;

                if (isDuration(input)) {
                    duration = {
                        ms: input._milliseconds,
                        d: input._days,
                        M: input._months
                    };
                } else if (isNumber(input)) {
                    duration = {};
                    if (key) {
                        duration[key] = input;
                    } else {
                        duration.milliseconds = input;
                    }
                } else if (!!(match = aspNetRegex.exec(input))) {
                    sign = match[1] === '-' ? -1 : 1;
                    duration = {
                        y: 0,
                        d: toInt(match[DATE]) * sign,
                        h: toInt(match[HOUR]) * sign,
                        m: toInt(match[MINUTE]) * sign,
                        s: toInt(match[SECOND]) * sign,
                        ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
                    };
                } else if (!!(match = isoRegex.exec(input))) {
                    sign = match[1] === '-' ? -1 : 1;
                    duration = {
                        y: parseIso(match[2], sign),
                        M: parseIso(match[3], sign),
                        w: parseIso(match[4], sign),
                        d: parseIso(match[5], sign),
                        h: parseIso(match[6], sign),
                        m: parseIso(match[7], sign),
                        s: parseIso(match[8], sign)
                    };
                } else if (duration == null) {
                    // checks for null or undefined
                    duration = {};
                } else if ((typeof duration === "undefined" ? "undefined" : _typeof(duration)) === 'object' && ('from' in duration || 'to' in duration)) {
                    diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

                    duration = {};
                    duration.ms = diffRes.milliseconds;
                    duration.M = diffRes.months;
                }

                ret = new Duration(duration);

                if (isDuration(input) && hasOwnProp(input, '_locale')) {
                    ret._locale = input._locale;
                }

                return ret;
            }

            createDuration.fn = Duration.prototype;
            createDuration.invalid = createInvalid$1;

            function parseIso(inp, sign) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            }

            function positiveMomentsDifference(base, other) {
                var res = { milliseconds: 0, months: 0 };

                res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
                if (base.clone().add(res.months, 'M').isAfter(other)) {
                    --res.months;
                }

                res.milliseconds = +other - +base.clone().add(res.months, 'M');

                return res;
            }

            function momentsDifference(base, other) {
                var res;
                if (!(base.isValid() && other.isValid())) {
                    return { milliseconds: 0, months: 0 };
                }

                other = cloneWithOffset(other, base);
                if (base.isBefore(other)) {
                    res = positiveMomentsDifference(base, other);
                } else {
                    res = positiveMomentsDifference(other, base);
                    res.milliseconds = -res.milliseconds;
                    res.months = -res.months;
                }

                return res;
            }

            // TODO: remove 'name' arg after deprecation is removed
            function createAdder(direction, name) {
                return function (val, period) {
                    var dur, tmp;
                    //invert the arguments, but complain about it
                    if (period !== null && !isNaN(+period)) {
                        deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' + 'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                        tmp = val;val = period;period = tmp;
                    }

                    val = typeof val === 'string' ? +val : val;
                    dur = createDuration(val, period);
                    addSubtract(this, dur, direction);
                    return this;
                };
            }

            function addSubtract(mom, duration, isAdding, updateOffset) {
                var milliseconds = duration._milliseconds,
                    days = absRound(duration._days),
                    months = absRound(duration._months);

                if (!mom.isValid()) {
                    // No op
                    return;
                }

                updateOffset = updateOffset == null ? true : updateOffset;

                if (milliseconds) {
                    mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
                }
                if (days) {
                    set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
                }
                if (months) {
                    setMonth(mom, get(mom, 'Month') + months * isAdding);
                }
                if (updateOffset) {
                    hooks.updateOffset(mom, days || months);
                }
            }

            var add = createAdder(1, 'add');
            var subtract = createAdder(-1, 'subtract');

            function getCalendarFormat(myMoment, now) {
                var diff = myMoment.diff(now, 'days', true);
                return diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
            }

            function calendar$1(time, formats) {
                // We want to compare the start of today, vs this.
                // Getting start-of-today depends on whether we're local/utc/offset or not.
                var now = time || createLocal(),
                    sod = cloneWithOffset(now, this).startOf('day'),
                    format = hooks.calendarFormat(this, sod) || 'sameElse';

                var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

                return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
            }

            function clone() {
                return new Moment(this);
            }

            function isAfter(input, units) {
                var localInput = isMoment(input) ? input : createLocal(input);
                if (!(this.isValid() && localInput.isValid())) {
                    return false;
                }
                units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
                if (units === 'millisecond') {
                    return this.valueOf() > localInput.valueOf();
                } else {
                    return localInput.valueOf() < this.clone().startOf(units).valueOf();
                }
            }

            function isBefore(input, units) {
                var localInput = isMoment(input) ? input : createLocal(input);
                if (!(this.isValid() && localInput.isValid())) {
                    return false;
                }
                units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
                if (units === 'millisecond') {
                    return this.valueOf() < localInput.valueOf();
                } else {
                    return this.clone().endOf(units).valueOf() < localInput.valueOf();
                }
            }

            function isBetween(from, to, units, inclusivity) {
                inclusivity = inclusivity || '()';
                return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) && (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
            }

            function isSame(input, units) {
                var localInput = isMoment(input) ? input : createLocal(input),
                    inputMs;
                if (!(this.isValid() && localInput.isValid())) {
                    return false;
                }
                units = normalizeUnits(units || 'millisecond');
                if (units === 'millisecond') {
                    return this.valueOf() === localInput.valueOf();
                } else {
                    inputMs = localInput.valueOf();
                    return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
                }
            }

            function isSameOrAfter(input, units) {
                return this.isSame(input, units) || this.isAfter(input, units);
            }

            function isSameOrBefore(input, units) {
                return this.isSame(input, units) || this.isBefore(input, units);
            }

            function diff(input, units, asFloat) {
                var that, zoneDelta, delta, output;

                if (!this.isValid()) {
                    return NaN;
                }

                that = cloneWithOffset(input, this);

                if (!that.isValid()) {
                    return NaN;
                }

                zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

                units = normalizeUnits(units);

                if (units === 'year' || units === 'month' || units === 'quarter') {
                    output = monthDiff(this, that);
                    if (units === 'quarter') {
                        output = output / 3;
                    } else if (units === 'year') {
                        output = output / 12;
                    }
                } else {
                    delta = this - that;
                    output = units === 'second' ? delta / 1e3 : // 1000
                    units === 'minute' ? delta / 6e4 : // 1000 * 60
                    units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    delta;
                }
                return asFloat ? output : absFloor(output);
            }

            function monthDiff(a, b) {
                // difference in months
                var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),

                // b is in (anchor - 1 month, anchor + 1 month)
                anchor = a.clone().add(wholeMonthDiff, 'months'),
                    anchor2,
                    adjust;

                if (b - anchor < 0) {
                    anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
                    // linear across the month
                    adjust = (b - anchor) / (anchor - anchor2);
                } else {
                    anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
                    // linear across the month
                    adjust = (b - anchor) / (anchor2 - anchor);
                }

                //check for negative zero, return zero if negative zero
                return -(wholeMonthDiff + adjust) || 0;
            }

            hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
            hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

            function toString() {
                return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
            }

            function toISOString() {
                if (!this.isValid()) {
                    return null;
                }
                var m = this.clone().utc();
                if (m.year() < 0 || m.year() > 9999) {
                    return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                }
                if (isFunction(Date.prototype.toISOString)) {
                    // native implementation is ~50x faster, use it when we can
                    return this.toDate().toISOString();
                }
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }

            /**
             * Return a human readable representation of a moment that can
             * also be evaluated to get a new moment which is the same
             *
             * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
             */
            function inspect() {
                if (!this.isValid()) {
                    return 'moment.invalid(/* ' + this._i + ' */)';
                }
                var func = 'moment';
                var zone = '';
                if (!this.isLocal()) {
                    func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
                    zone = 'Z';
                }
                var prefix = '[' + func + '("]';
                var year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
                var datetime = '-MM-DD[T]HH:mm:ss.SSS';
                var suffix = zone + '[")]';

                return this.format(prefix + year + datetime + suffix);
            }

            function format(inputString) {
                if (!inputString) {
                    inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
                }
                var output = formatMoment(this, inputString);
                return this.localeData().postformat(output);
            }

            function from(time, withoutSuffix) {
                if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
                    return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
                } else {
                    return this.localeData().invalidDate();
                }
            }

            function fromNow(withoutSuffix) {
                return this.from(createLocal(), withoutSuffix);
            }

            function to(time, withoutSuffix) {
                if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
                    return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
                } else {
                    return this.localeData().invalidDate();
                }
            }

            function toNow(withoutSuffix) {
                return this.to(createLocal(), withoutSuffix);
            }

            // If passed a locale key, it will set the locale for this
            // instance.  Otherwise, it will return the locale configuration
            // variables for this instance.
            function locale(key) {
                var newLocaleData;

                if (key === undefined) {
                    return this._locale._abbr;
                } else {
                    newLocaleData = getLocale(key);
                    if (newLocaleData != null) {
                        this._locale = newLocaleData;
                    }
                    return this;
                }
            }

            var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            });

            function localeData() {
                return this._locale;
            }

            function startOf(units) {
                units = normalizeUnits(units);
                // the following switch intentionally omits break keywords
                // to utilize falling through the cases.
                switch (units) {
                    case 'year':
                        this.month(0);
                    /* falls through */
                    case 'quarter':
                    case 'month':
                        this.date(1);
                    /* falls through */
                    case 'week':
                    case 'isoWeek':
                    case 'day':
                    case 'date':
                        this.hours(0);
                    /* falls through */
                    case 'hour':
                        this.minutes(0);
                    /* falls through */
                    case 'minute':
                        this.seconds(0);
                    /* falls through */
                    case 'second':
                        this.milliseconds(0);
                }

                // weeks are a special case
                if (units === 'week') {
                    this.weekday(0);
                }
                if (units === 'isoWeek') {
                    this.isoWeekday(1);
                }

                // quarters are also special
                if (units === 'quarter') {
                    this.month(Math.floor(this.month() / 3) * 3);
                }

                return this;
            }

            function endOf(units) {
                units = normalizeUnits(units);
                if (units === undefined || units === 'millisecond') {
                    return this;
                }

                // 'date' is an alias for 'day', so it should be considered as such.
                if (units === 'date') {
                    units = 'day';
                }

                return this.startOf(units).add(1, units === 'isoWeek' ? 'week' : units).subtract(1, 'ms');
            }

            function valueOf() {
                return this._d.valueOf() - (this._offset || 0) * 60000;
            }

            function unix() {
                return Math.floor(this.valueOf() / 1000);
            }

            function toDate() {
                return new Date(this.valueOf());
            }

            function toArray() {
                var m = this;
                return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
            }

            function toObject() {
                var m = this;
                return {
                    years: m.year(),
                    months: m.month(),
                    date: m.date(),
                    hours: m.hours(),
                    minutes: m.minutes(),
                    seconds: m.seconds(),
                    milliseconds: m.milliseconds()
                };
            }

            function toJSON() {
                // new Date(NaN).toJSON() === null
                return this.isValid() ? this.toISOString() : null;
            }

            function isValid$2() {
                return isValid(this);
            }

            function parsingFlags() {
                return extend({}, getParsingFlags(this));
            }

            function invalidAt() {
                return getParsingFlags(this).overflow;
            }

            function creationData() {
                return {
                    input: this._i,
                    format: this._f,
                    locale: this._locale,
                    isUTC: this._isUTC,
                    strict: this._strict
                };
            }

            // FORMATTING

            addFormatToken(0, ['gg', 2], 0, function () {
                return this.weekYear() % 100;
            });

            addFormatToken(0, ['GG', 2], 0, function () {
                return this.isoWeekYear() % 100;
            });

            function addWeekYearFormatToken(token, getter) {
                addFormatToken(0, [token, token.length], 0, getter);
            }

            addWeekYearFormatToken('gggg', 'weekYear');
            addWeekYearFormatToken('ggggg', 'weekYear');
            addWeekYearFormatToken('GGGG', 'isoWeekYear');
            addWeekYearFormatToken('GGGGG', 'isoWeekYear');

            // ALIASES

            addUnitAlias('weekYear', 'gg');
            addUnitAlias('isoWeekYear', 'GG');

            // PRIORITY

            addUnitPriority('weekYear', 1);
            addUnitPriority('isoWeekYear', 1);

            // PARSING

            addRegexToken('G', matchSigned);
            addRegexToken('g', matchSigned);
            addRegexToken('GG', match1to2, match2);
            addRegexToken('gg', match1to2, match2);
            addRegexToken('GGGG', match1to4, match4);
            addRegexToken('gggg', match1to4, match4);
            addRegexToken('GGGGG', match1to6, match6);
            addRegexToken('ggggg', match1to6, match6);

            addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
                week[token.substr(0, 2)] = toInt(input);
            });

            addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
                week[token] = hooks.parseTwoDigitYear(input);
            });

            // MOMENTS

            function getSetWeekYear(input) {
                return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
            }

            function getSetISOWeekYear(input) {
                return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
            }

            function getISOWeeksInYear() {
                return weeksInYear(this.year(), 1, 4);
            }

            function getWeeksInYear() {
                var weekInfo = this.localeData()._week;
                return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
            }

            function getSetWeekYearHelper(input, week, weekday, dow, doy) {
                var weeksTarget;
                if (input == null) {
                    return weekOfYear(this, dow, doy).year;
                } else {
                    weeksTarget = weeksInYear(input, dow, doy);
                    if (week > weeksTarget) {
                        week = weeksTarget;
                    }
                    return setWeekAll.call(this, input, week, weekday, dow, doy);
                }
            }

            function setWeekAll(weekYear, week, weekday, dow, doy) {
                var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
                    date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

                this.year(date.getUTCFullYear());
                this.month(date.getUTCMonth());
                this.date(date.getUTCDate());
                return this;
            }

            // FORMATTING

            addFormatToken('Q', 0, 'Qo', 'quarter');

            // ALIASES

            addUnitAlias('quarter', 'Q');

            // PRIORITY

            addUnitPriority('quarter', 7);

            // PARSING

            addRegexToken('Q', match1);
            addParseToken('Q', function (input, array) {
                array[MONTH] = (toInt(input) - 1) * 3;
            });

            // MOMENTS

            function getSetQuarter(input) {
                return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
            }

            // FORMATTING

            addFormatToken('D', ['DD', 2], 'Do', 'date');

            // ALIASES

            addUnitAlias('date', 'D');

            // PRIOROITY
            addUnitPriority('date', 9);

            // PARSING

            addRegexToken('D', match1to2);
            addRegexToken('DD', match1to2, match2);
            addRegexToken('Do', function (isStrict, locale) {
                // TODO: Remove "ordinalParse" fallback in next major release.
                return isStrict ? locale._dayOfMonthOrdinalParse || locale._ordinalParse : locale._dayOfMonthOrdinalParseLenient;
            });

            addParseToken(['D', 'DD'], DATE);
            addParseToken('Do', function (input, array) {
                array[DATE] = toInt(input.match(match1to2)[0], 10);
            });

            // MOMENTS

            var getSetDayOfMonth = makeGetSet('Date', true);

            // FORMATTING

            addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

            // ALIASES

            addUnitAlias('dayOfYear', 'DDD');

            // PRIORITY
            addUnitPriority('dayOfYear', 4);

            // PARSING

            addRegexToken('DDD', match1to3);
            addRegexToken('DDDD', match3);
            addParseToken(['DDD', 'DDDD'], function (input, array, config) {
                config._dayOfYear = toInt(input);
            });

            // HELPERS

            // MOMENTS

            function getSetDayOfYear(input) {
                var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
                return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
            }

            // FORMATTING

            addFormatToken('m', ['mm', 2], 0, 'minute');

            // ALIASES

            addUnitAlias('minute', 'm');

            // PRIORITY

            addUnitPriority('minute', 14);

            // PARSING

            addRegexToken('m', match1to2);
            addRegexToken('mm', match1to2, match2);
            addParseToken(['m', 'mm'], MINUTE);

            // MOMENTS

            var getSetMinute = makeGetSet('Minutes', false);

            // FORMATTING

            addFormatToken('s', ['ss', 2], 0, 'second');

            // ALIASES

            addUnitAlias('second', 's');

            // PRIORITY

            addUnitPriority('second', 15);

            // PARSING

            addRegexToken('s', match1to2);
            addRegexToken('ss', match1to2, match2);
            addParseToken(['s', 'ss'], SECOND);

            // MOMENTS

            var getSetSecond = makeGetSet('Seconds', false);

            // FORMATTING

            addFormatToken('S', 0, 0, function () {
                return ~~(this.millisecond() / 100);
            });

            addFormatToken(0, ['SS', 2], 0, function () {
                return ~~(this.millisecond() / 10);
            });

            addFormatToken(0, ['SSS', 3], 0, 'millisecond');
            addFormatToken(0, ['SSSS', 4], 0, function () {
                return this.millisecond() * 10;
            });
            addFormatToken(0, ['SSSSS', 5], 0, function () {
                return this.millisecond() * 100;
            });
            addFormatToken(0, ['SSSSSS', 6], 0, function () {
                return this.millisecond() * 1000;
            });
            addFormatToken(0, ['SSSSSSS', 7], 0, function () {
                return this.millisecond() * 10000;
            });
            addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
                return this.millisecond() * 100000;
            });
            addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
                return this.millisecond() * 1000000;
            });

            // ALIASES

            addUnitAlias('millisecond', 'ms');

            // PRIORITY

            addUnitPriority('millisecond', 16);

            // PARSING

            addRegexToken('S', match1to3, match1);
            addRegexToken('SS', match1to3, match2);
            addRegexToken('SSS', match1to3, match3);

            var token;
            for (token = 'SSSS'; token.length <= 9; token += 'S') {
                addRegexToken(token, matchUnsigned);
            }

            function parseMs(input, array) {
                array[MILLISECOND] = toInt(('0.' + input) * 1000);
            }

            for (token = 'S'; token.length <= 9; token += 'S') {
                addParseToken(token, parseMs);
            }
            // MOMENTS

            var getSetMillisecond = makeGetSet('Milliseconds', false);

            // FORMATTING

            addFormatToken('z', 0, 0, 'zoneAbbr');
            addFormatToken('zz', 0, 0, 'zoneName');

            // MOMENTS

            function getZoneAbbr() {
                return this._isUTC ? 'UTC' : '';
            }

            function getZoneName() {
                return this._isUTC ? 'Coordinated Universal Time' : '';
            }

            var proto = Moment.prototype;

            proto.add = add;
            proto.calendar = calendar$1;
            proto.clone = clone;
            proto.diff = diff;
            proto.endOf = endOf;
            proto.format = format;
            proto.from = from;
            proto.fromNow = fromNow;
            proto.to = to;
            proto.toNow = toNow;
            proto.get = stringGet;
            proto.invalidAt = invalidAt;
            proto.isAfter = isAfter;
            proto.isBefore = isBefore;
            proto.isBetween = isBetween;
            proto.isSame = isSame;
            proto.isSameOrAfter = isSameOrAfter;
            proto.isSameOrBefore = isSameOrBefore;
            proto.isValid = isValid$2;
            proto.lang = lang;
            proto.locale = locale;
            proto.localeData = localeData;
            proto.max = prototypeMax;
            proto.min = prototypeMin;
            proto.parsingFlags = parsingFlags;
            proto.set = stringSet;
            proto.startOf = startOf;
            proto.subtract = subtract;
            proto.toArray = toArray;
            proto.toObject = toObject;
            proto.toDate = toDate;
            proto.toISOString = toISOString;
            proto.inspect = inspect;
            proto.toJSON = toJSON;
            proto.toString = toString;
            proto.unix = unix;
            proto.valueOf = valueOf;
            proto.creationData = creationData;

            // Year
            proto.year = getSetYear;
            proto.isLeapYear = getIsLeapYear;

            // Week Year
            proto.weekYear = getSetWeekYear;
            proto.isoWeekYear = getSetISOWeekYear;

            // Quarter
            proto.quarter = proto.quarters = getSetQuarter;

            // Month
            proto.month = getSetMonth;
            proto.daysInMonth = getDaysInMonth;

            // Week
            proto.week = proto.weeks = getSetWeek;
            proto.isoWeek = proto.isoWeeks = getSetISOWeek;
            proto.weeksInYear = getWeeksInYear;
            proto.isoWeeksInYear = getISOWeeksInYear;

            // Day
            proto.date = getSetDayOfMonth;
            proto.day = proto.days = getSetDayOfWeek;
            proto.weekday = getSetLocaleDayOfWeek;
            proto.isoWeekday = getSetISODayOfWeek;
            proto.dayOfYear = getSetDayOfYear;

            // Hour
            proto.hour = proto.hours = getSetHour;

            // Minute
            proto.minute = proto.minutes = getSetMinute;

            // Second
            proto.second = proto.seconds = getSetSecond;

            // Millisecond
            proto.millisecond = proto.milliseconds = getSetMillisecond;

            // Offset
            proto.utcOffset = getSetOffset;
            proto.utc = setOffsetToUTC;
            proto.local = setOffsetToLocal;
            proto.parseZone = setOffsetToParsedOffset;
            proto.hasAlignedHourOffset = hasAlignedHourOffset;
            proto.isDST = isDaylightSavingTime;
            proto.isLocal = isLocal;
            proto.isUtcOffset = isUtcOffset;
            proto.isUtc = isUtc;
            proto.isUTC = isUtc;

            // Timezone
            proto.zoneAbbr = getZoneAbbr;
            proto.zoneName = getZoneName;

            // Deprecations
            proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
            proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
            proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
            proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
            proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

            function createUnix(input) {
                return createLocal(input * 1000);
            }

            function createInZone() {
                return createLocal.apply(null, arguments).parseZone();
            }

            function preParsePostFormat(string) {
                return string;
            }

            var proto$1 = Locale.prototype;

            proto$1.calendar = calendar;
            proto$1.longDateFormat = longDateFormat;
            proto$1.invalidDate = invalidDate;
            proto$1.ordinal = ordinal;
            proto$1.preparse = preParsePostFormat;
            proto$1.postformat = preParsePostFormat;
            proto$1.relativeTime = relativeTime;
            proto$1.pastFuture = pastFuture;
            proto$1.set = set;

            // Month
            proto$1.months = localeMonths;
            proto$1.monthsShort = localeMonthsShort;
            proto$1.monthsParse = localeMonthsParse;
            proto$1.monthsRegex = monthsRegex;
            proto$1.monthsShortRegex = monthsShortRegex;

            // Week
            proto$1.week = localeWeek;
            proto$1.firstDayOfYear = localeFirstDayOfYear;
            proto$1.firstDayOfWeek = localeFirstDayOfWeek;

            // Day of Week
            proto$1.weekdays = localeWeekdays;
            proto$1.weekdaysMin = localeWeekdaysMin;
            proto$1.weekdaysShort = localeWeekdaysShort;
            proto$1.weekdaysParse = localeWeekdaysParse;

            proto$1.weekdaysRegex = weekdaysRegex;
            proto$1.weekdaysShortRegex = weekdaysShortRegex;
            proto$1.weekdaysMinRegex = weekdaysMinRegex;

            // Hours
            proto$1.isPM = localeIsPM;
            proto$1.meridiem = localeMeridiem;

            function get$1(format, index, field, setter) {
                var locale = getLocale();
                var utc = createUTC().set(setter, index);
                return locale[field](utc, format);
            }

            function listMonthsImpl(format, index, field) {
                if (isNumber(format)) {
                    index = format;
                    format = undefined;
                }

                format = format || '';

                if (index != null) {
                    return get$1(format, index, field, 'month');
                }

                var i;
                var out = [];
                for (i = 0; i < 12; i++) {
                    out[i] = get$1(format, i, field, 'month');
                }
                return out;
            }

            // ()
            // (5)
            // (fmt, 5)
            // (fmt)
            // (true)
            // (true, 5)
            // (true, fmt, 5)
            // (true, fmt)
            function listWeekdaysImpl(localeSorted, format, index, field) {
                if (typeof localeSorted === 'boolean') {
                    if (isNumber(format)) {
                        index = format;
                        format = undefined;
                    }

                    format = format || '';
                } else {
                    format = localeSorted;
                    index = format;
                    localeSorted = false;

                    if (isNumber(format)) {
                        index = format;
                        format = undefined;
                    }

                    format = format || '';
                }

                var locale = getLocale(),
                    shift = localeSorted ? locale._week.dow : 0;

                if (index != null) {
                    return get$1(format, (index + shift) % 7, field, 'day');
                }

                var i;
                var out = [];
                for (i = 0; i < 7; i++) {
                    out[i] = get$1(format, (i + shift) % 7, field, 'day');
                }
                return out;
            }

            function listMonths(format, index) {
                return listMonthsImpl(format, index, 'months');
            }

            function listMonthsShort(format, index) {
                return listMonthsImpl(format, index, 'monthsShort');
            }

            function listWeekdays(localeSorted, format, index) {
                return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
            }

            function listWeekdaysShort(localeSorted, format, index) {
                return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
            }

            function listWeekdaysMin(localeSorted, format, index) {
                return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
            }

            getSetGlobalLocale('en', {
                dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
                ordinal: function ordinal(number) {
                    var b = number % 10,
                        output = toInt(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
                    return number + output;
                }
            });

            // Side effect imports
            hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
            hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

            var mathAbs = Math.abs;

            function abs() {
                var data = this._data;

                this._milliseconds = mathAbs(this._milliseconds);
                this._days = mathAbs(this._days);
                this._months = mathAbs(this._months);

                data.milliseconds = mathAbs(data.milliseconds);
                data.seconds = mathAbs(data.seconds);
                data.minutes = mathAbs(data.minutes);
                data.hours = mathAbs(data.hours);
                data.months = mathAbs(data.months);
                data.years = mathAbs(data.years);

                return this;
            }

            function addSubtract$1(duration, input, value, direction) {
                var other = createDuration(input, value);

                duration._milliseconds += direction * other._milliseconds;
                duration._days += direction * other._days;
                duration._months += direction * other._months;

                return duration._bubble();
            }

            // supports only 2.0-style add(1, 's') or add(duration)
            function add$1(input, value) {
                return addSubtract$1(this, input, value, 1);
            }

            // supports only 2.0-style subtract(1, 's') or subtract(duration)
            function subtract$1(input, value) {
                return addSubtract$1(this, input, value, -1);
            }

            function absCeil(number) {
                if (number < 0) {
                    return Math.floor(number);
                } else {
                    return Math.ceil(number);
                }
            }

            function bubble() {
                var milliseconds = this._milliseconds;
                var days = this._days;
                var months = this._months;
                var data = this._data;
                var seconds, minutes, hours, years, monthsFromDays;

                // if we have a mix of positive and negative values, bubble down first
                // check: https://github.com/moment/moment/issues/2166
                if (!(milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0)) {
                    milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
                    days = 0;
                    months = 0;
                }

                // The following code bubbles up values, see the tests for
                // examples of what that means.
                data.milliseconds = milliseconds % 1000;

                seconds = absFloor(milliseconds / 1000);
                data.seconds = seconds % 60;

                minutes = absFloor(seconds / 60);
                data.minutes = minutes % 60;

                hours = absFloor(minutes / 60);
                data.hours = hours % 24;

                days += absFloor(hours / 24);

                // convert days to months
                monthsFromDays = absFloor(daysToMonths(days));
                months += monthsFromDays;
                days -= absCeil(monthsToDays(monthsFromDays));

                // 12 months -> 1 year
                years = absFloor(months / 12);
                months %= 12;

                data.days = days;
                data.months = months;
                data.years = years;

                return this;
            }

            function daysToMonths(days) {
                // 400 years have 146097 days (taking into account leap year rules)
                // 400 years have 12 months === 4800
                return days * 4800 / 146097;
            }

            function monthsToDays(months) {
                // the reverse of daysToMonths
                return months * 146097 / 4800;
            }

            function as(units) {
                if (!this.isValid()) {
                    return NaN;
                }
                var days;
                var months;
                var milliseconds = this._milliseconds;

                units = normalizeUnits(units);

                if (units === 'month' || units === 'year') {
                    days = this._days + milliseconds / 864e5;
                    months = this._months + daysToMonths(days);
                    return units === 'month' ? months : months / 12;
                } else {
                    // handle milliseconds separately because of floating point math errors (issue #1867)
                    days = this._days + Math.round(monthsToDays(this._months));
                    switch (units) {
                        case 'week':
                            return days / 7 + milliseconds / 6048e5;
                        case 'day':
                            return days + milliseconds / 864e5;
                        case 'hour':
                            return days * 24 + milliseconds / 36e5;
                        case 'minute':
                            return days * 1440 + milliseconds / 6e4;
                        case 'second':
                            return days * 86400 + milliseconds / 1000;
                        // Math.floor prevents floating point math errors here
                        case 'millisecond':
                            return Math.floor(days * 864e5) + milliseconds;
                        default:
                            throw new Error('Unknown unit ' + units);
                    }
                }
            }

            // TODO: Use this.as('ms')?
            function valueOf$1() {
                if (!this.isValid()) {
                    return NaN;
                }
                return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
            }

            function makeAs(alias) {
                return function () {
                    return this.as(alias);
                };
            }

            var asMilliseconds = makeAs('ms');
            var asSeconds = makeAs('s');
            var asMinutes = makeAs('m');
            var asHours = makeAs('h');
            var asDays = makeAs('d');
            var asWeeks = makeAs('w');
            var asMonths = makeAs('M');
            var asYears = makeAs('y');

            function get$2(units) {
                units = normalizeUnits(units);
                return this.isValid() ? this[units + 's']() : NaN;
            }

            function makeGetter(name) {
                return function () {
                    return this.isValid() ? this._data[name] : NaN;
                };
            }

            var milliseconds = makeGetter('milliseconds');
            var seconds = makeGetter('seconds');
            var minutes = makeGetter('minutes');
            var hours = makeGetter('hours');
            var days = makeGetter('days');
            var months = makeGetter('months');
            var years = makeGetter('years');

            function weeks() {
                return absFloor(this.days() / 7);
            }

            var round = Math.round;
            var thresholds = {
                ss: 44, // a few seconds to seconds
                s: 45, // seconds to minute
                m: 45, // minutes to hour
                h: 22, // hours to day
                d: 26, // days to month
                M: 11 // months to year
            };

            // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
            function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
                return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
            }

            function relativeTime$1(posNegDuration, withoutSuffix, locale) {
                var duration = createDuration(posNegDuration).abs();
                var seconds = round(duration.as('s'));
                var minutes = round(duration.as('m'));
                var hours = round(duration.as('h'));
                var days = round(duration.as('d'));
                var months = round(duration.as('M'));
                var years = round(duration.as('y'));

                var a = seconds <= thresholds.ss && ['s', seconds] || seconds < thresholds.s && ['ss', seconds] || minutes <= 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours <= 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days <= 1 && ['d'] || days < thresholds.d && ['dd', days] || months <= 1 && ['M'] || months < thresholds.M && ['MM', months] || years <= 1 && ['y'] || ['yy', years];

                a[2] = withoutSuffix;
                a[3] = +posNegDuration > 0;
                a[4] = locale;
                return substituteTimeAgo.apply(null, a);
            }

            // This function allows you to set the rounding function for relative time strings
            function getSetRelativeTimeRounding(roundingFunction) {
                if (roundingFunction === undefined) {
                    return round;
                }
                if (typeof roundingFunction === 'function') {
                    round = roundingFunction;
                    return true;
                }
                return false;
            }

            // This function allows you to set a threshold for relative time strings
            function getSetRelativeTimeThreshold(threshold, limit) {
                if (thresholds[threshold] === undefined) {
                    return false;
                }
                if (limit === undefined) {
                    return thresholds[threshold];
                }
                thresholds[threshold] = limit;
                if (threshold === 's') {
                    thresholds.ss = limit - 1;
                }
                return true;
            }

            function humanize(withSuffix) {
                if (!this.isValid()) {
                    return this.localeData().invalidDate();
                }

                var locale = this.localeData();
                var output = relativeTime$1(this, !withSuffix, locale);

                if (withSuffix) {
                    output = locale.pastFuture(+this, output);
                }

                return locale.postformat(output);
            }

            var abs$1 = Math.abs;

            function toISOString$1() {
                // for ISO strings we do not use the normal bubbling rules:
                //  * milliseconds bubble up until they become hours
                //  * days do not bubble at all
                //  * months bubble up until they become years
                // This is because there is no context-free conversion between hours and days
                // (think of clock changes)
                // and also not between days and months (28-31 days per month)
                if (!this.isValid()) {
                    return this.localeData().invalidDate();
                }

                var seconds = abs$1(this._milliseconds) / 1000;
                var days = abs$1(this._days);
                var months = abs$1(this._months);
                var minutes, hours, years;

                // 3600 seconds -> 60 minutes -> 1 hour
                minutes = absFloor(seconds / 60);
                hours = absFloor(minutes / 60);
                seconds %= 60;
                minutes %= 60;

                // 12 months -> 1 year
                years = absFloor(months / 12);
                months %= 12;

                // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
                var Y = years;
                var M = months;
                var D = days;
                var h = hours;
                var m = minutes;
                var s = seconds;
                var total = this.asSeconds();

                if (!total) {
                    // this is the same as C#'s (Noda) and python (isodate)...
                    // but not other JS (goog.date)
                    return 'P0D';
                }

                return (total < 0 ? '-' : '') + 'P' + (Y ? Y + 'Y' : '') + (M ? M + 'M' : '') + (D ? D + 'D' : '') + (h || m || s ? 'T' : '') + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (s ? s + 'S' : '');
            }

            var proto$2 = Duration.prototype;

            proto$2.isValid = isValid$1;
            proto$2.abs = abs;
            proto$2.add = add$1;
            proto$2.subtract = subtract$1;
            proto$2.as = as;
            proto$2.asMilliseconds = asMilliseconds;
            proto$2.asSeconds = asSeconds;
            proto$2.asMinutes = asMinutes;
            proto$2.asHours = asHours;
            proto$2.asDays = asDays;
            proto$2.asWeeks = asWeeks;
            proto$2.asMonths = asMonths;
            proto$2.asYears = asYears;
            proto$2.valueOf = valueOf$1;
            proto$2._bubble = bubble;
            proto$2.get = get$2;
            proto$2.milliseconds = milliseconds;
            proto$2.seconds = seconds;
            proto$2.minutes = minutes;
            proto$2.hours = hours;
            proto$2.days = days;
            proto$2.weeks = weeks;
            proto$2.months = months;
            proto$2.years = years;
            proto$2.humanize = humanize;
            proto$2.toISOString = toISOString$1;
            proto$2.toString = toISOString$1;
            proto$2.toJSON = toISOString$1;
            proto$2.locale = locale;
            proto$2.localeData = localeData;

            // Deprecations
            proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
            proto$2.lang = lang;

            // Side effect imports

            // FORMATTING

            addFormatToken('X', 0, 0, 'unix');
            addFormatToken('x', 0, 0, 'valueOf');

            // PARSING

            addRegexToken('x', matchSigned);
            addRegexToken('X', matchTimestamp);
            addParseToken('X', function (input, array, config) {
                config._d = new Date(parseFloat(input, 10) * 1000);
            });
            addParseToken('x', function (input, array, config) {
                config._d = new Date(toInt(input));
            });

            // Side effect imports


            hooks.version = '2.18.1';

            setHookCallback(createLocal);

            hooks.fn = proto;
            hooks.min = min;
            hooks.max = max;
            hooks.now = now;
            hooks.utc = createUTC;
            hooks.unix = createUnix;
            hooks.months = listMonths;
            hooks.isDate = isDate;
            hooks.locale = getSetGlobalLocale;
            hooks.invalid = createInvalid;
            hooks.duration = createDuration;
            hooks.isMoment = isMoment;
            hooks.weekdays = listWeekdays;
            hooks.parseZone = createInZone;
            hooks.localeData = getLocale;
            hooks.isDuration = isDuration;
            hooks.monthsShort = listMonthsShort;
            hooks.weekdaysMin = listWeekdaysMin;
            hooks.defineLocale = defineLocale;
            hooks.updateLocale = updateLocale;
            hooks.locales = listLocales;
            hooks.weekdaysShort = listWeekdaysShort;
            hooks.normalizeUnits = normalizeUnits;
            hooks.relativeTimeRounding = getSetRelativeTimeRounding;
            hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
            hooks.calendarFormat = getCalendarFormat;
            hooks.prototype = proto;

            return hooks;
        });
    }, {}], 73: [function (require, module, exports) {
        module.exports = {
            "😂": 1,
            "❤": 3,
            "♥": 3,
            "😍": 3,
            "😭": -1,
            "😘": 3,
            "😊": 3,
            "👌": 2,
            "💕": 3,
            "👏": 2,
            "😁": 2,
            "☺": 3,
            "♡": 3,
            "👍": 2,
            "😩": -2,
            "🙏": 2,
            "✌": 2,
            "😏": 1,
            "😉": 2,
            "🙌": 2,
            "🙈": 2,
            "💪": 2,
            "😄": 2,
            "😒": -2,
            "💃": 3,
            "💖": 3,
            "😃": 2,
            "😔": -1,
            "🎉": 3,
            "😜": 2,
            "🌸": 3,
            "💜": 3,
            "💙": 3,
            "✨": 1,
            "💗": 3,
            "★": 1,
            "█": -1,
            "☀": 2,
            "😡": -1,
            "😎": 2,
            "💋": 3,
            "😋": 3,
            "🙊": 2,
            "😴": -1,
            "🎶": 2,
            "💞": 3,
            "😌": 2,
            "🔫": -1,
            "💛": 3,
            "💁": 1,
            "💚": 3,
            "♫": 1,
            "😞": -1,
            "😆": 2,
            "😝": 2,
            "😪": -1,
            "😫": -1,
            "👊": 1,
            "💀": -2,
            "😀": 2,
            "😚": 3,
            "😻": 3,
            "💘": 3,
            "☕": 1,
            "👋": 2,
            "🎊": 3,
            "🍕": 2,
            "❄": 2,
            "😕": -2,
            "💔": -1,
            "😤": -2,
            "😈": 1,
            "✈": 2,
            "🔝": 2,
            "😰": -1,
            "⚽": 3,
            "😑": -2,
            "👑": 3,
            "👉": 1,
            "🍃": 1,
            "🎁": 3,
            "😠": -2,
            "🐧": 2,
            "☆": 2,
            "🍀": 1,
            "🎈": 3,
            "🎅": 1,
            "😓": -1,
            "😣": -2,
            "😐": -2,
            "✊": 2,
            "😨": -1,
            "😖": -1,
            "💤": 1,
            "💓": 3,
            "👎": -1,
            "💦": 2,
            "✔": 1,
            "😷": -1,
            "🙋": 2,
            "🎄": 2,
            "💩": -1,
            "🎵": 2,
            "😛": 3,
            "👯": 2,
            "💎": 2,
            "🌿": 1,
            "🎂": 3,
            "🌟": 1,
            "🔮": 1,
            "👫": 1,
            "🏆": 3,
            "✖": 1,
            "☝": 1,
            "😙": 3,
            "⛄": 2,
            "👅": 2,
            "♪": 2,
            "🍂": 2,
            "💏": 1,
            "🌴": 2,
            "👈": 2,
            "🌹": 3,
            "🙆": 2,
            "👻": 1,
            "💰": 1,
            "🍻": 2,
            "🙅": -2,
            "🌞": 2,
            "🍁": 2,
            "⭐": 2,
            "▪": 1,
            "🎀": 3,
            "🐷": 1,
            "🙉": 1,
            "🌺": 2,
            "💅": 1,
            "🐶": 2,
            "🌚": 2,
            "👽": 1,
            "🎤": 2,
            "👭": 2,
            "🎧": 2,
            "👆": 1,
            "🍸": 2,
            "🍷": 2,
            "®": 1,
            "🍉": 3,
            "😇": 3,
            "🏃": 2,
            "😿": -2,
            "│": 1,
            "🍺": 2,
            "▶": 1,
            "😲": -1,
            "🎸": 2,
            "🍹": 3,
            "💫": 2,
            "📚": 1,
            "😶": -1,
            "🌷": 2,
            "💝": 3,
            "💨": 1,
            "🏈": 2,
            "💍": 2,
            "☔": 1,
            "👸": 3,
            "🇪": 3,
            "░": -1,
            "🍩": 1,
            "👾": 1,
            "☁": 1,
            "🌻": 2,
            "↿": 3,
            "🐯": 2,
            "👼": 1,
            "🍔": 1,
            "😸": 2,
            "👶": 2,
            "↾": 3,
            "💐": 3,
            "🌊": 2,
            "🍦": 2,
            "🍓": 3,
            "👇": 1,
            "💆": 1,
            "🍴": 2,
            "😧": -1,
            "🇸": 2,
            "😮": 1,
            "🚫": -3,
            "😽": 2,
            "🌈": 2,
            "🙀": 1,
            "⚠": -1,
            "🎮": 2,
            "╯": -1,
            "🍆": 2,
            "🍰": 2,
            "✓": 1,
            "👐": -1,
            "🍟": 1,
            "🍌": 2,
            "💑": 3,
            "👬": -1,
            "🐣": 2,
            "🎃": 3,
            "▬": 2,
            "￼": -3,
            "🐾": 3,
            "🎓": 2,
            "🏊": 2,
            "📷": 2,
            "👄": 2,
            "🌼": 4,
            "🚶": -1,
            "🐱": 2,
            "🐸": -1,
            "🇺": 2,
            "👿": -3,
            "🚬": 2,
            "✿": 1,
            "🐒": 2,
            "🌍": 3,
            "┊": 5,
            "🐥": 3,
            "🐼": 1,
            "🎥": 1,
            "💄": 2,
            "⛔": 2,
            "🏀": 1,
            "💉": 1,
            "💟": 3,
            "🚗": 1,
            "📝": 1,
            "♦": 2,
            "💭": 1,
            "🌙": 3,
            "🐟": 3,
            "👣": 1,
            "✂": -3,
            "🗿": 2,
            "👪": -1,
            "🍭": 1,
            "🌃": 2,
            "❌": 1,
            "🐰": 3,
            "💊": 2,
            "🚨": 3,
            "😦": -2,
            "🍪": 1,
            "🍣": -2,
            "✧": 1,
            "🎆": 3,
            "🎎": 4,
            "🇩": 3,
            "✅": 2,
            "📱": 1,
            "🙍": -2,
            "🍑": 1,
            "🎼": 1,
            "🔊": 2,
            "🌌": 2,
            "🍎": 1,
            "🐻": 2,
            "╰": -1,
            "💇": 1,
            "♬": 1,
            "🔴": 2,
            "🍱": -2,
            "🍊": 2,
            "🍒": 1,
            "🐭": 3,
            "👟": 2,
            "🌎": 1,
            "🍍": 2,
            "🐮": 3,
            "📲": 1,
            "☼": 1,
            "🌅": 1,
            "🇷": 3,
            "👠": 1,
            "🌽": 2,
            "💧": -1,
            "🍬": 1,
            "😺": 2,
            "🚀": 2,
            "¦": 3,
            "💢": 1,
            "🎬": 1,
            "🍧": 1,
            "🍜": 2,
            "🐏": 3,
            "🏄": 2,
            "➤": 1,
            "⬆": 1,
            "🍋": 1,
            "🆗": 2,
            "⚪": 2,
            "📺": 2,
            "🍅": 1,
            "⛅": 2,
            "🐢": 1,
            "👙": 2,
            "🏡": 2,
            "🌾": 2,
            "◉": 1,
            "✏": 1,
            "🐬": 2,
            "🇹": 3,
            "♣": 1,
            "🐝": 1,
            "🌝": 1,
            "🇮": 3,
            "🔋": -3,
            "🐍": 1,
            "♔": 2,
            "🔵": 1,
            "😾": -2,
            "🌕": 3,
            "🐨": 2,
            "🔐": 1,
            "💿": 3,
            "🌳": 2,
            "👰": 2,
            "❀": 2,
            "⚓": 3,
            "🚴": 3,
            "▀": -1,
            "👗": 1,
            "➕": 2,
            "💬": 2,
            "▒": -1,
            "🔜": 1,
            "🍨": 1,
            "💲": 1,
            "🍙": 1,
            "🍥": -4,
            "▸": 1,
            "♛": 1,
            "😼": 1,
            "🐙": 2,
            "👨": 2,
            "🍚": 2,
            "♨": 4,
            "🎹": 1,
            "♕": 2,
            "▃": 5,
            "🇬": 1,
            "🇧": 1,
            "☠": -1,
            "🐠": 2,
            "🚹": 3,
            "💵": 2,
            "✰": 4,
            "╠": 1,
            "👛": 2,
            "🌱": 3,
            "💻": 1,
            "🌏": 1,
            "▄": -1,
            "👓": 1,
            "◄": 1,
            "⚾": -1,
            "🌲": 2,
            "👴": 1,
            "🏠": 2,
            "🍇": 1,
            "🍘": 2,
            "🐇": 1,
            "🔞": -1,
            "👵": 2,
            "◀": 1,
            "🔙": 1,
            "🌵": 1,
            "🍮": -1,
            "🎇": 3,
            "🐎": 2,
            "➔": -1,
            "🐤": 2,
            "╩": 1,
            "🌑": 2,
            "🚲": 2,
            "🐑": -1,
            "🏁": 2,
            "🎾": 3,
            "╚": 1,
            "🈹": 1,
            "👮": -2,
            "☹": -3,
            "🐵": 2,
            "✪": 1,
            "◕": 2,
            "🗼": 3,
            "▐": -1,
            "♠": 1,
            "┳": -2,
            "👺": -2,
            "🐚": 1,
            "👂": -1,
            "🗽": 1,
            "🍵": 2,
            "🆒": 2,
            "🐺": 1,
            "⇨": 2,
            "🌓": 3,
            "🔒": 1,
            "╬": -1,
            "👳": 3,
            "🌂": 1,
            "🚌": 1,
            "♩": 3,
            "🍡": -1,
            "❥": 1,
            "🎡": 1,
            "💌": 2,
            "🐩": 2,
            "🌜": 2,
            "⌚": 1,
            "🚿": 3,
            "🔆": 3,
            "🌛": 3,
            "💂": -1,
            "🐔": 1,
            "🙎": -1,
            "🏩": 2,
            "🇫": 2,
            "🔨": -1,
            "📢": 2,
            "🐦": 2,
            "🐲": -1,
            "♻": 2,
            "🌘": 3,
            "🌔": 3,
            "👖": 2,
            "😗": 3,
            "🐄": 1,
            "◟": -1,
            "🍢": -1,
            "🎨": 1,
            "⬇": 2,
            "🚼": 3,
            "🇴": 2,
            "🌗": 3,
            "🌖": 3,
            "🔅": 5,
            "👜": 1,
            "🐌": 3,
            "💼": 3,
            "🐹": 1,
            "🌠": 3,
            "🐈": 1,
            "🌁": 1,
            "⚫": 1,
            "♧": 2,
            "🏰": 1,
            "🚵": 2,
            "🎢": 2,
            "🎷": 3,
            "🎐": 1,
            "┈": -4,
            "╗": 2,
            "🌇": 3,
            "⏰": 2,
            "🚂": 1,
            "◠": 2,
            "🎿": 2,
            "🆔": 4,
            "🌒": 3,
            "🐪": 3,
            "╔": 1,
            "╝": 2,
            "👔": 2,
            "🆓": 1,
            "🐋": 1,
            "▽": 2,
            "🐛": 1,
            "👕": 2,
            "💳": 2,
            "🏧": 5,
            "💡": 3,
            "⬅": 2,
            "🐫": 2,
            "🇱": 2,
            "📹": 2,
            "👞": 2,
            "👚": 3,
            "□": -2,
            "🚣": 3,
            "🏉": 3,
            "🗻": 3,
            "╦": 2,
            "⛺": 3,
            "🐕": 1,
            "🏂": 2,
            "👡": 2,
            "📻": 2,
            "✒": 1,
            "🌰": 3,
            "🏢": 1,
            "🎒": 3,
            "⌒": 3,
            "🏫": -2,
            "📴": 4,
            "🚢": 1,
            "🚚": -1,
            "🐉": 1,
            "❒": 1,
            "🔔": 5,
            "◢": 4,
            "🏥": 1,
            "🚖": -1,
            "▌": -2,
            "☛": 2,
            "💒": 3,
            "🚤": 2,
            "🐐": 2,
            "■": -2,
            "🔚": 2,
            "🎻": 2,
            "🔷": 1,
            "🎽": 2,
            "📅": 1,
            "🎺": 3,
            "🍈": -3,
            "✉": 1,
            "◤": 5,
            "○": 3,
            "🍼": 3,
            "🚛": -2,
            "📓": 1,
            "☉": 1,
            "💴": -2,
            "➰": -1,
            "🔌": -1,
            "📕": 1,
            "📣": 2,
            "🚓": 1,
            "🐗": 3,
            "⛳": 4,
            "┻": -3,
            "┛": 3,
            "┃": 2,
            "💺": 1,
            "🏇": -1,
            "☻": 1,
            "📞": 2,
            "Ⓐ": -1,
            "🌉": 3,
            "🚩": -2,
            "✎": 3,
            "📃": 2,
            "🏨": 1,
            "📌": -3,
            "♎": -1,
            "💷": 2,
            "🚄": 3,
            "▲": 3,
            "⛵": 3,
            "🔸": 1,
            "🚜": 5,
            "🐆": 2,
            "👒": 1,
            "❕": 1,
            "🔛": 2,
            "♢": 2,
            "🇲": 2,
            "❅": 4,
            "👝": 2,
            "✞": 2,
            "◡": 1,
            "🎋": 3,
            "👥": 1,
            "🐡": 1,
            "◆": 4,
            "🔭": 2,
            "🎪": 1,
            "🐜": 3,
            "♌": 4,
            "☐": -5,
            "👷": 1,
            "🔈": 1,
            "📄": 5,
            "🚐": 4,
            "🌋": 3,
            "📡": 1,
            "🚳": 5,
            "✘": 4,
            "🅰": 1,
            "🇼": 2,
            "┓": 3,
            "┣": 3,
            "Ⓛ": 2,
            "Ⓔ": 2,
            "👤": 4,
            "🚁": 1,
            "🎠": 3,
            "🐁": -2,
            "📗": 1,
            "┐": -1,
            "♂": 1,
            "📯": -1,
            "🔩": 1,
            "👢": 4,
            "◂": 2,
            "📰": 1,
            "📶": 2,
            "🌄": 1,
            "🗾": 2,
            "🔶": 2,
            "🏤": 2,
            "🎩": 2,
            "Ⓜ": 1,
            "🔧": -4,
            "🐅": 1,
            "♮": 1,
            "🅾": -1,
            "📦": 1,
            "🚊": 1,
            "🔲": 3,
            "△": 1,
            "📆": 5,
            "❛": 2,
            "📉": 2,
            "▵": 2,
            "🔎": 3,
            "☜": 1,
            "🇯": 2,
            "🇵": 2,
            "📘": 1,
            "ⓔ": 3,
            "🔑": 1,
            "⭕": 2,
            "🔘": 1,
            "🚭": 5,
            "🚉": 3,
            "🚪": 3,
            "➳": 2,
            "🚃": 3,
            "┯": -3,
            "🆙": 2,
            "🆖": 1,
            "┗": 5,
            "Ⓞ": 2,
            "❇": 3,
            "✴": 3,
            "☊": 5,
            "🔕": -2,
            "⬛": -2,
            "🚞": 3,
            "🍶": 3,
            "🌐": 3,
            "♀": 1,
            "🚅": 3,
            "🚒": -2,
            "♋": 1,
            "♍": 3,
            "🕝": -2,
            "ⓐ": 5,
            "📙": 1,
            "Ⓢ": 1,
            "📋": 3,
            "🎱": 1,
            "🐞": 1,
            "🔺": 1,
            "ⓡ": 5,
            "♤": 3,
            "🎯": 3,
            "🔉": 3,
            "↩": 5,
            "🚾": 1,
            "🎣": -4,
            "🔣": 1,
            "❎": -5,
            "➥": 1,
            "🎌": 5,
            "◣": 1,
            "⏬": 5,
            "♭": 1,
            "ⓞ": 5,
            "🔳": 2,
            "🏭": 2,
            "🎳": -3,
            "☚": 5,
            "➽": 2,
            "➫": 2,
            "➖": -5,
            "꒰": 2,
            "꒱": 2,
            "◝": -3,
            "📑": 5,
            "ⓧ": 5,
            "🔟": 5,
            "〓": 5,
            "ⓜ": 2,
            "➠": 5,
            "🚆": 2,
            "℅": -5,
            "☃": 2,
            "🚽": 5,
            "ⓝ": 5,
            "⇦": 5,
            "👲": 2,
            "🚡": -3,
            "🔬": 5,
            "➗": -3,
            "📈": 2,
            "⏪": 2,
            "◎": 5,
            "꒦": -5,
            "📎": 5,
            "⑅": 5,
            "✭": 5,
            "♓": 2,
            "┏": 5,
            "☇": 5,
            "࿎": -5,
            "👘": 5,
            "↙": 5,
            "Ⓕ": 2,
            "Ⓦ": 2,
            "Ⓟ": 2,
            "🕑": 2,
            "🕛": 5,
            "♈": -5,
            "↬": 5,
            "✍": 5,
            "🏦": 5,
            "🔻": 5,
            "ⓟ": 5,
            "ⓕ": 5,
            "ⓘ": 5,
            "♿": 5,
            "⇗": 5,
            "⇘": 5,
            "ⓨ": 5,
            "ⓙ": 5,
            "▫": 5,
            "🔇": 5,
            "⌃": -5,
            "🔖": 5,
            "📜": 5,
            "🚝": 5,
            "┘": -5,
            "✝": -5,
            "⍣": -5,
            "📮": -5,
            "🕕": -5,
            "🔯": 5,
            "➸": 5,
            "꒵": 5,
            "🕥": -5,
            "✽": 5,
            "📼": 5,
            "🕐": -5,
            "🀄": 5,
            "✬": 5,
            "✫": 5,
            "🕔": -5,
            "❣": 5,
            "📫": 5,
            "🉐": 5,
            "🈂": -5,
            "🎰": -5,
            "҂": -5,
            "╤": -5,
            "📔": 5,
            "abandon": -2,
            "abandoned": -2,
            "abandons": -2,
            "abducted": -2,
            "abduction": -2,
            "abductions": -2,
            "abhor": -3,
            "abhorred": -3,
            "abhorrent": -3,
            "abhors": -3,
            "abilities": 2,
            "ability": 2,
            "aboard": 1,
            "aborted": -1,
            "aborts": -1,
            "absentee": -1,
            "absentees": -1,
            "absolve": 2,
            "absolved": 2,
            "absolves": 2,
            "absolving": 2,
            "absorbed": 1,
            "abuse": -3,
            "abused": -3,
            "abuses": -3,
            "abusing": -3,
            "abusive": -3,
            "accept": 1,
            "acceptable": 1,
            "acceptance": 1,
            "accepted": 1,
            "accepting": 1,
            "accepts": 1,
            "accessible": 1,
            "accident": -2,
            "accidental": -2,
            "accidentally": -2,
            "accidents": -2,
            "acclaim": 2,
            "acclaimed": 2,
            "accolade": 2,
            "accomplish": 2,
            "accomplished": 2,
            "accomplishes": 2,
            "accomplishment": 2,
            "accomplishments": 2,
            "accusation": -2,
            "accusations": -2,
            "accuse": -2,
            "accused": -2,
            "accuses": -2,
            "accusing": -2,
            "ache": -2,
            "achievable": 1,
            "aching": -2,
            "acquit": 2,
            "acquits": 2,
            "acquitted": 2,
            "acquitting": 2,
            "acrimonious": -3,
            "active": 1,
            "adequate": 1,
            "admire": 3,
            "admired": 3,
            "admires": 3,
            "admiring": 3,
            "admit": -1,
            "admits": -1,
            "admitted": -1,
            "admonish": -2,
            "admonished": -2,
            "adopt": 1,
            "adopts": 1,
            "adorable": 3,
            "adoration": 3,
            "adore": 3,
            "adored": 3,
            "adores": 3,
            "adoring": 3,
            "adoringly": 3,
            "advanced": 1,
            "advantage": 2,
            "advantageous": 2,
            "advantageously": 2,
            "advantages": 2,
            "adventure": 2,
            "adventures": 2,
            "adventurous": 2,
            "adversary": -1,
            "advisable": 1,
            "affected": -1,
            "affection": 3,
            "affectionate": 3,
            "affectionateness": 3,
            "afflicted": -1,
            "affordable": 2,
            "affronted": -1,
            "aficionados": 2,
            "afraid": -2,
            "aggravate": -2,
            "aggravated": -2,
            "aggravates": -2,
            "aggravating": -2,
            "aggression": -2,
            "aggressions": -2,
            "aggressive": -2,
            "aggressiveness": -2,
            "aghast": -2,
            "agog": 2,
            "agonise": -3,
            "agonised": -3,
            "agonises": -3,
            "agonising": -3,
            "agonize": -3,
            "agonized": -3,
            "agonizes": -3,
            "agonizing": -3,
            "agree": 1,
            "agreeable": 2,
            "agreed": 1,
            "agreement": 1,
            "agrees": 1,
            "alarm": -2,
            "alarmed": -2,
            "alarmist": -2,
            "alarmists": -2,
            "alas": -1,
            "alert": -1,
            "alienation": -2,
            "alive": 1,
            "allegation": -2,
            "allegations": -2,
            "allergic": -2,
            "allow": 1,
            "ally": 2,
            "alone": -2,
            "altruistic": 2,
            "amaze": 2,
            "amazed": 2,
            "amazes": 2,
            "amazing": 4,
            "ambitious": 2,
            "ambivalent": -1,
            "amicable": 2,
            "amuse": 3,
            "amused": 3,
            "amusement": 3,
            "amusements": 3,
            "anger": -3,
            "angered": -3,
            "angers": -3,
            "angry": -3,
            "anguish": -3,
            "anguished": -3,
            "animosity": -2,
            "annoy": -2,
            "annoyance": -2,
            "annoyed": -2,
            "annoying": -2,
            "annoys": -2,
            "antagonistic": -2,
            "anti": -1,
            "anticipation": 1,
            "anxiety": -2,
            "anxious": -2,
            "apathetic": -3,
            "apathy": -3,
            "apeshit": -3,
            "apocalyptic": -2,
            "apologise": -1,
            "apologised": -1,
            "apologises": -1,
            "apologising": -1,
            "apologize": -1,
            "apologized": -1,
            "apologizes": -1,
            "apologizing": -1,
            "apology": -1,
            "appalled": -2,
            "appalling": -2,
            "appealing": 2,
            "appease": 2,
            "appeased": 2,
            "appeases": 2,
            "appeasing": 2,
            "applaud": 2,
            "applauded": 2,
            "applauding": 2,
            "applauds": 2,
            "applause": 2,
            "appreciate": 2,
            "appreciated": 2,
            "appreciates": 2,
            "appreciating": 2,
            "appreciation": 2,
            "apprehensive": -2,
            "appropriate": 2,
            "appropriately": 2,
            "approval": 2,
            "approved": 2,
            "approves": 2,
            "ardent": 1,
            "arrest": -2,
            "arrested": -3,
            "arrests": -2,
            "arrogant": -2,
            "arsehole": -4,
            "ashame": -2,
            "ashamed": -2,
            "ass": -4,
            "assassination": -3,
            "assassinations": -3,
            "assault": -2,
            "assaults": -2,
            "asset": 2,
            "assets": 2,
            "assfucking": -4,
            "asshole": -4,
            "astonished": 2,
            "astound": 3,
            "astounded": 3,
            "astounding": 3,
            "astoundingly": 3,
            "astounds": 3,
            "atrocious": -3,
            "atrocity": -3,
            "attack": -1,
            "attacked": -1,
            "attacking": -1,
            "attacks": -1,
            "attract": 1,
            "attracted": 1,
            "attracting": 2,
            "attraction": 2,
            "attractions": 2,
            "attractive": 2,
            "attractively": 2,
            "attractiveness": 2,
            "attracts": 1,
            "audacious": 3,
            "aura": 1,
            "authority": 1,
            "avenge": -2,
            "avenged": -2,
            "avenger": -2,
            "avengers": -2,
            "avenges": -2,
            "avenging": -2,
            "avert": -1,
            "averted": -1,
            "averts": -1,
            "avid": 2,
            "avoid": -1,
            "avoided": -1,
            "avoids": -1,
            "await": -1,
            "awaited": -1,
            "awaits": -1,
            "award": 3,
            "awarded": 3,
            "awards": 3,
            "awesome": 4,
            "awful": -3,
            "awkward": -2,
            "axe": -1,
            "axed": -1,
            "backed": 1,
            "backing": 2,
            "backs": 1,
            "bad": -3,
            "bad luck": -2,
            "badass": -3,
            "badly": -3,
            "badness": -3,
            "bailout": -2,
            "balanced": 1,
            "bamboozle": -2,
            "bamboozled": -2,
            "bamboozles": -2,
            "ban": -2,
            "banish": -1,
            "bankrupt": -3,
            "bankruptcy": -3,
            "bankster": -3,
            "banned": -2,
            "barbarian": -2,
            "barbaric": -2,
            "barbarous": -2,
            "bargain": 2,
            "barrier": -2,
            "bastard": -5,
            "bastards": -5,
            "battle": -1,
            "battled": -1,
            "battles": -1,
            "battling": -2,
            "beaten": -2,
            "beatific": 3,
            "beating": -1,
            "beauties": 3,
            "beautiful": 3,
            "beautifully": 3,
            "beautify": 3,
            "beauty": 3,
            "befit": 2,
            "befitting": 2,
            "belittle": -2,
            "belittled": -2,
            "beloved": 3,
            "benefactor": 2,
            "benefactors": 2,
            "benefit": 2,
            "benefits": 2,
            "benefitted": 2,
            "benefitting": 2,
            "benevolent": 3,
            "bereave": -2,
            "bereaved": -2,
            "bereaves": -2,
            "bereaving": -2,
            "best": 3,
            "best damn": 4,
            "betray": -3,
            "betrayal": -3,
            "betrayed": -3,
            "betraying": -3,
            "betrays": -3,
            "better": 2,
            "bias": -1,
            "biased": -2,
            "big": 1,
            "bitch": -5,
            "bitches": -5,
            "bitter": -2,
            "bitterest": -2,
            "bitterly": -2,
            "bizarre": -2,
            "blackmail": -3,
            "blackmailed": -3,
            "blackmailing": -3,
            "blackmails": -3,
            "blah": -2,
            "blame": -2,
            "blamed": -2,
            "blames": -2,
            "blaming": -2,
            "bless": 2,
            "blesses": 2,
            "blessing": 3,
            "blessings": 3,
            "blind": -1,
            "bliss": 3,
            "blissful": 3,
            "blithe": 2,
            "bloated": -1,
            "block": -1,
            "blockade": -2,
            "blockbuster": 3,
            "blocked": -1,
            "blocking": -1,
            "blocks": -1,
            "bloody": -3,
            "blurry": -2,
            "boastful": -2,
            "bold": 2,
            "boldly": 2,
            "bomb": -1,
            "boost": 1,
            "boosted": 1,
            "boosting": 1,
            "boosts": 1,
            "bore": -2,
            "bored": -2,
            "boring": -3,
            "bother": -2,
            "bothered": -2,
            "bothers": -2,
            "bothersome": -2,
            "boycott": -2,
            "boycotted": -2,
            "boycotting": -2,
            "boycotts": -2,
            "brainwashing": -3,
            "brave": 2,
            "braveness": 2,
            "bravery": 2,
            "bravura": 3,
            "breach": -2,
            "breached": -2,
            "breaches": -2,
            "breaching": -2,
            "breakthrough": 3,
            "breathtaking": 5,
            "bribe": -3,
            "bribed": -3,
            "bribes": -3,
            "bribing": -3,
            "bright": 1,
            "brightest": 2,
            "brightness": 1,
            "brilliant": 4,
            "brilliance": 3,
            "brilliances": 3,
            "brisk": 2,
            "broke": -1,
            "broken": -1,
            "brooding": -2,
            "brutal": -3,
            "brutally": -3,
            "bullied": -2,
            "bullshit": -4,
            "bully": -2,
            "bullying": -2,
            "bummer": -2,
            "buoyant": 2,
            "burden": -2,
            "burdened": -2,
            "burdening": -2,
            "burdens": -2,
            "burglar": -2,
            "burglary": -2,
            "calm": 2,
            "calmed": 2,
            "calming": 2,
            "calms": 2,
            "can't stand": -3,
            "cancel": -1,
            "cancelled": -1,
            "cancelling": -1,
            "cancels": -1,
            "cancer": -1,
            "capabilities": 1,
            "capability": 1,
            "capable": 1,
            "captivated": 3,
            "care": 2,
            "carefree": 1,
            "careful": 2,
            "carefully": 2,
            "carefulness": 2,
            "careless": -2,
            "cares": 2,
            "caring": 2,
            "cashing in": -2,
            "casualty": -2,
            "catastrophe": -3,
            "catastrophic": -4,
            "cautious": -1,
            "celebrate": 3,
            "celebrated": 3,
            "celebrates": 3,
            "celebrating": 3,
            "celebration": 3,
            "celebrations": 3,
            "censor": -2,
            "censored": -2,
            "censors": -2,
            "certain": 1,
            "chagrin": -2,
            "chagrined": -2,
            "challenge": -1,
            "champion": 2,
            "championed": 2,
            "champions": 2,
            "chance": 2,
            "chances": 2,
            "chaos": -2,
            "chaotic": -2,
            "charged": -3,
            "charges": -2,
            "charisma": 2,
            "charitable": 2,
            "charm": 3,
            "charming": 3,
            "charmingly": 3,
            "charmless": -3,
            "chastise": -3,
            "chastised": -3,
            "chastises": -3,
            "chastising": -3,
            "cheat": -3,
            "cheated": -3,
            "cheater": -3,
            "cheaters": -3,
            "cheating": -3,
            "cheats": -3,
            "cheer": 2,
            "cheered": 2,
            "cheerful": 2,
            "cheerfully": 2,
            "cheering": 2,
            "cheerless": -2,
            "cheers": 2,
            "cheery": 3,
            "cherish": 2,
            "cherished": 2,
            "cherishes": 2,
            "cherishing": 2,
            "chic": 2,
            "chide": -3,
            "chided": -3,
            "chides": -3,
            "chiding": -3,
            "childish": -2,
            "chilling": -1,
            "choke": -2,
            "choked": -2,
            "chokes": -2,
            "choking": -2,
            "clarifies": 2,
            "clarity": 2,
            "clash": -2,
            "classy": 3,
            "clean": 2,
            "cleaner": 2,
            "clear": 1,
            "cleared": 1,
            "clearly": 1,
            "clears": 1,
            "clever": 2,
            "clouded": -1,
            "clueless": -2,
            "cock": -5,
            "cocksucker": -5,
            "cocksuckers": -5,
            "cocky": -2,
            "coerced": -2,
            "coercion": -2,
            "collapse": -2,
            "collapsed": -2,
            "collapses": -2,
            "collapsing": -2,
            "collide": -1,
            "collides": -1,
            "colliding": -1,
            "collision": -2,
            "collisions": -2,
            "colluding": -3,
            "combat": -1,
            "combats": -1,
            "comedy": 1,
            "comfort": 2,
            "comfortable": 2,
            "comfortably": 2,
            "comforting": 2,
            "comforts": 2,
            "comic": 1,
            "commend": 2,
            "commended": 2,
            "commit": 1,
            "commitment": 2,
            "commits": 1,
            "committed": 1,
            "committing": 1,
            "compassion": 2,
            "compassionate": 2,
            "compelled": 1,
            "competencies": 1,
            "competent": 2,
            "competitive": 2,
            "complacent": -2,
            "complain": -2,
            "complained": -2,
            "complaining": -2,
            "complains": -2,
            "complaint": -2,
            "complaints": -2,
            "complicating": -2,
            "compliment": 2,
            "complimented": 2,
            "compliments": 2,
            "comprehensive": 2,
            "concerned": -2,
            "conciliate": 2,
            "conciliated": 2,
            "conciliates": 2,
            "conciliating": 2,
            "condemn": -2,
            "condemnation": -2,
            "condemned": -2,
            "condemns": -2,
            "confidence": 2,
            "confident": 2,
            "confidently": 2,
            "conflict": -2,
            "conflicting": -2,
            "conflictive": -2,
            "conflicts": -2,
            "confuse": -2,
            "confused": -2,
            "confusing": -2,
            "congrats": 2,
            "congratulate": 2,
            "congratulation": 2,
            "congratulations": 2,
            "consent": 2,
            "consents": 2,
            "consolable": 2,
            "conspiracy": -3,
            "constipation": -2,
            "constrained": -2,
            "contagion": -2,
            "contagions": -2,
            "contagious": -1,
            "contaminant": -2,
            "contaminants": -2,
            "contaminate": -2,
            "contaminated": -2,
            "contaminates": -2,
            "contaminating": -2,
            "contamination": -2,
            "contaminations": -2,
            "contempt": -2,
            "contemptible": -2,
            "contemptuous": -2,
            "contemptuously": -2,
            "contend": -1,
            "contender": -1,
            "contending": -1,
            "contentious": -2,
            "contestable": -2,
            "controversial": -2,
            "controversially": -2,
            "controversies": -2,
            "controversy": -2,
            "convicted": -2,
            "convince": 1,
            "convinced": 1,
            "convinces": 1,
            "convivial": 2,
            "cool": 1,
            "cool stuff": 3,
            "cornered": -2,
            "corpse": -1,
            "corrupt": -3,
            "corrupted": -3,
            "corrupting": -3,
            "corruption": -3,
            "corrupts": -3,
            "costly": -2,
            "courage": 2,
            "courageous": 2,
            "courageously": 2,
            "courageousness": 2,
            "courteous": 2,
            "courtesy": 2,
            "cover-up": -3,
            "coward": -2,
            "cowardly": -2,
            "coziness": 2,
            "cramp": -1,
            "crap": -3,
            "crappy": -3,
            "crash": -2,
            "crazier": -2,
            "craziest": -2,
            "crazy": -2,
            "creative": 2,
            "crestfallen": -2,
            "cried": -2,
            "cries": -2,
            "crime": -3,
            "crimes": -3,
            "criminal": -3,
            "criminals": -3,
            "criminate": -3,
            "criminated": -3,
            "criminates": -3,
            "crisis": -3,
            "critic": -2,
            "criticise": -2,
            "criticised": -2,
            "criticises": -2,
            "criticising": -2,
            "criticism": -2,
            "criticize": -2,
            "criticized": -2,
            "criticizes": -2,
            "criticizing": -2,
            "critics": -2,
            "critique": -2,
            "crowding": -1,
            "crude": -1,
            "cruel": -3,
            "cruelty": -3,
            "crush": -1,
            "crushed": -2,
            "crushes": -1,
            "crushing": -1,
            "cry": -1,
            "crying": -2,
            "cunning": 2,
            "cunt": -5,
            "curious": 1,
            "curse": -1,
            "cut": -1,
            "cutback": -2,
            "cutbacks": -2,
            "cute": 2,
            "cuts": -1,
            "cutting": -1,
            "cynic": -2,
            "cynical": -2,
            "cynicism": -2,
            "damage": -3,
            "damaged": -3,
            "damages": -3,
            "damaging": -3,
            "damn": -2,
            "damn cute": 3,
            "damn good": 4,
            "damned": -4,
            "damnit": -4,
            "danger": -2,
            "dangerous": -2,
            "dangerously": -2,
            "daredevil": 2,
            "daring": 2,
            "darkest": -2,
            "darkness": -1,
            "dauntless": 2,
            "dazzling": 3,
            "dead": -3,
            "deadening": -2,
            "deadlock": -2,
            "deadly": -3,
            "deafening": -1,
            "dear": 2,
            "dearly": 3,
            "death": -2,
            "deaths": -2,
            "debonair": 2,
            "debt": -2,
            "deceit": -3,
            "deceitful": -3,
            "deceive": -3,
            "deceived": -3,
            "deceives": -3,
            "deceiving": -3,
            "deception": -3,
            "deceptive": -3,
            "decisive": 1,
            "dedicated": 2,
            "dedication": 2,
            "defeat": -2,
            "defeated": -2,
            "defect": -3,
            "defective": -3,
            "defects": -3,
            "defender": 2,
            "defenders": 2,
            "defenseless": -2,
            "defer": -1,
            "deferring": -1,
            "defiant": -1,
            "deficient": -2,
            "deficiency": -2,
            "deficiencies": -2,
            "deficit": -2,
            "deformed": -2,
            "deformities": -2,
            "deformity": -2,
            "defraud": -3,
            "defrauds": -3,
            "deft": 2,
            "defunct": -2,
            "degrade": -2,
            "degraded": -2,
            "degrades": -2,
            "dehumanize": -2,
            "dehumanized": -2,
            "dehumanizes": -2,
            "dehumanizing": -2,
            "deject": -2,
            "dejected": -2,
            "dejecting": -2,
            "dejects": -2,
            "delay": -1,
            "delayed": -1,
            "delectable": 3,
            "delicious": 3,
            "delight": 3,
            "delighted": 3,
            "delightful": 3,
            "delightfully": 3,
            "delighting": 3,
            "delights": 3,
            "demand": -1,
            "demanded": -1,
            "demanding": -1,
            "demands": -1,
            "demonstration": -1,
            "demoralize": -2,
            "demoralized": -2,
            "demoralizes": -2,
            "demoralizing": -2,
            "denial": -2,
            "denials": -2,
            "denied": -2,
            "denier": -2,
            "deniers": -2,
            "denies": -2,
            "denounce": -2,
            "denounces": -2,
            "dent": -2,
            "deny": -2,
            "denying": -2,
            "deplore": -3,
            "deplored": -3,
            "deplores": -3,
            "deploring": -3,
            "deport": -2,
            "deported": -2,
            "deporting": -2,
            "deports": -2,
            "deportation": -2,
            "deportations": -2,
            "depressed": -2,
            "depressing": -2,
            "deprivation": -3,
            "derail": -2,
            "derailed": -2,
            "derails": -2,
            "derelict": -2,
            "deride": -2,
            "derided": -2,
            "derides": -2,
            "deriding": -2,
            "derision": -2,
            "desirable": 2,
            "desire": 1,
            "desired": 2,
            "desirous": 2,
            "despair": -3,
            "despairing": -3,
            "despairs": -3,
            "desperate": -3,
            "desperately": -3,
            "despondent": -3,
            "destroy": -3,
            "destroyed": -3,
            "destroying": -3,
            "destroys": -3,
            "destruction": -3,
            "destructive": -3,
            "detached": -1,
            "detain": -2,
            "detained": -2,
            "detention": -2,
            "deteriorate": -2,
            "deteriorated": -2,
            "deteriorates": -2,
            "deteriorating": -2,
            "determined": 2,
            "deterrent": -2,
            "detract": -1,
            "detracted": -1,
            "detracts": -1,
            "devastate": -2,
            "devastated": -2,
            "devastating": -2,
            "devastation": -2,
            "devastations": -2,
            "devoted": 3,
            "devotion": 2,
            "devotional": 2,
            "diamond": 1,
            "dick": -4,
            "dickhead": -4,
            "die": -3,
            "died": -3,
            "difficult": -1,
            "diffident": -2,
            "dignity": 2,
            "dilemma": -1,
            "dilligence": 2,
            "dipshit": -3,
            "dire": -3,
            "direful": -3,
            "dirt": -2,
            "dirtier": -2,
            "dirtiest": -2,
            "dirty": -2,
            "disabilities": -2,
            "disability": -2,
            "disabling": -1,
            "disadvantage": -2,
            "disadvantaged": -2,
            "disagree": -2,
            "disagreeable": -2,
            "disagreement": -2,
            "disappear": -1,
            "disappeared": -1,
            "disappears": -1,
            "disappoint": -2,
            "disappointed": -2,
            "disappointing": -2,
            "disappointment": -2,
            "disappointments": -2,
            "disappoints": -2,
            "disapproval": -2,
            "disapprovals": -2,
            "disapprove": -2,
            "disapproved": -2,
            "disapproves": -2,
            "disapproving": -2,
            "disaster": -2,
            "disasters": -2,
            "disastrous": -3,
            "disbelieve": -2,
            "discard": -1,
            "discarded": -1,
            "discarding": -1,
            "discards": -1,
            "discernment": 2,
            "discomfort": -2,
            "disconsolate": -2,
            "disconsolation": -2,
            "discontented": -2,
            "discord": -2,
            "discounted": -1,
            "discouraged": -2,
            "discredited": -2,
            "discriminate": -2,
            "discriminated": -2,
            "discriminates": -2,
            "discriminating": -2,
            "discriminatory": -2,
            "disdain": -2,
            "disease": -1,
            "diseases": -1,
            "disgrace": -2,
            "disgraced": -2,
            "disguise": -1,
            "disguised": -1,
            "disguises": -1,
            "disguising": -1,
            "disgust": -3,
            "disgusted": -3,
            "disgustful": -3,
            "disgusting": -3,
            "disheartened": -2,
            "dishonest": -2,
            "disillusioned": -2,
            "disinclined": -2,
            "disjointed": -2,
            "dislike": -2,
            "disliked": -2,
            "dislikes": -2,
            "dismal": -2,
            "dismayed": -2,
            "dismissed": -2,
            "disorder": -2,
            "disorders": -2,
            "disorganized": -2,
            "disoriented": -2,
            "disparage": -2,
            "disparaged": -2,
            "disparages": -2,
            "disparaging": -2,
            "displeased": -2,
            "displeasure": -2,
            "disproportionate": -2,
            "dispute": -2,
            "disputed": -2,
            "disputes": -2,
            "disputing": -2,
            "disqualified": -2,
            "disquiet": -2,
            "disregard": -2,
            "disregarded": -2,
            "disregarding": -2,
            "disregards": -2,
            "disrespect": -2,
            "disrespected": -2,
            "disrupt": -2,
            "disrupted": -2,
            "disrupting": -2,
            "disruption": -2,
            "disruptions": -2,
            "disruptive": -2,
            "disrupts": -2,
            "dissatisfied": -2,
            "distasteful": -2,
            "distinguished": 2,
            "distort": -2,
            "distorted": -2,
            "distorting": -2,
            "distorts": -2,
            "distract": -2,
            "distracted": -2,
            "distraction": -2,
            "distracts": -2,
            "distress": -2,
            "distressed": -2,
            "distresses": -2,
            "distressing": -2,
            "distrust": -3,
            "distrustful": -3,
            "disturb": -2,
            "disturbed": -2,
            "disturbing": -2,
            "disturbs": -2,
            "dithering": -2,
            "diverting": -1,
            "dizzy": -1,
            "dodging": -2,
            "dodgy": -2,
            "does not work": -3,
            "dolorous": -2,
            "donate": 2,
            "donated": 2,
            "donates": 2,
            "donating": 2,
            "donation": 2,
            "dont like": -2,
            "doom": -2,
            "doomed": -2,
            "doubt": -1,
            "doubted": -1,
            "doubtful": -1,
            "doubting": -1,
            "doubts": -1,
            "douche": -3,
            "douchebag": -3,
            "dour": -2,
            "downcast": -2,
            "downer": -2,
            "downhearted": -2,
            "downside": -2,
            "drag": -1,
            "dragged": -1,
            "drags": -1,
            "drained": -2,
            "dread": -2,
            "dreaded": -2,
            "dreadful": -3,
            "dreading": -2,
            "dream": 1,
            "dreams": 1,
            "dreary": -2,
            "droopy": -2,
            "drop": -1,
            "dropped": -1,
            "drown": -2,
            "drowned": -2,
            "drowns": -2,
            "drudgery": -2,
            "drunk": -2,
            "dubious": -2,
            "dud": -2,
            "dull": -2,
            "dumb": -3,
            "dumbass": -3,
            "dump": -1,
            "dumped": -2,
            "dumps": -1,
            "dupe": -2,
            "duped": -2,
            "dupery": -2,
            "durable": 2,
            "dying": -3,
            "dysfunction": -2,
            "eager": 2,
            "earnest": 2,
            "ease": 2,
            "easy": 1,
            "ecstatic": 4,
            "eerie": -2,
            "eery": -2,
            "effective": 2,
            "effectively": 2,
            "effectiveness": 2,
            "effortlessly": 2,
            "elated": 3,
            "elation": 3,
            "elegant": 2,
            "elegantly": 2,
            "embarrass": -2,
            "embarrassed": -2,
            "embarrasses": -2,
            "embarrassing": -2,
            "embarrassment": -2,
            "embezzlement": -3,
            "embittered": -2,
            "embrace": 1,
            "emergency": -2,
            "empathetic": 2,
            "empower": 2,
            "empowerment": 2,
            "emptiness": -1,
            "empty": -1,
            "enchanted": 2,
            "encourage": 2,
            "encouraged": 2,
            "encouragement": 2,
            "encourages": 2,
            "encouraging": 2,
            "endorse": 2,
            "endorsed": 2,
            "endorsement": 2,
            "endorses": 2,
            "enemies": -2,
            "enemy": -2,
            "energetic": 2,
            "engage": 1,
            "engages": 1,
            "engrossed": 1,
            "engrossing": 3,
            "enjoy": 2,
            "enjoyable": 2,
            "enjoyed": 2,
            "enjoying": 2,
            "enjoys": 2,
            "enlighten": 2,
            "enlightened": 2,
            "enlightening": 2,
            "enlightens": 2,
            "ennui": -2,
            "enrage": -2,
            "enraged": -2,
            "enrages": -2,
            "enraging": -2,
            "enrapture": 3,
            "enslave": -2,
            "enslaved": -2,
            "enslaves": -2,
            "ensure": 1,
            "ensuring": 1,
            "enterprising": 1,
            "entertaining": 2,
            "enthral": 3,
            "enthusiastic": 3,
            "entitled": 1,
            "entrusted": 2,
            "envies": -1,
            "envious": -2,
            "environment-friendly": 2,
            "envy": -1,
            "envying": -1,
            "erroneous": -2,
            "error": -2,
            "errors": -2,
            "escape": -1,
            "escapes": -1,
            "escaping": -1,
            "esteem": 2,
            "esteemed": 2,
            "ethical": 2,
            "euphoria": 3,
            "euphoric": 4,
            "evacuate": -1,
            "evacuated": -1,
            "evacuates": -1,
            "evacuating": -1,
            "evacuation": -1,
            "evergreen": 2,
            "evergreens": 2,
            "evergreening": -3,
            "eviction": -1,
            "evil": -3,
            "exacerbate": -2,
            "exacerbated": -2,
            "exacerbates": -2,
            "exacerbating": -2,
            "exaggerate": -2,
            "exaggerated": -2,
            "exaggerates": -2,
            "exaggerating": -2,
            "exasparate": -2,
            "exasperated": -2,
            "exasperates": -2,
            "exasperating": -2,
            "excellence": 3,
            "excellent": 3,
            "excite": 3,
            "excited": 3,
            "excitement": 3,
            "exciting": 3,
            "exclude": -1,
            "excluded": -2,
            "exclusion": -1,
            "exclusive": 2,
            "excruciatingly": -1,
            "excuse": -1,
            "exempt": -1,
            "exhausted": -2,
            "exhilarated": 3,
            "exhilarates": 3,
            "exhilarating": 3,
            "exonerate": 2,
            "exonerated": 2,
            "exonerates": 2,
            "exonerating": 2,
            "expand": 1,
            "expands": 1,
            "expel": -2,
            "expelled": -2,
            "expelling": -2,
            "expels": -2,
            "expertly": 2,
            "exploit": -2,
            "exploited": -2,
            "exploiting": -2,
            "exploits": -2,
            "exploration": 1,
            "explorations": 1,
            "expose": -1,
            "exposed": -1,
            "exposes": -1,
            "exposing": -1,
            "exquisite": 3,
            "extend": 1,
            "extends": 1,
            "extremist": -2,
            "extremists": -2,
            "exuberant": 4,
            "exultant": 3,
            "exultantly": 3,
            "fabulous": 4,
            "fabulously": 4,
            "fad": -2,
            "fag": -3,
            "faggot": -3,
            "faggots": -3,
            "fail": -2,
            "failed": -2,
            "failing": -2,
            "fails": -2,
            "failure": -2,
            "failures": -2,
            "fainthearted": -2,
            "fair": 2,
            "fairness": 2,
            "faith": 1,
            "faithful": 3,
            "fake": -3,
            "faker": -3,
            "fakes": -3,
            "faking": -3,
            "fallen": -2,
            "falling": -1,
            "false": -1,
            "falsely": -2,
            "falsified": -3,
            "falsify": -3,
            "fame": 1,
            "famine": -2,
            "famous": 2,
            "fan": 3,
            "fantastic": 4,
            "farce": -1,
            "fascinate": 3,
            "fascinated": 3,
            "fascinates": 3,
            "fascinating": 3,
            "fascination": 3,
            "fascist": -2,
            "fascists": -2,
            "fatal": -3,
            "fatalities": -3,
            "fatality": -3,
            "fatigue": -2,
            "fatigued": -2,
            "fatigues": -2,
            "fatiguing": -2,
            "favor": 2,
            "favorable": 2,
            "favorably": 2,
            "favored": 2,
            "favorite": 2,
            "favorited": 2,
            "favorites": 2,
            "favors": 2,
            "favour": 2,
            "favourable": 2,
            "favourably": 2,
            "favoured": 2,
            "favourite": 2,
            "favourited": 2,
            "favourites": 2,
            "favours": 2,
            "fear": -2,
            "fearful": -2,
            "fearfully": -2,
            "fearing": -2,
            "fearless": 2,
            "fearlessness": 2,
            "fearsome": -2,
            "fed up": -3,
            "feeble": -2,
            "feeling": 1,
            "felonies": -3,
            "felony": -3,
            "fertile": 2,
            "fervent": 2,
            "fervid": 2,
            "festive": 2,
            "fever": -2,
            "fiasco": -3,
            "fidgety": -2,
            "fight": -1,
            "fighting": -2,
            "fine": 2,
            "fines": -2,
            "finest": 3,
            "fire": -2,
            "fired": -2,
            "firing": -2,
            "fit": 1,
            "fitness": 1,
            "filth": -2,
            "filthy": -2,
            "flagship": 2,
            "flaw": -2,
            "flawed": -3,
            "flawless": 2,
            "flawlessly": 2,
            "flaws": -2,
            "flees": -1,
            "flop": -2,
            "flops": -2,
            "flu": -2,
            "flustered": -2,
            "focused": 2,
            "fond": 2,
            "fondness": 2,
            "fool": -2,
            "foolish": -2,
            "fools": -2,
            "forbid": -1,
            "forbidden": -2,
            "forbidding": -2,
            "forced": -1,
            "foreclosure": -2,
            "foreclosures": -2,
            "forefront": 1,
            "forget": -1,
            "forgetful": -2,
            "forgettable": -1,
            "forgive": 1,
            "forgiving": 1,
            "forgot": -1,
            "forgotten": -1,
            "fortune": 2,
            "fortunate": 2,
            "fortunately": 2,
            "foul": -3,
            "frantic": -1,
            "fraud": -4,
            "frauds": -4,
            "fraudster": -4,
            "fraudsters": -4,
            "fraudulence": -4,
            "fraudulent": -4,
            "freak": -2,
            "free": 1,
            "freedom": 2,
            "freedoms": 2,
            "frenzy": -3,
            "fresh": 1,
            "friend": 1,
            "friendliness": 2,
            "friendly": 2,
            "friendship": 2,
            "fright": -2,
            "frightened": -2,
            "frightening": -3,
            "frikin": -2,
            "frisky": 2,
            "frowning": -1,
            "fruitless": -2,
            "frustrate": -2,
            "frustrated": -2,
            "frustrates": -2,
            "frustrating": -2,
            "frustration": -2,
            "ftw": 3,
            "fuck": -4,
            "fucked": -4,
            "fucker": -4,
            "fuckers": -4,
            "fuckface": -4,
            "fuckhead": -4,
            "fuckin": -4,
            "fucking": -4,
            "fucking amazing": 4,
            "fucking beautiful": 4,
            "fucking cute": 4,
            "fucking fantastic": 4,
            "fucking good": 4,
            "fucking great": 4,
            "fucking hot": 2,
            "fucking love": 4,
            "fucking loves": 4,
            "fucking perfect": 4,
            "fucktard": -4,
            "fud": -3,
            "fuked": -4,
            "fuking": -4,
            "fulfill": 2,
            "fulfilled": 2,
            "fulfillment": 2,
            "fulfills": 2,
            "fuming": -2,
            "fun": 4,
            "funeral": -1,
            "funerals": -1,
            "funky": 2,
            "funnier": 4,
            "funny": 4,
            "furious": -3,
            "futile": -2,
            "gag": -2,
            "gagged": -2,
            "gain": 2,
            "gained": 2,
            "gaining": 2,
            "gains": 2,
            "gallant": 3,
            "gallantly": 3,
            "gallantry": 3,
            "game-changing": 3,
            "garbage": -1,
            "gem": 3,
            "generous": 2,
            "generously": 2,
            "genial": 3,
            "ghastly": -2,
            "ghost": -1,
            "giddy": -2,
            "gift": 2,
            "glad": 3,
            "glamorous": 3,
            "glamourous": 3,
            "glee": 3,
            "gleeful": 3,
            "gloom": -1,
            "gloomy": -2,
            "glorious": 2,
            "glory": 2,
            "glum": -2,
            "god": 1,
            "goddamn": -3,
            "godsend": 4,
            "gold": 2,
            "good": 3,
            "goodlooking": 3,
            "goodmorning": 1,
            "goodness": 3,
            "goodwill": 3,
            "goofiness": -2,
            "goofy": -2,
            "grace": 1,
            "graceful": 2,
            "gracious": 3,
            "grand": 3,
            "grant": 1,
            "granted": 1,
            "granting": 1,
            "grants": 1,
            "grateful": 3,
            "gratification": 2,
            "grave": -2,
            "gray": -1,
            "grisly": -2,
            "gr8": 3,
            "great": 3,
            "greater": 3,
            "greatest": 3,
            "greed": -3,
            "greedy": -2,
            "green wash": -3,
            "green washing": -3,
            "greenwash": -3,
            "greenwasher": -3,
            "greenwashers": -3,
            "greenwashing": -3,
            "greet": 1,
            "greeted": 1,
            "greeting": 1,
            "greetings": 2,
            "greets": 1,
            "grey": -1,
            "grief": -2,
            "grieved": -2,
            "grim": -2,
            "gripping": 2,
            "groan": -2,
            "groaned": -2,
            "groaning": -2,
            "groans": -2,
            "gross": -2,
            "growing": 1,
            "growth": 2,
            "growths": 2,
            "gruesome": -3,
            "guarantee": 1,
            "guilt": -3,
            "guilty": -3,
            "gullibility": -2,
            "gullible": -2,
            "gun": -1,
            "ha": 2,
            "hacked": -1,
            "haha": 3,
            "hahaha": 3,
            "hahahah": 3,
            "hail": 2,
            "hailed": 2,
            "hallelujah": 3,
            "handpicked": 1,
            "handsome": 3,
            "hapless": -2,
            "haplessness": -2,
            "happiest": 3,
            "happiness": 3,
            "happy": 3,
            "harass": -3,
            "harassed": -3,
            "harasses": -3,
            "harassing": -3,
            "harassment": -3,
            "hard": -1,
            "hardier": 2,
            "hardship": -2,
            "hardy": 2,
            "harm": -2,
            "harmed": -2,
            "harmful": -2,
            "harming": -2,
            "harmony": 2,
            "harmonious": 2,
            "harmoniously": 2,
            "harms": -2,
            "harried": -2,
            "harsh": -2,
            "harsher": -2,
            "harshest": -2,
            "harshly": -2,
            "hate": -3,
            "hated": -3,
            "hater": -3,
            "haters": -3,
            "hates": -3,
            "hating": -3,
            "hatred": -3,
            "haunt": -1,
            "haunted": -2,
            "haunting": 1,
            "haunts": -1,
            "havoc": -2,
            "hazardous": -3,
            "headache": -2,
            "healthy": 2,
            "heartbreaking": -3,
            "heartbroken": -3,
            "heartfelt": 3,
            "heartless": -2,
            "heartwarming": 3,
            "heaven": 2,
            "heavenly": 4,
            "heavyhearted": -2,
            "hehe": 2,
            "hell": -4,
            "hellish": -2,
            "help": 2,
            "helpful": 2,
            "helping": 2,
            "helpless": -2,
            "helps": 2,
            "hero": 2,
            "heroes": 2,
            "heroic": 3,
            "hesitant": -2,
            "hesitate": -2,
            "hid": -1,
            "hide": -1,
            "hideous": -3,
            "hides": -1,
            "hiding": -1,
            "highlight": 2,
            "hilarious": 2,
            "hinder": -2,
            "hindrance": -2,
            "hoax": -2,
            "hollow": -1,
            "homeless": -2,
            "homesick": -2,
            "homicide": -2,
            "homicides": -2,
            "honest": 2,
            "honor": 2,
            "honored": 2,
            "honoring": 2,
            "honour": 2,
            "honoured": 2,
            "honouring": 2,
            "hooligan": -2,
            "hooliganism": -2,
            "hooligans": -2,
            "hope": 2,
            "hopeful": 2,
            "hopefully": 2,
            "hopeless": -2,
            "hopelessness": -2,
            "hopes": 2,
            "hoping": 2,
            "horrendous": -3,
            "horrid": -3,
            "horrible": -3,
            "horrific": -3,
            "horrified": -3,
            "hospitalized": -2,
            "hostile": -2,
            "huckster": -2,
            "hug": 2,
            "huge": 1,
            "hugs": 2,
            "humane": 2,
            "humble": 1,
            "humbug": -2,
            "humerous": 3,
            "humiliated": -3,
            "humiliation": -3,
            "humor": 2,
            "humorous": 2,
            "humour": 2,
            "humourous": 2,
            "hunger": -2,
            "hurrah": 5,
            "hurt": -2,
            "hurting": -2,
            "hurts": -2,
            "hypocritical": -2,
            "hysteria": -3,
            "hysterical": -3,
            "hysterics": -3,
            "icky": -3,
            "idiocy": -3,
            "idiot": -3,
            "idiotic": -3,
            "ignorance": -2,
            "ignorant": -2,
            "ignore": -1,
            "ignored": -2,
            "ignores": -1,
            "ill": -2,
            "ill-fated": -2,
            "illegal": -3,
            "illegally": -3,
            "illegitimate": -3,
            "illiteracy": -2,
            "illness": -2,
            "illnesses": -2,
            "illogical": -2,
            "imaginative": 2,
            "imbecile": -3,
            "immobilized": -1,
            "immortal": 2,
            "immune": 1,
            "impair": -2,
            "impaired": -2,
            "impairing": -2,
            "impairment": -2,
            "impairs": -2,
            "impatient": -2,
            "impeachment": -3,
            "impeachments": -3,
            "impede": -2,
            "impeded": -2,
            "impedes": -2,
            "impeding": -2,
            "impedingly": -2,
            "imperfect": -2,
            "importance": 2,
            "important": 2,
            "impose": -1,
            "imposed": -1,
            "imposes": -1,
            "imposing": -1,
            "imposter": -2,
            "impotent": -2,
            "impress": 3,
            "impressed": 3,
            "impresses": 3,
            "impressive": 3,
            "imprisoned": -2,
            "imprisonment": -2,
            "improper": -2,
            "improperly": -2,
            "improve": 2,
            "improved": 2,
            "improvement": 2,
            "improves": 2,
            "improving": 2,
            "inability": -2,
            "inaction": -2,
            "inadequate": -2,
            "inadvertently": -2,
            "inappropriate": -2,
            "incapable": -2,
            "incapacitated": -2,
            "incapacitates": -2,
            "incapacitating": -2,
            "incense": -2,
            "incensed": -2,
            "incenses": -2,
            "incensing": -2,
            "incoherent": -2,
            "incompetence": -2,
            "incompetent": -2,
            "incomplete": -1,
            "incomprehensible": -2,
            "inconsiderate": -2,
            "inconvenience": -2,
            "inconvenient": -2,
            "increase": 1,
            "increased": 1,
            "indecisive": -2,
            "indestructible": 2,
            "indicted": -2,
            "indifference": -2,
            "indifferent": -2,
            "indignant": -2,
            "indignation": -2,
            "indoctrinate": -2,
            "indoctrinated": -2,
            "indoctrinates": -2,
            "indoctrinating": -2,
            "inediable": -2,
            "inexorable": -3,
            "inexcusable": -3,
            "ineffective": -2,
            "ineffectively": -2,
            "ineffectual": -2,
            "inefficiency": -2,
            "inefficient": -2,
            "inefficiently": -2,
            "inept": -2,
            "ineptitude": -2,
            "infantile": -2,
            "infantilized": -2,
            "infatuated": 2,
            "infatuation": 2,
            "infect": -2,
            "infected": -2,
            "infecting": -2,
            "infection": -2,
            "infections": -2,
            "infectious": -2,
            "infects": -2,
            "inferior": -2,
            "infest": -2,
            "infested": -2,
            "infesting": -2,
            "infests": -2,
            "inflamed": -2,
            "inflict": -2,
            "inflicted": -2,
            "inflicting": -2,
            "inflicts": -2,
            "influential": 2,
            "infract": -2,
            "infracted": -2,
            "infracting": -2,
            "infracts": -2,
            "infringement": -2,
            "infuriate": -2,
            "infuriated": -2,
            "infuriates": -2,
            "infuriating": -2,
            "inhibit": -1,
            "inhuman": -2,
            "injured": -2,
            "injuries": -2,
            "injury": -2,
            "injustice": -2,
            "innovate": 1,
            "innovates": 1,
            "innovation": 1,
            "innovative": 2,
            "inoperative": -2,
            "inquisition": -2,
            "inquisitive": 2,
            "insane": -2,
            "insanity": -2,
            "insecure": -2,
            "insensitive": -2,
            "insensitivity": -2,
            "insignificant": -2,
            "insipid": -2,
            "insolvent": -2,
            "insomnia": -2,
            "inspiration": 2,
            "inspirational": 2,
            "inspire": 2,
            "inspired": 2,
            "inspires": 2,
            "inspiring": 3,
            "insufficiency": -2,
            "insufficient": -2,
            "insufficiently": -2,
            "insult": -2,
            "insulted": -2,
            "insulting": -2,
            "insults": -2,
            "intact": 2,
            "integrity": 2,
            "intelligent": 2,
            "intense": 1,
            "interest": 1,
            "interested": 2,
            "interesting": 2,
            "interests": 1,
            "interrogated": -2,
            "interrupt": -2,
            "interrupted": -2,
            "interrupting": -2,
            "interruption": -2,
            "interrupts": -2,
            "intimacy": 2,
            "intimidate": -2,
            "intimidated": -2,
            "intimidates": -2,
            "intimidating": -2,
            "intimidation": -2,
            "intransigence": -2,
            "intransigency": -2,
            "intricate": 2,
            "intrigues": 1,
            "invasion": -1,
            "invincible": 2,
            "invite": 1,
            "inviting": 1,
            "invulnerable": 2,
            "irate": -3,
            "ironic": -1,
            "irony": -1,
            "irrational": -1,
            "irreparable": -2,
            "irreproducible": -2,
            "irresistible": 2,
            "irresistibly": 2,
            "irresolute": -2,
            "irresponsible": -2,
            "irresponsibly": -2,
            "irreversible": -1,
            "irreversibly": -1,
            "irritate": -3,
            "irritated": -3,
            "irritates": -3,
            "irritating": -3,
            "isolated": -1,
            "itchy": -2,
            "jackass": -4,
            "jackasses": -4,
            "jailed": -2,
            "jaunty": 2,
            "jealous": -2,
            "jealousy": -2,
            "jeopardy": -2,
            "jerk": -3,
            "jesus": 1,
            "jewel": 1,
            "jewels": 1,
            "jocular": 2,
            "join": 1,
            "joke": 2,
            "jokes": 2,
            "jolly": 2,
            "jovial": 2,
            "joy": 3,
            "joyful": 3,
            "joyfully": 3,
            "joyless": -2,
            "joyous": 3,
            "jubilant": 3,
            "jumpy": -1,
            "justice": 2,
            "justifiably": 2,
            "justified": 2,
            "keen": 1,
            "kickback": -3,
            "kickbacks": -3,
            "kidnap": -2,
            "kidnapped": -2,
            "kidnapping": -2,
            "kidnappings": -2,
            "kidnaps": -2,
            "kill": -3,
            "killed": -3,
            "killing": -3,
            "kills": -3,
            "kind": 2,
            "kind of": 0,
            "kinder": 2,
            "kindness": 2,
            "kiss": 2,
            "kudos": 3,
            "lack": -2,
            "lackadaisical": -2,
            "lag": -1,
            "lagged": -2,
            "lagging": -2,
            "lags": -2,
            "lame": -2,
            "landmark": 2,
            "lapse": -1,
            "lapsed": -1,
            "laugh": 1,
            "laughed": 1,
            "laughing": 1,
            "laughs": 1,
            "laughting": 1,
            "launched": 1,
            "lawl": 3,
            "lawsuit": -2,
            "lawsuits": -2,
            "lazy": -1,
            "leadership": 1,
            "leading": 2,
            "leak": -1,
            "leaked": -1,
            "leave": -1,
            "legal": 1,
            "legally": 1,
            "lenient": 1,
            "lethal": -2,
            "lethality": -2,
            "lethargic": -2,
            "lethargy": -2,
            "liar": -3,
            "liars": -3,
            "libelous": -2,
            "lied": -2,
            "lifeless": -1,
            "lifesaver": 4,
            "lighthearted": 1,
            "likable": 2,
            "like": 2,
            "likeable": 2,
            "liked": 2,
            "likers": 2,
            "likes": 2,
            "liking": 2,
            "limitation": -1,
            "limited": -1,
            "limits": -1,
            "litigation": -1,
            "litigious": -2,
            "lively": 2,
            "livid": -2,
            "lmao": 4,
            "lmfao": 4,
            "loathe": -3,
            "loathed": -3,
            "loathes": -3,
            "loathing": -3,
            "loathsome": -3,
            "lobbied": -2,
            "lobby": -2,
            "lobbying": -2,
            "lobbyist": -2,
            "lobbyists": -2,
            "lol": 3,
            "lolol": 4,
            "lololol": 4,
            "lolololol": 4,
            "lonely": -2,
            "lonesome": -2,
            "longing": -1,
            "lool": 3,
            "loom": -1,
            "loomed": -1,
            "looming": -1,
            "looms": -1,
            "loool": 3,
            "looool": 3,
            "loose": -3,
            "looses": -3,
            "loser": -3,
            "losing": -3,
            "loss": -3,
            "losses": -3,
            "lost": -3,
            "lousy": -2,
            "lovable": 3,
            "love": 3,
            "loved": 3,
            "lovelies": 3,
            "lovely": 3,
            "loves": 3,
            "loving": 2,
            "loving-kindness": 3,
            "lowest": -1,
            "loyal": 3,
            "loyalty": 3,
            "luck": 3,
            "luckily": 3,
            "lucky": 3,
            "lucrative": 3,
            "ludicrous": -3,
            "lugubrious": -2,
            "lunatic": -3,
            "lunatics": -3,
            "lurk": -1,
            "lurking": -1,
            "lurks": -1,
            "luxury": 2,
            "macabre": -2,
            "mad": -3,
            "maddening": -3,
            "made-up": -1,
            "madly": -3,
            "madness": -3,
            "magnificent": 3,
            "maladaption": -2,
            "maldevelopment": -2,
            "maltreatment": -2,
            "mandatory": -1,
            "manipulated": -1,
            "manipulating": -1,
            "manipulation": -1,
            "manslaughter": -3,
            "marvel": 3,
            "marvelous": 3,
            "marvels": 3,
            "masterpiece": 4,
            "masterpieces": 4,
            "matter": 1,
            "matters": 1,
            "mature": 2,
            "meaningful": 2,
            "meaningless": -2,
            "medal": 3,
            "mediocrity": -3,
            "meditative": 1,
            "melancholy": -2,
            "memorable": 1,
            "memoriam": -2,
            "menace": -2,
            "menaced": -2,
            "menaces": -2,
            "mercy": 2,
            "merry": 3,
            "mesmerizing": 3,
            "mess": -2,
            "messed": -2,
            "messing up": -2,
            "methodical": 2,
            "methodically": 2,
            "mindless": -2,
            "miracle": 4,
            "mirth": 3,
            "mirthful": 3,
            "mirthfully": 3,
            "misbehave": -2,
            "misbehaved": -2,
            "misbehaves": -2,
            "misbehaving": -2,
            "misbranding": -3,
            "miscast": -2,
            "mischief": -1,
            "mischiefs": -1,
            "misclassified": -2,
            "misclassifies": -2,
            "misclassify": -2,
            "misconduct": -2,
            "misconducted": -2,
            "misconducting": -2,
            "misconducts": -2,
            "miserable": -3,
            "miserably": -3,
            "misery": -2,
            "misfire": -2,
            "misfortune": -2,
            "misgiving": -2,
            "misinformation": -2,
            "misinformed": -2,
            "misinterpreted": -2,
            "mislead": -3,
            "misleaded": -3,
            "misleading": -3,
            "misleads": -3,
            "misplace": -2,
            "misplaced": -2,
            "misplaces": -2,
            "misplacing": -2,
            "mispricing": -3,
            "misread": -1,
            "misreport": -2,
            "misreported": -2,
            "misreporting": -2,
            "misreports": -2,
            "misrepresent": -2,
            "misrepresentation": -2,
            "misrepresentations": -2,
            "misrepresented": -2,
            "misrepresenting": -2,
            "misrepresents": -2,
            "miss": -2,
            "missed": -2,
            "missing": -2,
            "mistake": -2,
            "mistaken": -2,
            "mistakes": -2,
            "mistaking": -2,
            "misunderstand": -2,
            "misunderstanding": -2,
            "misunderstands": -2,
            "misunderstood": -2,
            "misuse": -2,
            "misused": -2,
            "misuses": -2,
            "misusing": -2,
            "moan": -2,
            "moaned": -2,
            "moaning": -2,
            "moans": -2,
            "mock": -2,
            "mocked": -2,
            "mocking": -2,
            "mocks": -2,
            "modernize": 2,
            "modernized": 2,
            "modernizes": 2,
            "modernizing": 2,
            "mongering": -2,
            "monopolize": -2,
            "monopolized": -2,
            "monopolizes": -2,
            "monopolizing": -2,
            "monotone": -1,
            "moody": -1,
            "mope": -1,
            "moping": -1,
            "moron": -3,
            "motherfucker": -5,
            "motherfucking": -5,
            "motivate": 1,
            "motivated": 2,
            "motivating": 2,
            "motivation": 1,
            "mourn": -2,
            "mourned": -2,
            "mournful": -2,
            "mourning": -2,
            "mourns": -2,
            "muddy": -2,
            "mumpish": -2,
            "murder": -2,
            "murderer": -2,
            "murdering": -3,
            "murderous": -3,
            "murders": -2,
            "murky": -2,
            "myth": -1,
            "n00b": -2,
            "naive": -2,
            "narcissism": -2,
            "nasty": -3,
            "natural": 1,
            "naïve": -2,
            "needy": -2,
            "negative": -2,
            "negativity": -2,
            "neglect": -2,
            "neglected": -2,
            "neglecting": -2,
            "neglects": -2,
            "nerves": -1,
            "nervous": -2,
            "nervously": -2,
            "nice": 3,
            "nifty": 2,
            "niggas": -5,
            "nigger": -5,
            "no": -1,
            "no fun": -3,
            "noble": 2,
            "noblest": 2,
            "noisy": -1,
            "non-approved": -2,
            "nonsense": -2,
            "noob": -2,
            "nosey": -2,
            "not good": -2,
            "not working": -3,
            "notable": 2,
            "noticeable": 2,
            "notorious": -2,
            "novel": 2,
            "numb": -1,
            "nurturing": 2,
            "nuts": -3,
            "obliterate": -2,
            "obliterated": -2,
            "obnoxious": -3,
            "obscene": -2,
            "obscenity": -2,
            "obsessed": 2,
            "obsolete": -2,
            "obstacle": -2,
            "obstacles": -2,
            "obstinate": -2,
            "obstruct": -2,
            "obstructed": -2,
            "obstructing": -2,
            "obstruction": -2,
            "obstructs": -2,
            "odd": -2,
            "offence": -2,
            "offences": -2,
            "offend": -2,
            "offended": -2,
            "offender": -2,
            "offending": -2,
            "offends": -2,
            "offense": -2,
            "offenses": -2,
            "offensive": -2,
            "offensively": -2,
            "offline": -1,
            "oks": 2,
            "ominous": 3,
            "once-in-a-lifetime": 3,
            "oops": -2,
            "opportunities": 2,
            "opportunity": 2,
            "oppressed": -2,
            "oppression": -2,
            "oppressions": -2,
            "oppressive": -2,
            "optimism": 2,
            "optimistic": 2,
            "optionless": -2,
            "ostracize": -2,
            "ostracized": -2,
            "ostracizes": -2,
            "ouch": -2,
            "outage": -2,
            "outages": -2,
            "outbreak": -2,
            "outbreaks": -2,
            "outcry": -2,
            "outmaneuvered": -2,
            "outnumbered": -2,
            "outrage": -3,
            "outraged": -3,
            "outrageous": -3,
            "outreach": 2,
            "outstanding": 5,
            "overjoyed": 4,
            "overload": -1,
            "overlooked": -1,
            "overprotective": -2,
            "overran": -2,
            "overreact": -2,
            "overreacted": -2,
            "overreacting": -2,
            "overreaction": -2,
            "overreacts": -2,
            "oversell": -2,
            "overselling": -2,
            "oversells": -2,
            "oversight": -1,
            "oversimplification": -2,
            "oversimplified": -2,
            "oversimplifies": -2,
            "oversimplify": -2,
            "oversold": -2,
            "overstatement": -2,
            "overstatements": -2,
            "overweight": -1,
            "overwrought": -3,
            "oxymoron": -1,
            "pain": -2,
            "pained": -2,
            "painful": -2,
            "panic": -3,
            "panicked": -3,
            "panics": -3,
            "paradise": 3,
            "paradox": -1,
            "pardon": 2,
            "pardoned": 2,
            "pardoning": 2,
            "pardons": 2,
            "parley": -1,
            "passion": 1,
            "passionate": 2,
            "passive": -1,
            "passively": -1,
            "pathetic": -2,
            "pay": -1,
            "peace": 2,
            "peaceful": 2,
            "peacefully": 2,
            "penalize": -2,
            "penalized": -2,
            "penalizes": -2,
            "penalizing": -2,
            "penalty": -2,
            "pensive": -1,
            "perfect": 3,
            "perfected": 2,
            "perfection": 3,
            "perfectly": 3,
            "perfects": 2,
            "peril": -2,
            "perjury": -3,
            "perpetrated": -2,
            "perpetrator": -2,
            "perpetrators": -2,
            "perplexed": -2,
            "persecute": -2,
            "persecuted": -2,
            "persecutes": -2,
            "persecuting": -2,
            "perturbed": -2,
            "pervert": -3,
            "pesky": -2,
            "pessimism": -2,
            "pessimistic": -2,
            "petrified": -2,
            "philanthropy": 2,
            "phobic": -2,
            "picturesque": 2,
            "pileup": -1,
            "pillage": -2,
            "pique": -2,
            "piqued": -2,
            "piss": -4,
            "pissed": -4,
            "pissing": -3,
            "piteous": -2,
            "pitied": -1,
            "pity": -2,
            "plague": -3,
            "plagued": -3,
            "plagues": -3,
            "plaguing": -3,
            "playful": 2,
            "pleasant": 3,
            "please": 1,
            "pleased": 3,
            "pleasurable": 3,
            "pleasure": 3,
            "plodding": -2,
            "poignant": 2,
            "pointless": -2,
            "poised": -2,
            "poison": -2,
            "poisoned": -2,
            "poisons": -2,
            "polished": 2,
            "polite": 2,
            "politeness": 2,
            "pollutant": -2,
            "pollute": -2,
            "polluted": -2,
            "polluter": -2,
            "polluters": -2,
            "pollutes": -2,
            "pollution": -2,
            "poor": -2,
            "poorer": -2,
            "poorest": -2,
            "poorly": -2,
            "popular": 3,
            "popularity": 3,
            "positive": 2,
            "positively": 2,
            "possessive": -2,
            "post-traumatic": -2,
            "postpone": -1,
            "postponed": -1,
            "postpones": -1,
            "postponing": -1,
            "poverty": -1,
            "powerful": 2,
            "powerless": -2,
            "praise": 3,
            "praised": 3,
            "praises": 3,
            "praising": 3,
            "pray": 1,
            "praying": 1,
            "prays": 1,
            "prblm": -2,
            "prblms": -2,
            "predatory": -2,
            "prepared": 1,
            "pressure": -1,
            "pressured": -2,
            "pretend": -1,
            "pretending": -1,
            "pretends": -1,
            "pretty": 1,
            "prevent": -1,
            "prevented": -1,
            "preventing": -1,
            "prevents": -1,
            "prick": -5,
            "prison": -2,
            "prisoner": -2,
            "prisoners": -2,
            "privileged": 2,
            "proactive": 2,
            "problem": -2,
            "problems": -2,
            "profit": 2,
            "profitable": 2,
            "profiteer": -2,
            "profits": 2,
            "progress": 2,
            "prohibit": -1,
            "prohibits": -1,
            "prominent": 2,
            "promise": 1,
            "promised": 1,
            "promises": 1,
            "promote": 1,
            "promoted": 1,
            "promotes": 1,
            "promoting": 1,
            "promptly": 1,
            "propaganda": -2,
            "prosecute": -1,
            "prosecuted": -2,
            "prosecutes": -1,
            "prosecution": -1,
            "prospect": 1,
            "prospects": 1,
            "prosperity": 3,
            "prosperous": 3,
            "protect": 1,
            "protected": 1,
            "protects": 1,
            "protest": -2,
            "protesters": -2,
            "protesting": -2,
            "protests": -2,
            "proud": 2,
            "proudly": 2,
            "provoke": -1,
            "provoked": -1,
            "provokes": -1,
            "provoking": -1,
            "prudence": 2,
            "pseudoscience": -3,
            "psychopathic": -2,
            "punish": -2,
            "punished": -2,
            "punishes": -2,
            "punishing": -2,
            "punitive": -2,
            "pure": 1,
            "purest": 1,
            "purposeful": 2,
            "pushy": -1,
            "puzzled": -2,
            "quaking": -2,
            "qualities": 2,
            "quality": 2,
            "questionable": -2,
            "questioned": -1,
            "questioning": -1,
            "racism": -3,
            "racist": -3,
            "racists": -3,
            "rage": -2,
            "rageful": -2,
            "rainy": -1,
            "rant": -3,
            "ranter": -3,
            "ranters": -3,
            "rants": -3,
            "rape": -4,
            "raped": -4,
            "rapist": -4,
            "rapture": 2,
            "raptured": 2,
            "raptures": 2,
            "rapturous": 4,
            "rash": -2,
            "ratified": 2,
            "reach": 1,
            "reached": 1,
            "reaches": 1,
            "reaching": 1,
            "reassure": 1,
            "reassured": 1,
            "reassures": 1,
            "reassuring": 2,
            "rebel": -2,
            "rebellion": -2,
            "rebels": -2,
            "recession": -2,
            "reckless": -2,
            "recognition": 2,
            "recommend": 2,
            "recommended": 2,
            "recommends": 2,
            "redeemed": 2,
            "refine": 1,
            "refined": 1,
            "refines": 1,
            "refreshingly": 2,
            "refuse": -2,
            "refused": -2,
            "refuses": -2,
            "refusing": -2,
            "regret": -2,
            "regretful": -2,
            "regrets": -2,
            "regretted": -2,
            "regretting": -2,
            "reigning": 1,
            "reject": -1,
            "rejected": -1,
            "rejecting": -1,
            "rejection": -2,
            "rejects": -1,
            "rejoice": 4,
            "rejoiced": 4,
            "rejoices": 4,
            "rejoicing": 4,
            "relaxed": 2,
            "relentless": -1,
            "reliability": 2,
            "reliable": 2,
            "reliably": 2,
            "reliant": 2,
            "relieve": 1,
            "relieved": 2,
            "relieves": 1,
            "relieving": 2,
            "relishing": 2,
            "remarkable": 2,
            "remorse": -2,
            "repellent": -2,
            "repercussion": -2,
            "repercussions": -2,
            "reprimand": -2,
            "reprimanded": -2,
            "reprimanding": -2,
            "reprimands": -2,
            "repulse": -1,
            "repulsed": -2,
            "repulsive": -2,
            "rescue": 2,
            "rescued": 2,
            "rescues": 2,
            "resentful": -2,
            "resign": -1,
            "resigned": -1,
            "resigning": -1,
            "resigns": -1,
            "resolute": 2,
            "resolution": 2,
            "resolve": 2,
            "resolved": 2,
            "resolves": 2,
            "resolving": 2,
            "respect": 2,
            "respected": 2,
            "respects": 2,
            "responsibility": 1,
            "responsible": 2,
            "responsive": 2,
            "restful": 2,
            "restless": -2,
            "restore": 1,
            "restored": 1,
            "restores": 1,
            "restoring": 1,
            "restrict": -2,
            "restricted": -2,
            "restricting": -2,
            "restriction": -2,
            "restrictive": -1,
            "restricts": -2,
            "retained": -1,
            "retard": -2,
            "retarded": -2,
            "retreat": -1,
            "revenge": -2,
            "revengeful": -2,
            "revered": 2,
            "revive": 2,
            "revives": 2,
            "revolting": -2,
            "reward": 2,
            "rewarded": 2,
            "rewarding": 2,
            "rewards": 2,
            "rich": 2,
            "richly": 2,
            "ridiculous": -3,
            "rig": -1,
            "rigged": -1,
            "right direction": 3,
            "righteousness": 2,
            "rightful": 2,
            "rightfully": 2,
            "rigorous": 3,
            "rigorously": 3,
            "riot": -2,
            "riots": -2,
            "rise": 1,
            "rises": 1,
            "risk": -2,
            "risks": -2,
            "risky": -2,
            "riveting": 3,
            "rob": -2,
            "robber": -2,
            "robed": -2,
            "robing": -2,
            "robs": -2,
            "robust": 2,
            "rofl": 4,
            "roflcopter": 4,
            "roflmao": 4,
            "romance": 2,
            "romantical": 2,
            "romantically": 2,
            "rose": 1,
            "rotfl": 4,
            "rotflmfao": 4,
            "rotflol": 4,
            "rotten": -3,
            "rude": -2,
            "ruin": -2,
            "ruined": -2,
            "ruining": -2,
            "ruins": -2,
            "sabotage": -2,
            "sad": -2,
            "sadden": -2,
            "saddened": -2,
            "sadly": -2,
            "safe": 1,
            "safely": 1,
            "safer": 2,
            "safety": 1,
            "salient": 1,
            "salute": 2,
            "saluted": 2,
            "salutes": 2,
            "saluting": 2,
            "salvation": 2,
            "sappy": -1,
            "sarcastic": -2,
            "satisfied": 2,
            "savange": -2,
            "savanges": -2,
            "save": 2,
            "saved": 2,
            "savings": 1,
            "scam": -2,
            "scams": -2,
            "scandal": -3,
            "scandalous": -3,
            "scandals": -3,
            "scapegoat": -2,
            "scapegoats": -2,
            "scare": -2,
            "scared": -2,
            "scar": -2,
            "scars": -2,
            "scary": -2,
            "sceptical": -2,
            "scold": -2,
            "scoop": 3,
            "scorn": -2,
            "scornful": -2,
            "scream": -2,
            "screamed": -2,
            "screaming": -2,
            "screams": -2,
            "screwed": -2,
            "screwed up": -3,
            "scum": -3,
            "scumbag": -4,
            "seamless": 2,
            "seamlessly": 2,
            "secure": 2,
            "secured": 2,
            "secures": 2,
            "sedition": -2,
            "seditious": -2,
            "seduced": -1,
            "self-abuse": -2,
            "self-confident": 2,
            "self-contradictory": -2,
            "self-deluded": -2,
            "selfish": -3,
            "selfishness": -3,
            "sentence": -2,
            "sentenced": -2,
            "sentences": -2,
            "sentencing": -2,
            "serene": 2,
            "settlement": 1,
            "settlements": 1,
            "severe": -2,
            "severely": -2,
            "sexist": -2,
            "sexistic": -2,
            "sexy": 3,
            "shaky": -2,
            "shame": -2,
            "shamed": -2,
            "shameful": -2,
            "share": 1,
            "shared": 1,
            "shares": 1,
            "shattered": -2,
            "shit": -4,
            "shithead": -4,
            "shitty": -3,
            "shock": -2,
            "shocked": -2,
            "shocking": -2,
            "shocks": -2,
            "shoody": -2,
            "shoot": -1,
            "short-sighted": -2,
            "short-sightedness": -2,
            "shortage": -2,
            "shortages": -2,
            "shrew": -4,
            "shy": -1,
            "sick": -2,
            "sickness": -2,
            "side-effect": -2,
            "side-effects": -2,
            "sigh": -2,
            "significance": 1,
            "significant": 1,
            "silencing": -1,
            "silly": -1,
            "simplicity": 1,
            "sin": -2,
            "sincere": 2,
            "sincerely": 2,
            "sincerest": 2,
            "sincerity": 2,
            "sinful": -3,
            "singleminded": -2,
            "sinister": -2,
            "sins": -2,
            "skeptic": -2,
            "skeptical": -2,
            "skepticism": -2,
            "skeptics": -2,
            "slam": -2,
            "slash": -2,
            "slashed": -2,
            "slashes": -2,
            "slashing": -2,
            "slave": -3,
            "slavery": -3,
            "slaves": -3,
            "sleeplessness": -2,
            "slick": 2,
            "slicker": 2,
            "slickest": 2,
            "slip": -1,
            "sloppy": -2,
            "sluggish": -2,
            "slumping": -1,
            "slut": -5,
            "smart": 1,
            "smarter": 2,
            "smartest": 2,
            "smear": -2,
            "smile": 2,
            "smiled": 2,
            "smiles": 2,
            "smiling": 2,
            "smog": -2,
            "smuggle": -2,
            "smuggled": -2,
            "smuggling": -2,
            "smuggles": -2,
            "sneaky": -1,
            "sneeze": -2,
            "sneezed": -2,
            "sneezes": -2,
            "sneezing": -2,
            "snub": -2,
            "snubbed": -2,
            "snubbing": -2,
            "snubs": -2,
            "sobering": 1,
            "solemn": -1,
            "solid": 2,
            "solidarity": 2,
            "solidified": 2,
            "solidifies": 2,
            "solidify": 2,
            "solidifying": 2,
            "solution": 1,
            "solutions": 1,
            "solve": 1,
            "solved": 1,
            "solves": 1,
            "solving": 1,
            "somber": -2,
            "some kind": 0,
            "son-of-a-bitch": -5,
            "soothe": 3,
            "soothed": 3,
            "soothing": 3,
            "sophisticated": 2,
            "sore": -1,
            "sorrow": -2,
            "sorrowful": -2,
            "sorry": -1,
            "spacious": 1,
            "spam": -2,
            "spammer": -3,
            "spammers": -3,
            "spamming": -2,
            "spark": 1,
            "sparkle": 3,
            "sparkles": 3,
            "sparkling": 3,
            "spearhead": 2,
            "speculative": -2,
            "spirit": 1,
            "spirited": 2,
            "spiritless": -2,
            "spiteful": -2,
            "splendid": 3,
            "spoiled": -2,
            "spoilt": -2,
            "spotless": 2,
            "sprightly": 2,
            "squander": -2,
            "squandered": -2,
            "squandering": -2,
            "squanders": -2,
            "squelched": -1,
            "stab": -2,
            "stabbed": -2,
            "stable": 2,
            "stabs": -2,
            "stall": -2,
            "stalled": -2,
            "stalling": -2,
            "stamina": 2,
            "stampede": -2,
            "stank": -2,
            "startled": -2,
            "startling": 3,
            "starve": -2,
            "starved": -2,
            "starves": -2,
            "starving": -2,
            "steadfast": 2,
            "steal": -2,
            "stealing": -2,
            "steals": -2,
            "stereotype": -2,
            "stereotyped": -2,
            "stifled": -1,
            "stimulate": 1,
            "stimulated": 1,
            "stimulates": 1,
            "stimulating": 2,
            "stingy": -2,
            "stink": -2,
            "stinked": -2,
            "stinker": -2,
            "stinking": -2,
            "stinks": -2,
            "stinky": -2,
            "stole": -2,
            "stolen": -2,
            "stop": -1,
            "stopped": -1,
            "stopping": -1,
            "stops": -1,
            "stout": 2,
            "straight": 1,
            "strange": -1,
            "strangely": -1,
            "strangled": -2,
            "strength": 2,
            "strengthen": 2,
            "strengthened": 2,
            "strengthening": 2,
            "strengthens": 2,
            "strengths": 2,
            "stress": -1,
            "stressed": -2,
            "stressor": -2,
            "stressors": -2,
            "stricken": -2,
            "strike": -1,
            "strikers": -2,
            "strikes": -1,
            "strong": 2,
            "stronger": 2,
            "strongest": 2,
            "struck": -1,
            "struggle": -2,
            "struggled": -2,
            "struggles": -2,
            "struggling": -2,
            "stubborn": -2,
            "stuck": -2,
            "stunned": -2,
            "stunning": 4,
            "stupid": -2,
            "stupidity": -3,
            "stupidly": -2,
            "suave": 2,
            "subpoena": -2,
            "substantial": 1,
            "substantially": 1,
            "subversive": -2,
            "succeed": 3,
            "succeeded": 3,
            "succeeding": 3,
            "succeeds": 3,
            "success": 2,
            "successful": 3,
            "successfully": 3,
            "suck": -3,
            "sucks": -3,
            "sue": -2,
            "sued": -2,
            "sueing": -2,
            "sues": -2,
            "suffer": -2,
            "suffered": -2,
            "sufferer": -2,
            "sufferers": -2,
            "suffering": -2,
            "suffers": -2,
            "suicidal": -2,
            "suicide": -2,
            "suicides": -2,
            "suing": -2,
            "suitable": 2,
            "suited": 2,
            "sulking": -2,
            "sulky": -2,
            "sullen": -2,
            "sunshine": 2,
            "super": 3,
            "superb": 5,
            "superior": 2,
            "support": 2,
            "supported": 2,
            "supporter": 1,
            "supporters": 1,
            "supporting": 1,
            "supportive": 2,
            "supports": 2,
            "supreme": 4,
            "survived": 2,
            "surviving": 2,
            "survivor": 2,
            "suspect": -1,
            "suspected": -1,
            "suspecting": -1,
            "suspects": -1,
            "suspend": -1,
            "suspended": -1,
            "suspicious": -2,
            "sustainability": 1,
            "sustainable": 2,
            "sustainably": 2,
            "swear": -2,
            "swearing": -2,
            "swears": -2,
            "sweet": 2,
            "sweeter": 3,
            "sweetest": 3,
            "swift": 2,
            "swiftly": 2,
            "swindle": -3,
            "swindles": -3,
            "swindling": -3,
            "sympathetic": 2,
            "sympathy": 2,
            "taint": -2,
            "tainted": -2,
            "talent": 2,
            "tard": -2,
            "tarnish": -2,
            "tarnished": -2,
            "tarnishes": -2,
            "tears": -2,
            "tender": 2,
            "tenderness": 2,
            "tense": -2,
            "tension": -1,
            "terrible": -3,
            "terribly": -3,
            "terrific": 4,
            "terrifically": 4,
            "terrified": -3,
            "terror": -3,
            "terrorist": -2,
            "terrorists": -2,
            "terrorize": -3,
            "terrorized": -3,
            "terrorizes": -3,
            "thank": 2,
            "thankful": 2,
            "thanks": 2,
            "thorny": -2,
            "thoughtful": 2,
            "thoughtless": -2,
            "threat": -2,
            "threaten": -2,
            "threatened": -2,
            "threatening": -2,
            "threatens": -2,
            "threats": -2,
            "thrilled": 5,
            "thwart": -2,
            "thwarted": -2,
            "thwarting": -2,
            "thwarts": -2,
            "timid": -2,
            "timorous": -2,
            "tired": -2,
            "tits": -2,
            "tolerance": 2,
            "tolerant": 2,
            "toothless": -2,
            "top": 2,
            "tops": 2,
            "torn": -2,
            "torture": -4,
            "tortured": -4,
            "tortures": -4,
            "torturing": -4,
            "totalitarian": -2,
            "totalitarianism": -2,
            "tout": -2,
            "touted": -2,
            "touting": -2,
            "touts": -2,
            "toxic": -3,
            "tragedies": -2,
            "tragedy": -2,
            "tragic": -2,
            "tranquil": 2,
            "transgress": -2,
            "transgressed": -2,
            "transgresses": -2,
            "transgressing": -2,
            "trap": -1,
            "trapped": -2,
            "traps": -1,
            "trauma": -3,
            "traumatic": -3,
            "travesty": -2,
            "treason": -3,
            "treasonous": -3,
            "treasure": 2,
            "treasures": 2,
            "trembling": -2,
            "tremor": -2,
            "tremors": -2,
            "tremulous": -2,
            "tribulation": -2,
            "tribute": 2,
            "tricked": -2,
            "trickery": -2,
            "triumph": 4,
            "triumphant": 4,
            "troll": -2,
            "trouble": -2,
            "troubled": -2,
            "troubles": -2,
            "troubling": -2,
            "true": 2,
            "trust": 1,
            "trusted": 2,
            "trusts": 1,
            "tumor": -2,
            "twat": -5,
            "tyran": -3,
            "tyrannic": -3,
            "tyrannical": -3,
            "tyrannically": -3,
            "tyrans": -3,
            "ubiquitous": 2,
            "ugh": -2,
            "ugliness": -3,
            "ugly": -3,
            "unable": -2,
            "unacceptable": -2,
            "unappeasable": -2,
            "unappreciated": -2,
            "unapproved": -2,
            "unattractive": -2,
            "unavailable": -1,
            "unavailing": -2,
            "unaware": -2,
            "unbearable": -2,
            "unbelievable": -1,
            "unbelieving": -1,
            "unbiased": 2,
            "uncertain": -1,
            "unclear": -1,
            "uncomfortable": -2,
            "unconcerned": -2,
            "unconfirmed": -1,
            "unconvinced": -1,
            "uncredited": -1,
            "undecided": -1,
            "undercooked": -2,
            "underestimate": -1,
            "underestimated": -1,
            "underestimates": -1,
            "underestimating": -1,
            "undermine": -2,
            "undermined": -2,
            "undermines": -2,
            "undermining": -2,
            "underperform": -2,
            "underperformed": -2,
            "underperforming": -2,
            "underperforms": -2,
            "undeserving": -2,
            "undesirable": -2,
            "uneasy": -2,
            "unemployed": -1,
            "unemployment": -2,
            "unequal": -1,
            "unequaled": 2,
            "unethical": -2,
            "uneventful": -2,
            "unfair": -2,
            "unfavorable": -2,
            "unfit": -2,
            "unfitted": -2,
            "unfocused": -2,
            "unforgivable": -3,
            "unforgiving": -2,
            "unfulfilled": -2,
            "unfunny": -2,
            "ungenerous": -2,
            "ungrateful": -3,
            "unhappy": -2,
            "unhappiness": -2,
            "unhealthy": -2,
            "unhygienic": -2,
            "unified": 1,
            "unimaginative": -2,
            "unimpressed": -2,
            "uninspired": -2,
            "unintelligent": -2,
            "unintentional": -2,
            "uninvolving": -2,
            "united": 1,
            "unjust": -2,
            "unlikely": -1,
            "unlovable": -2,
            "unloved": -2,
            "unmatched": 1,
            "unmotivated": -2,
            "unoriginal": -2,
            "unparliamentary": -2,
            "unpleasant": -2,
            "unpleasantness": -2,
            "unprofessional": -2,
            "unravel": 1,
            "unreleting": -2,
            "unresearched": -2,
            "unsafe": -2,
            "unsatisfied": -2,
            "unscientific": -2,
            "unsecured": -2,
            "unselfish": 2,
            "unsettled": -1,
            "unsold": -1,
            "unsophisticated": -2,
            "unsound": -2,
            "unstable": -2,
            "unstoppable": 2,
            "unsuccessful": -2,
            "unsuccessfully": -2,
            "unsupported": -2,
            "unsure": -1,
            "untarnished": 2,
            "untrue": -2,
            "unwanted": -2,
            "unworthy": -2,
            "uplifting": 2,
            "uproar": -3,
            "upset": -2,
            "upsets": -2,
            "upsetting": -2,
            "uptight": -2,
            "urgent": -1,
            "useful": 2,
            "usefulness": 2,
            "useless": -2,
            "uselessness": -2,
            "vague": -2,
            "validate": 1,
            "validated": 1,
            "validates": 1,
            "validating": 1,
            "vapid": -2,
            "verdict": -1,
            "verdicts": -1,
            "vested": 1,
            "vexation": -2,
            "vexing": -2,
            "vibrant": 3,
            "vicious": -2,
            "victim": -3,
            "victimization": -3,
            "victimize": -3,
            "victimized": -3,
            "victimizes": -3,
            "victimizing": -3,
            "victims": -3,
            "victor": 3,
            "victors": 3,
            "victory": 3,
            "victories": 3,
            "vigilant": 3,
            "vigor": 3,
            "vile": -3,
            "vindicate": 2,
            "vindicated": 2,
            "vindicates": 2,
            "vindicating": 2,
            "violate": -2,
            "violated": -2,
            "violates": -2,
            "violating": -2,
            "violation": -2,
            "violations": -2,
            "violence": -3,
            "violence-related": -3,
            "violent": -3,
            "violently": -3,
            "virtuous": 2,
            "virulent": -2,
            "vision": 1,
            "visionary": 3,
            "visioning": 1,
            "visions": 1,
            "vitality": 3,
            "vitamin": 1,
            "vitriolic": -3,
            "vivacious": 3,
            "vividly": 2,
            "vociferous": -1,
            "vomit": -3,
            "vomited": -3,
            "vomiting": -3,
            "vomits": -3,
            "vulnerability": -2,
            "vulnerable": -2,
            "walkout": -2,
            "walkouts": -2,
            "wanker": -3,
            "want": 1,
            "war": -2,
            "warfare": -2,
            "warm": 1,
            "warmhearted": 2,
            "warmness": 2,
            "warmth": 2,
            "warn": -2,
            "warned": -2,
            "warning": -3,
            "warnings": -3,
            "warns": -2,
            "waste": -1,
            "wasted": -2,
            "wasting": -2,
            "wavering": -1,
            "weak": -2,
            "weakened": -2,
            "weakness": -2,
            "weaknesses": -2,
            "wealth": 3,
            "wealthier": 2,
            "wealthy": 2,
            "weary": -2,
            "weep": -2,
            "weeping": -2,
            "weird": -2,
            "welcome": 2,
            "welcomed": 2,
            "welcomes": 2,
            "well-being": 2,
            "well-championed": 3,
            "well-developed": 2,
            "well-established": 2,
            "well-focused": 2,
            "well-groomed": 2,
            "well-proportioned": 2,
            "whimsical": 1,
            "whitewash": -3,
            "whore": -4,
            "wicked": -2,
            "widowed": -1,
            "willingness": 2,
            "win": 4,
            "winner": 4,
            "winning": 4,
            "wins": 4,
            "winwin": 3,
            "wisdom": 1,
            "wish": 1,
            "wishes": 1,
            "wishing": 1,
            "withdrawal": -3,
            "wits": 2,
            "woebegone": -2,
            "woeful": -3,
            "won": 3,
            "wonderful": 4,
            "wonderfully": 4,
            "woo": 3,
            "woohoo": 3,
            "wooo": 4,
            "woow": 4,
            "worn": -1,
            "worried": -3,
            "worries": -3,
            "worry": -3,
            "worrying": -3,
            "worse": -3,
            "worsen": -3,
            "worsened": -3,
            "worsening": -3,
            "worsens": -3,
            "worshiped": 3,
            "worst": -3,
            "worth": 2,
            "worthless": -2,
            "worthy": 2,
            "wow": 4,
            "wowow": 4,
            "wowww": 4,
            "wrathful": -3,
            "wreck": -2,
            "wrenching": -2,
            "wrong": -2,
            "wrongdoing": -2,
            "wrongdoings": -2,
            "wronged": -2,
            "wrongful": -2,
            "wrongfully": -2,
            "wrongly": -2,
            "wtf": -4,
            "wtff": -4,
            "wtfff": -4,
            "xo": 3,
            "xoxo": 3,
            "xoxoxo": 4,
            "xoxoxoxo": 4,
            "yeah": 1,
            "yearning": 1,
            "yeees": 2,
            "yes": 1,
            "youthful": 2,
            "yucky": -2,
            "yummy": 3,
            "zealot": -2,
            "zealots": -2,
            "zealous": 2
        };
    }, {}], 74: [function (require, module, exports) {
        (function (process) {
            var afinn = require('../build/build.json');
            var tokenize = require('./tokenize');

            /**
             * These words "flip" the sentiment of the following word.
             */
            var negators = {
                'cant': 1,
                'can\'t': 1,
                'dont': 1,
                'don\'t': 1,
                'doesnt': 1,
                'doesn\'t': 1,
                'not': 1,
                'non': 1,
                'wont': 1,
                'won\'t': 1,
                'isnt': 1,
                'isn\'t': 1
            };

            /**
             * Performs sentiment analysis on the provided input 'phrase'.
             *
             * @param {String} Input phrase
             * @param {Object} Optional sentiment additions to AFINN (hash k/v pairs)
             *
             * @return {Object}
             */
            module.exports = function (phrase, inject, callback) {
                // Parse arguments
                if (typeof phrase === 'undefined') phrase = '';
                if (typeof inject === 'undefined') inject = null;
                if (typeof inject === 'function') callback = inject;
                if (typeof callback === 'undefined') callback = null;

                // Merge
                if (inject !== null) {
                    afinn = Object.assign(afinn, inject);
                }

                // Storage objects
                var tokens = tokenize(phrase),
                    score = 0,
                    words = [],
                    positive = [],
                    negative = [];

                // Iterate over tokens
                var len = tokens.length;
                while (len--) {
                    var obj = tokens[len];
                    var item = afinn[obj];
                    if (!afinn.hasOwnProperty(obj)) continue;

                    // Check for negation
                    if (len > 0) {
                        var prevtoken = tokens[len - 1];
                        if (negators[prevtoken]) item = -item;
                    }

                    words.push(obj);
                    if (item > 0) positive.push(obj);
                    if (item < 0) negative.push(obj);

                    score += item;
                }

                // Handle optional async interface
                var result = {
                    score: score,
                    comparative: tokens.length > 0 ? score / tokens.length : 0,
                    tokens: tokens,
                    words: words,
                    positive: positive,
                    negative: negative
                };

                if (callback === null) return result;
                process.nextTick(function () {
                    callback(null, result);
                });
            };
        }).call(this, require('_process'));
    }, { "../build/build.json": 73, "./tokenize": 75, "_process": 1 }], 75: [function (require, module, exports) {
        /**
         * Remove special characters and return an array of tokens (words).
         * @param  {string} input Input string
         * @return {array}        Array of tokens
         */
        module.exports = function (input) {
            return input.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`\"~()]/g, '').split(' ');
        };
    }, {}], 76: [function (require, module, exports) {
        // process.env.TZ = 'Eastern Daylight Time'

        var chrono = require('chrono-node');
        var sentiment = require('sentiment');

        var NAME_TO_NUMBER = {
            "zero": "0",
            "one": "1",
            "two": "2",
            "three": "3",
            "four": "4",
            "five": "5",
            "six": "6",
            "seven": "7",
            "eight": "8",
            "nine": "9",
            "ten": "10",
            "eleven": "11",
            "twelve": "12",
            "thirteen": "13",
            "fourteen": "14",
            "fifteen": "15",
            "sixteen": "16",
            "seventeen": "17",
            "eighteen": "18",
            "nineteen": "19",
            "twenty": "20",
            "twenty one": "21",
            "twenty two": "22",
            "twenty three": "23",
            "twenty four": "24",
            "twenty five": "25",
            "twenty six": "26",
            "twenty seven": "27",
            "twenty eight": "28",
            "twenty nine": "29",
            "thirty": "30",
            "thirty one": "31",
            "twenty-one": "21",
            "twenty-two": "22",
            "twenty-three": "23",
            "twenty-four": "24",
            "twenty-five": "25",
            "twenty-six": "26",
            "twenty-seven": "27",
            "twenty-eight": "28",
            "twenty-nine": "29",
            "thirty-one": "31"
        };

        var OVERRIDES = {
            "can't": -4,
            "can": 2,
            "unavailable": -4,
            "available": 2,
            "free": 2,
            "not": -4,
            "out of office": -4

            // function successHandler(res) {
            //   console.log(res)
            //   // $("#message").text(JSON.stringify(res))

            //   var container = $("#timeline")[0]
            //   var data = new vis.DataSet(res.data)
            //   var groups = new vis.DataSet(res.groups)
            //   var options = {
            //     stack: false,
            //     // start: new Date(),
            //     // end: new Date(7*24*60*60*1000 + (new Date()).valueOf()),
            //     selectable: false,
            //     margin: {
            //       item: 10, // minimal margin between items
            //       axis: 5   // minimal margin between items and the axis
            //     },
            //     orientation: "top"
            //   }
            //   var timeline = new vis.Timeline(container, data, groups, options)
            // }

        };chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
            console.log(tab.url, tab.title);
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.sendMessage(tab.id, { action: "scrape" }, function (req) {
                    if (req.action == "scrape") {
                        // $("#message").text(req.messages.length)
                        var data = req.messages;
                        // var data = JSON.parse(req.body["messages"]);
                        console.log(data);
                        var response = {
                            "availability": []
                        };
                        var userDict = {};
                        var userRanges = {};
                        for (var i = 0; i < data.length; i++) {
                            var message = data[i]["message"].toLowerCase();

                            var words_list = data[i]["message"].split(" ");
                            console.log(message.toLowerCase());
                            for (var j = 0; j < words_list.length; j++) {
                                if (Object.keys(NAME_TO_NUMBER).indexOf(words_list[j]) !== -1) {
                                    message = message.replace(words_list[j], NAME_TO_NUMBER[words_list[j]]);
                                }
                            }
                            var parse_results = chrono.parse(message);
                            var user_name = data[i]["username"];
                            for (var j = 0; j < parse_results.length; j++) {
                                var date_dictionary = parse_results[j].start.knownValues;
                                var date_dictionary_i = parse_results[j].start.impliedValues;
                                var keys = Object.keys(parse_results[j].start.impliedValues);
                                for (var ite = 0; ite < keys.length; ite++) {
                                    date_dictionary[keys[ite]] = date_dictionary_i[keys[ite]];
                                }
                                var startTime = new Date(date_dictionary.year, date_dictionary.month - 1, date_dictionary.day, date_dictionary.hour - 4, date_dictionary.minute, date_dictionary.second);
                                var endTime;
                                if (parse_results[j].end != undefined) {
                                    var d = parse_results[j].end.knownValues;
                                    var y = parse_results[j].end.impliedValues;
                                    var _keys = Object.keys(parse_results[j].end.impliedValues);
                                    for (var iter = 0; iter < _keys.length; iter++) {
                                        d[_keys[iter]] = y[_keys[iter]];
                                    }
                                    endTime = new Date(d.year, d.month - 1, d.day, d.hour - 4, d.minute, d.second);
                                } else {
                                    endTime = new Date(date_dictionary.year, date_dictionary.month - 1, date_dictionary.day, date_dictionary.hour - 4 + 1, date_dictionary.minute, date_dictionary.second);
                                }

                                var boolAvailable;
                                var message_body = data[i]["message"];
                                if (sentiment(message_body, OVERRIDES)["score"] < 0) {
                                    boolAvailable = "false";
                                } else {
                                    boolAvailable = "true";
                                }
                                var startStamp = startTime.valueOf();
                                var endStamp = endTime.valueOf();

                                var details = {
                                    "available": boolAvailable,
                                    "start": startTime,
                                    "end": endTime
                                };
                                var userKeys = Object.keys(userDict);
                                for (var usernamei = 0; usernamei < userKeys.length; usernamei++) {
                                    for (var rangei = userDict[userKeys[usernamei]].length - 1; rangei >= 0; rangei--) {
                                        // console.log(rangei);
                                        // console.log(userKeys[usernamei]);
                                        var curSet = userDict[userKeys[usernamei]][rangei];
                                        var startCur = curSet["start"].valueOf();
                                        var endCur = curSet["end"].valueOf();
                                        console.log("Adding");
                                        console.log(startTime, endTime);
                                        console.log("Override");
                                        console.log(curSet["start"], curSet["end"]);
                                        if (startStamp <= startCur && endStamp >= endCur) {
                                            console.log("large period");
                                            console.log(userDict[userKeys[usernamei]]);
                                            userDict[userKeys[usernamei]].splice(rangei, 1);

                                            console.log(userDict[userKeys[usernamei]]);
                                            // userDict[userKeys[usernamei]][rangei].deleteObject();
                                        } else if (startStamp > startCur && endStamp < endCur) {
                                            if (curSet["available"] !== boolAvailable) {
                                                userDict[userKeys[usernamei]].push({
                                                    "available": curSet["available"],
                                                    "start": new Date(endStamp),
                                                    "end": curSet["end"]
                                                });
                                                userDict[userKeys[usernamei]][rangei]["end"] = new Date(startStamp);
                                            }
                                        } else {
                                            //if end of current is after the start of previous
                                            if (endStamp > startCur && startStamp < startCur) {
                                                userDict[userKeys[usernamei]][rangei]["start"] = new Date(endStamp);
                                                console.log("end>start");
                                                console.log(endTime);
                                            }
                                            //if start of current is less than end of previous
                                            if (startStamp < endCur && endStamp > endCur) {
                                                userDict[userKeys[usernamei]][rangei]["end"] = new Date(startStamp);
                                                console.log("start<end");
                                                console.log(startTime);
                                            }
                                        }
                                    }
                                }
                                if (userDict[user_name] === undefined) {
                                    userDict[user_name] = [details];
                                    // userRange[user_name] = [[details["start"], ]
                                } else {
                                    userDict[user_name].push(details);
                                }
                            }

                            console.log("dict:");
                            console.log(userDict);
                            console.log(response);
                        }

                        var userKeys = Object.keys(userDict);
                        var newrep = {
                            "data": [],
                            "groups": []
                        };
                        var counter = 0;
                        console.log(userDict);
                        for (var usernamei = 0; usernamei < userKeys.length; usernamei++) {
                            newrep["groups"].push({
                                "id": usernamei,
                                "content": userKeys[usernamei]
                            });
                            for (var rangei = 0; rangei < userDict[userKeys[usernamei]].length; rangei++) {
                                console.log(rangei);
                                console.log(userKeys[usernamei]);
                                var curSet = userDict[userKeys[usernamei]][rangei];
                                newrep["data"].push({
                                    "id": counter,
                                    content: "",
                                    "start": String(curSet["start"]),
                                    "end": String(curSet["end"]),
                                    "group": usernamei,
                                    "className": curSet["available"] == "true" ? "available" : "busy"
                                });
                                counter++;
                            }
                        }
                        console.log(newrep);
                        // res.send(newrep);
                        var container = $("#timeline")[0];
                        var data = new vis.DataSet(newrep.data);
                        var groups = new vis.DataSet(newrep.groups);
                        var options = {
                            stack: false,
                            // start: new Date(),
                            // end: new Date(7*24*60*60*1000 + (new Date()).valueOf()),
                            selectable: false,
                            margin: {
                                item: 10, // minimal margin between items
                                axis: 5 // minimal margin between items and the axis
                            },
                            orientation: "top"
                        };
                        var timeline = new vis.Timeline(container, data, groups, options);
                        // console.log(data)
                        // $.post("http://127.0.0.1:9000/post/data", data, successHandler)
                    }
                });
            });
        });
    }, { "chrono-node": 2, "sentiment": 74 }] }, {}, [76]);