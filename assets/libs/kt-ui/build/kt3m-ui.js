/*! kt3m-ui 2015-07-09 */
(function(exports, global) {
    global["ktUi"] = exports;
    (function() {
        var root = this;
        var previousUnderscore = root._;
        var breaker = {};
        var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
        var getTime = Date.now || function() {
            return new Date().getTime();
        };
        var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
        var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
        var _ = function(obj) {
            if (obj instanceof _) return obj;
            if (!(this instanceof _)) return new _(obj);
            this._wrapped = obj;
        };
        if (typeof exports !== "undefined") {
            if (typeof module !== "undefined" && module.exports) {
                exports = module.exports = _;
            }
            exports._ = _;
        } else {
            root._ = _;
        }
        _.VERSION = "1.5.2";
        var each = _.each = _.forEach = function(obj, iterator, context) {
            if (obj == null) return;
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, length = obj.length; i < length; i++) {
                    if (iterator.call(context, obj[i], i, obj) === breaker) return;
                }
            } else {
                var keys = _.keys(obj);
                for (var i = 0, length = keys.length; i < length; i++) {
                    if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
                }
            }
        };
        _.map = _.collect = function(obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
            each(obj, function(value, index, list) {
                results.push(iterator.call(context, value, index, list));
            });
            return results;
        };
        var reduceError = "Reduce of empty array with no initial value";
        _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null) obj = [];
            if (nativeReduce && obj.reduce === nativeReduce) {
                if (context) iterator = _.bind(iterator, context);
                return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
            }
            each(obj, function(value, index, list) {
                if (!initial) {
                    memo = value;
                    initial = true;
                } else {
                    memo = iterator.call(context, memo, value, index, list);
                }
            });
            if (!initial) throw new TypeError(reduceError);
            return memo;
        };
        _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null) obj = [];
            if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
                if (context) iterator = _.bind(iterator, context);
                return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
            }
            var length = obj.length;
            if (length !== +length) {
                var keys = _.keys(obj);
                length = keys.length;
            }
            each(obj, function(value, index, list) {
                index = keys ? keys[--length] : --length;
                if (!initial) {
                    memo = obj[index];
                    initial = true;
                } else {
                    memo = iterator.call(context, memo, obj[index], index, list);
                }
            });
            if (!initial) throw new TypeError(reduceError);
            return memo;
        };
        _.find = _.detect = function(obj, iterator, context) {
            var result;
            any(obj, function(value, index, list) {
                if (iterator.call(context, value, index, list)) {
                    result = value;
                    return true;
                }
            });
            return result;
        };
        _.filter = _.select = function(obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
            each(obj, function(value, index, list) {
                if (iterator.call(context, value, index, list)) results.push(value);
            });
            return results;
        };
        _.reject = function(obj, iterator, context) {
            return _.filter(obj, function(value, index, list) {
                return !iterator.call(context, value, index, list);
            }, context);
        };
        _.every = _.all = function(obj, iterator, context) {
            iterator || (iterator = _.identity);
            var result = true;
            if (obj == null) return result;
            if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
            each(obj, function(value, index, list) {
                if (!(result = result && iterator.call(context, value, index, list))) return breaker;
            });
            return !!result;
        };
        var any = _.some = _.any = function(obj, iterator, context) {
            iterator || (iterator = _.identity);
            var result = false;
            if (obj == null) return result;
            if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
            each(obj, function(value, index, list) {
                if (result || (result = iterator.call(context, value, index, list))) return breaker;
            });
            return !!result;
        };
        _.contains = _.include = function(obj, target) {
            if (obj == null) return false;
            if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
            return any(obj, function(value) {
                return value === target;
            });
        };
        _.invoke = function(obj, method) {
            var args = slice.call(arguments, 2);
            var isFunc = _.isFunction(method);
            return _.map(obj, function(value) {
                return (isFunc ? method : value[method]).apply(value, args);
            });
        };
        _.pluck = function(obj, key) {
            return _.map(obj, function(value) {
                return value[key];
            });
        };
        _.where = function(obj, attrs, first) {
            if (_.isEmpty(attrs)) return first ? void 0 : [];
            return _[first ? "find" : "filter"](obj, function(value) {
                for (var key in attrs) {
                    if (attrs[key] !== value[key]) return false;
                }
                return true;
            });
        };
        _.findWhere = function(obj, attrs) {
            return _.where(obj, attrs, true);
        };
        _.max = function(obj, iterator, context) {
            if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
                return Math.max.apply(Math, obj);
            }
            if (!iterator && _.isEmpty(obj)) return -Infinity;
            var result = {
                computed: -Infinity,
                value: -Infinity
            };
            each(obj, function(value, index, list) {
                var computed = iterator ? iterator.call(context, value, index, list) : value;
                computed > result.computed && (result = {
                    value: value,
                    computed: computed
                });
            });
            return result.value;
        };
        _.min = function(obj, iterator, context) {
            if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
                return Math.min.apply(Math, obj);
            }
            if (!iterator && _.isEmpty(obj)) return Infinity;
            var result = {
                computed: Infinity,
                value: Infinity
            };
            each(obj, function(value, index, list) {
                var computed = iterator ? iterator.call(context, value, index, list) : value;
                computed < result.computed && (result = {
                    value: value,
                    computed: computed
                });
            });
            return result.value;
        };
        _.shuffle = function(obj) {
            var rand;
            var index = 0;
            var shuffled = [];
            each(obj, function(value) {
                rand = _.random(index++);
                shuffled[index - 1] = shuffled[rand];
                shuffled[rand] = value;
            });
            return shuffled;
        };
        _.sample = function(obj, n, guard) {
            if (n == null || guard) {
                if (obj.length !== +obj.length) obj = _.values(obj);
                return obj[_.random(obj.length - 1)];
            }
            return _.shuffle(obj).slice(0, Math.max(0, n));
        };
        var lookupIterator = function(value) {
            return _.isFunction(value) ? value : function(obj) {
                return obj[value];
            };
        };
        _.sortBy = function(obj, value, context) {
            var iterator = value == null ? _.identity : lookupIterator(value);
            return _.pluck(_.map(obj, function(value, index, list) {
                return {
                    value: value,
                    index: index,
                    criteria: iterator.call(context, value, index, list)
                };
            }).sort(function(left, right) {
                var a = left.criteria;
                var b = right.criteria;
                if (a !== b) {
                    if (a > b || a === void 0) return 1;
                    if (a < b || b === void 0) return -1;
                }
                return left.index - right.index;
            }), "value");
        };
        var group = function(behavior) {
            return function(obj, value, context) {
                var result = {};
                var iterator = value == null ? _.identity : lookupIterator(value);
                each(obj, function(value, index) {
                    var key = iterator.call(context, value, index, obj);
                    behavior(result, key, value);
                });
                return result;
            };
        };
        _.groupBy = group(function(result, key, value) {
            (_.has(result, key) ? result[key] : result[key] = []).push(value);
        });
        _.indexBy = group(function(result, key, value) {
            result[key] = value;
        });
        _.countBy = group(function(result, key) {
            _.has(result, key) ? result[key]++ : result[key] = 1;
        });
        _.sortedIndex = function(array, obj, iterator, context) {
            iterator = iterator == null ? _.identity : lookupIterator(iterator);
            var value = iterator.call(context, obj);
            var low = 0, high = array.length;
            while (low < high) {
                var mid = low + high >>> 1;
                iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
            }
            return low;
        };
        _.toArray = function(obj) {
            if (!obj) return [];
            if (_.isArray(obj)) return slice.call(obj);
            if (obj.length === +obj.length) return _.map(obj, _.identity);
            return _.values(obj);
        };
        _.size = function(obj) {
            if (obj == null) return 0;
            return obj.length === +obj.length ? obj.length : _.keys(obj).length;
        };
        _.first = _.head = _.take = function(array, n, guard) {
            if (array == null) return void 0;
            return n == null || guard ? array[0] : slice.call(array, 0, n);
        };
        _.initial = function(array, n, guard) {
            return slice.call(array, 0, array.length - (n == null || guard ? 1 : n));
        };
        _.last = function(array, n, guard) {
            if (array == null) return void 0;
            if (n == null || guard) {
                return array[array.length - 1];
            } else {
                return slice.call(array, Math.max(array.length - n, 0));
            }
        };
        _.rest = _.tail = _.drop = function(array, n, guard) {
            return slice.call(array, n == null || guard ? 1 : n);
        };
        _.compact = function(array) {
            return _.filter(array, _.identity);
        };
        var flatten = function(input, shallow, output) {
            if (shallow && _.every(input, _.isArray)) {
                return concat.apply(output, input);
            }
            each(input, function(value) {
                if (_.isArray(value) || _.isArguments(value)) {
                    shallow ? push.apply(output, value) : flatten(value, shallow, output);
                } else {
                    output.push(value);
                }
            });
            return output;
        };
        _.flatten = function(array, shallow) {
            return flatten(array, shallow, []);
        };
        _.without = function(array) {
            return _.difference(array, slice.call(arguments, 1));
        };
        _.uniq = _.unique = function(array, isSorted, iterator, context) {
            if (_.isFunction(isSorted)) {
                context = iterator;
                iterator = isSorted;
                isSorted = false;
            }
            var initial = iterator ? _.map(array, iterator, context) : array;
            var results = [];
            var seen = [];
            each(initial, function(value, index) {
                if (isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
                    seen.push(value);
                    results.push(array[index]);
                }
            });
            return results;
        };
        _.union = function() {
            return _.uniq(_.flatten(arguments, true));
        };
        _.intersection = function(array) {
            var rest = slice.call(arguments, 1);
            return _.filter(_.uniq(array), function(item) {
                return _.every(rest, function(other) {
                    return _.indexOf(other, item) >= 0;
                });
            });
        };
        _.difference = function(array) {
            var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
            return _.filter(array, function(value) {
                return !_.contains(rest, value);
            });
        };
        _.zip = function() {
            var length = _.max(_.pluck(arguments, "length").concat(0));
            var results = new Array(length);
            for (var i = 0; i < length; i++) {
                results[i] = _.pluck(arguments, "" + i);
            }
            return results;
        };
        _.object = function(list, values) {
            if (list == null) return {};
            var result = {};
            for (var i = 0, length = list.length; i < length; i++) {
                if (values) {
                    result[list[i]] = values[i];
                } else {
                    result[list[i][0]] = list[i][1];
                }
            }
            return result;
        };
        _.indexOf = function(array, item, isSorted) {
            if (array == null) return -1;
            var i = 0, length = array.length;
            if (isSorted) {
                if (typeof isSorted == "number") {
                    i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
                } else {
                    i = _.sortedIndex(array, item);
                    return array[i] === item ? i : -1;
                }
            }
            if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
            for (;i < length; i++) if (array[i] === item) return i;
            return -1;
        };
        _.lastIndexOf = function(array, item, from) {
            if (array == null) return -1;
            var hasIndex = from != null;
            if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
                return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
            }
            var i = hasIndex ? from : array.length;
            while (i--) if (array[i] === item) return i;
            return -1;
        };
        _.range = function(start, stop, step) {
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            step = arguments[2] || 1;
            var length = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = new Array(length);
            while (idx < length) {
                range[idx++] = start;
                start += step;
            }
            return range;
        };
        var ctor = function() {};
        _.bind = function(func, context) {
            var args, bound;
            if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
            if (!_.isFunction(func)) throw new TypeError();
            args = slice.call(arguments, 2);
            return bound = function() {
                if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                ctor.prototype = func.prototype;
                var self = new ctor();
                ctor.prototype = null;
                var result = func.apply(self, args.concat(slice.call(arguments)));
                if (Object(result) === result) return result;
                return self;
            };
        };
        _.partial = function(func) {
            var args = slice.call(arguments, 1);
            return function() {
                return func.apply(this, args.concat(slice.call(arguments)));
            };
        };
        _.bindAll = function(obj) {
            var funcs = slice.call(arguments, 1);
            if (funcs.length === 0) throw new Error("bindAll must be passed function names");
            each(funcs, function(f) {
                obj[f] = _.bind(obj[f], obj);
            });
            return obj;
        };
        _.memoize = function(func, hasher) {
            var memo = {};
            hasher || (hasher = _.identity);
            return function() {
                var key = hasher.apply(this, arguments);
                return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments);
            };
        };
        _.delay = function(func, wait) {
            var args = slice.call(arguments, 2);
            return setTimeout(function() {
                return func.apply(null, args);
            }, wait);
        };
        _.defer = function(func) {
            return _.delay.apply(_, [ func, 1 ].concat(slice.call(arguments, 1)));
        };
        _.throttle = function(func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            options || (options = {});
            var later = function() {
                previous = options.leading === false ? 0 : getTime();
                timeout = null;
                result = func.apply(context, args);
            };
            return function() {
                var now = getTime();
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        };
        _.debounce = function(func, wait, immediate) {
            var timeout, args, context, timestamp, result;
            return function() {
                context = this;
                args = arguments;
                timestamp = getTime();
                var later = function() {
                    var last = getTime() - timestamp;
                    if (last < wait) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) result = func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
                if (callNow) result = func.apply(context, args);
                return result;
            };
        };
        _.once = function(func) {
            var ran = false, memo;
            return function() {
                if (ran) return memo;
                ran = true;
                memo = func.apply(this, arguments);
                func = null;
                return memo;
            };
        };
        _.wrap = function(func, wrapper) {
            return function() {
                var args = [ func ];
                push.apply(args, arguments);
                return wrapper.apply(this, args);
            };
        };
        _.compose = function() {
            var funcs = arguments;
            return function() {
                var args = arguments;
                for (var i = funcs.length - 1; i >= 0; i--) {
                    args = [ funcs[i].apply(this, args) ];
                }
                return args[0];
            };
        };
        _.after = function(times, func) {
            return function() {
                if (--times < 1) {
                    return func.apply(this, arguments);
                }
            };
        };
        _.keys = nativeKeys || function(obj) {
            if (obj !== Object(obj)) throw new TypeError("Invalid object");
            var keys = [];
            for (var key in obj) if (_.has(obj, key)) keys.push(key);
            return keys;
        };
        _.values = function(obj) {
            var keys = _.keys(obj);
            var length = keys.length;
            var values = new Array(length);
            for (var i = 0; i < length; i++) {
                values[i] = obj[keys[i]];
            }
            return values;
        };
        _.pairs = function(obj) {
            var keys = _.keys(obj);
            var length = keys.length;
            var pairs = new Array(length);
            for (var i = 0; i < length; i++) {
                pairs[i] = [ keys[i], obj[keys[i]] ];
            }
            return pairs;
        };
        _.invert = function(obj) {
            var result = {};
            var keys = _.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                result[obj[keys[i]]] = keys[i];
            }
            return result;
        };
        _.functions = _.methods = function(obj) {
            var names = [];
            for (var key in obj) {
                if (_.isFunction(obj[key])) names.push(key);
            }
            return names.sort();
        };
        _.extend = function(obj) {
            each(slice.call(arguments, 1), function(source) {
                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        };
        _.pick = function(obj) {
            var copy = {};
            var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
            each(keys, function(key) {
                if (key in obj) copy[key] = obj[key];
            });
            return copy;
        };
        _.omit = function(obj) {
            var copy = {};
            var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
            for (var key in obj) {
                if (!_.contains(keys, key)) copy[key] = obj[key];
            }
            return copy;
        };
        _.defaults = function(obj) {
            each(slice.call(arguments, 1), function(source) {
                if (source) {
                    for (var prop in source) {
                        if (obj[prop] === void 0) obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        };
        _.clone = function(obj) {
            if (!_.isObject(obj)) return obj;
            return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        };
        _.tap = function(obj, interceptor) {
            interceptor(obj);
            return obj;
        };
        var eq = function(a, b, aStack, bStack) {
            if (a === b) return a !== 0 || 1 / a == 1 / b;
            if (a == null || b == null) return a === b;
            if (a instanceof _) a = a._wrapped;
            if (b instanceof _) b = b._wrapped;
            var className = toString.call(a);
            if (className != toString.call(b)) return false;
            switch (className) {
              case "[object String]":
                return a == String(b);

              case "[object Number]":
                return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;

              case "[object Date]":
              case "[object Boolean]":
                return +a == +b;

              case "[object RegExp]":
                return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
            }
            if (typeof a != "object" || typeof b != "object") return false;
            var length = aStack.length;
            while (length--) {
                if (aStack[length] == a) return bStack[length] == b;
            }
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
                return false;
            }
            aStack.push(a);
            bStack.push(b);
            var size = 0, result = true;
            if (className == "[object Array]") {
                size = a.length;
                result = size == b.length;
                if (result) {
                    while (size--) {
                        if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                    }
                }
            } else {
                for (var key in a) {
                    if (_.has(a, key)) {
                        size++;
                        if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                    }
                }
                if (result) {
                    for (key in b) {
                        if (_.has(b, key) && !size--) break;
                    }
                    result = !size;
                }
            }
            aStack.pop();
            bStack.pop();
            return result;
        };
        _.isEqual = function(a, b) {
            return eq(a, b, [], []);
        };
        _.isEmpty = function(obj) {
            if (obj == null) return true;
            if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
            for (var key in obj) if (_.has(obj, key)) return false;
            return true;
        };
        _.isElement = function(obj) {
            return !!(obj && obj.nodeType === 1);
        };
        _.isArray = nativeIsArray || function(obj) {
            return toString.call(obj) == "[object Array]";
        };
        _.isObject = function(obj) {
            return obj === Object(obj);
        };
        each([ "Arguments", "Function", "String", "Number", "Date", "RegExp" ], function(name) {
            _["is" + name] = function(obj) {
                return toString.call(obj) == "[object " + name + "]";
            };
        });
        if (!_.isArguments(arguments)) {
            _.isArguments = function(obj) {
                return !!(obj && _.has(obj, "callee"));
            };
        }
        if (typeof /./ !== "function") {
            _.isFunction = function(obj) {
                return typeof obj === "function";
            };
        }
        _.isFinite = function(obj) {
            return isFinite(obj) && !isNaN(parseFloat(obj));
        };
        _.isNaN = function(obj) {
            return _.isNumber(obj) && obj != +obj;
        };
        _.isBoolean = function(obj) {
            return obj === true || obj === false || toString.call(obj) == "[object Boolean]";
        };
        _.isNull = function(obj) {
            return obj === null;
        };
        _.isUndefined = function(obj) {
            return obj === void 0;
        };
        _.has = function(obj, key) {
            return hasOwnProperty.call(obj, key);
        };
        _.noConflict = function() {
            root._ = previousUnderscore;
            return this;
        };
        _.identity = function(value) {
            return value;
        };
        _.times = function(n, iterator, context) {
            var accum = Array(Math.max(0, n));
            for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
            return accum;
        };
        _.random = function(min, max) {
            if (max == null) {
                max = min;
                min = 0;
            }
            return min + Math.floor(Math.random() * (max - min + 1));
        };
        var entityMap = {
            escape: {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;"
            }
        };
        entityMap.unescape = _.invert(entityMap.escape);
        var entityRegexes = {
            escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
            unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
        };
        _.each([ "escape", "unescape" ], function(method) {
            _[method] = function(string) {
                if (string == null) return "";
                return ("" + string).replace(entityRegexes[method], function(match) {
                    return entityMap[method][match];
                });
            };
        });
        _.result = function(object, property) {
            if (object == null) return void 0;
            var value = object[property];
            return _.isFunction(value) ? value.call(object) : value;
        };
        _.mixin = function(obj) {
            each(_.functions(obj), function(name) {
                var func = _[name] = obj[name];
                _.prototype[name] = function() {
                    var args = [ this._wrapped ];
                    push.apply(args, arguments);
                    return result.call(this, func.apply(_, args));
                };
            });
        };
        var idCounter = 0;
        _.uniqueId = function(prefix) {
            var id = ++idCounter + "";
            return prefix ? prefix + id : id;
        };
        _.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var noMatch = /(.)^/;
        var escapes = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "	": "t",
            "\u2028": "u2028",
            "\u2029": "u2029"
        };
        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        _.template = function(text, data, settings) {
            var render;
            settings = _.defaults({}, settings, _.templateSettings);
            var matcher = new RegExp([ (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source ].join("|") + "|$", "g");
            var index = 0;
            var source = "__p+='";
            text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                source += text.slice(index, offset).replace(escaper, function(match) {
                    return "\\" + escapes[match];
                });
                if (escape) {
                    source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
                }
                if (interpolate) {
                    source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                }
                if (evaluate) {
                    source += "';\n" + evaluate + "\n__p+='";
                }
                index = offset + match.length;
                return match;
            });
            source += "';\n";
            if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";
            source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
            try {
                render = new Function(settings.variable || "obj", "_", source);
            } catch (e) {
                e.source = source;
                throw e;
            }
            if (data) return render(data, _);
            var template = function(data) {
                return render.call(this, data, _);
            };
            template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}";
            return template;
        };
        _.chain = function(obj) {
            return _(obj).chain();
        };
        var result = function(obj) {
            return this._chain ? _(obj).chain() : obj;
        };
        _.mixin(_);
        each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(name) {
            var method = ArrayProto[name];
            _.prototype[name] = function() {
                var obj = this._wrapped;
                method.apply(obj, arguments);
                if ((name == "shift" || name == "splice") && obj.length === 0) delete obj[0];
                return result.call(this, obj);
            };
        });
        each([ "concat", "join", "slice" ], function(name) {
            var method = ArrayProto[name];
            _.prototype[name] = function() {
                return result.call(this, method.apply(this._wrapped, arguments));
            };
        });
        _.extend(_.prototype, {
            chain: function() {
                this._chain = true;
                return this;
            },
            value: function() {
                return this._wrapped;
            }
        });
    }).call(this);
    var ktUi = angular.module("kt.ui", [ "kt.ui.itemSelector", "kt.ui.table", "kt.ui.table.pagination", "kt.ui.grid", "kt.ui.tab", "kt.ui.progressbar", "kt.ui.service", "kt.ui.tree", "kt.ui.chart", "kt.ui.miniChart", "kt.ui.map", "kt.ui.navigation", "kt.ui.dialog", "kt.ui.buttons", "kt.ui.modal", "kt.ui.date", "kt.ui.markupPreview", "kt.ui.textEditor", "kt.ui.calendar", "kt.ui.select", "kt.ui.accordion", "kt.ui.tooltip", "kt.ui.filter", "kt.ui.popover", "kt.translate" ]);
    angular.module("kt.translate", [ "ng" ]).run([ "$translate", function($translate) {
        var key = $translate.storageKey(), storage = $translate.storage();
        var fallbackFromIncorrectStorageValue = function() {
            var preferred = $translate.preferredLanguage();
            if (angular.isString(preferred)) {
                $translate.use(preferred);
            } else {
                storage.put(key, $translate.use());
            }
        };
        if (storage) {
            if (!storage.get(key)) {
                fallbackFromIncorrectStorageValue();
            } else {
                $translate.use(storage.get(key))["catch"](fallbackFromIncorrectStorageValue);
            }
        } else if (angular.isString($translate.preferredLanguage())) {
            $translate.use($translate.preferredLanguage());
        }
    } ]);
    var ktFilter = angular.module("kt.ui.filter", [ "kt.ui.filter.startFrom" ]);
    var ktFilter = angular.module("kt.ui.service", [ "kt.ui.service.transition" ]);
    angular.module("kt.ui.service.transition", []).factory("$transition", [ "$q", "$timeout", "$rootScope", function($q, $timeout, $rootScope) {
        var $transition = function(element, trigger, options) {
            options = options || {};
            var deferred = $q.defer();
            var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];
            var transitionEndHandler = function(event) {
                $rootScope.$apply(function() {
                    element.unbind(endEventName, transitionEndHandler);
                    deferred.resolve(element);
                });
            };
            if (endEventName) {
                element.bind(endEventName, transitionEndHandler);
            }
            $timeout(function() {
                if (angular.isString(trigger)) {
                    element.addClass(trigger);
                } else if (angular.isFunction(trigger)) {
                    trigger(element);
                } else if (angular.isObject(trigger)) {
                    element.css(trigger);
                }
                if (!endEventName) {
                    deferred.resolve(element);
                }
            });
            deferred.promise.cancel = function() {
                if (endEventName) {
                    element.unbind(endEventName, transitionEndHandler);
                }
                deferred.reject("Transition cancelled");
            };
            return deferred.promise;
        };
        var transElement = document.createElement("trans");
        var transitionEndEventNames = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd",
            transition: "transitionend"
        };
        var animationEndEventNames = {
            WebkitTransition: "webkitAnimationEnd",
            MozTransition: "animationend",
            OTransition: "oAnimationEnd",
            transition: "animationend"
        };
        function findEndEventName(endEventNames) {
            for (var name in endEventNames) {
                if (transElement.style[name] !== undefined) {
                    return endEventNames[name];
                }
            }
        }
        $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
        $transition.animationEndEventName = findEndEventName(animationEndEventNames);
        return $transition;
    } ]);
    angular.module("kt.translate").factory("$translateDefaultInterpolation", [ "$interpolate", function($interpolate) {
        var $translateInterpolator = {}, $locale, $identifier = "default";
        $translateInterpolator.setLocale = function(locale) {
            $locale = locale;
        };
        $translateInterpolator.getInterpolationIdentifier = function() {
            return $identifier;
        };
        $translateInterpolator.interpolate = function(string, interpolateParams) {
            return $interpolate(string)(interpolateParams);
        };
        return $translateInterpolator;
    } ]);
    angular.module("kt.translate").factory("$translateMissingTranslationHandlerLog", [ "$log", function($log) {
        return function(translationId) {
            $log.warn("Translation for " + translationId + " doesn't exist");
        };
    } ]);
    angular.module("kt.translate").provider("$translatePartialLoader", [ function() {
        function Part(name) {
            this.name = name;
            this.isActive = true;
            this.tables = {};
        }
        Part.prototype.parseUrl = function(urlTemplate, targetLang) {
            return urlTemplate.replace("{part}", this.name).replace("{lang}", targetLang);
        };
        Part.prototype.getTable = function(lang, $q, $http, urlTemplate, errorHandler) {
            var deferred = $q.defer();
            if (!this.tables.hasOwnProperty(lang)) {
                var self = this;
                $http({
                    method: "GET",
                    url: this.parseUrl(urlTemplate, lang)
                }).success(function(data) {
                    self.tables[lang] = data;
                    deferred.resolve(data);
                }).error(function() {
                    if (errorHandler !== undefined) {
                        errorHandler(self.name, lang).then(function(data) {
                            self.tables[lang] = data;
                            deferred.resolve(data);
                        }, function() {
                            deferred.reject(self.name);
                        });
                    } else deferred.reject(self.name);
                });
            } else deferred.resolve(this.tables[lang]);
            return deferred.promise;
        };
        var parts = {};
        function hasPart(name) {
            return parts.hasOwnProperty(name);
        }
        function isStringValid(str) {
            return angular.isString(str) && str !== "";
        }
        function isPartAvailable(name) {
            if (!isStringValid(name)) {
                throw new TypeError("Invalid type of a first argument, a non-empty string expected.");
            }
            return hasPart(name) && parts[name].isActive;
        }
        function deepExtend(dst, src) {
            for (var property in src) {
                if (src[property] && src[property].constructor && src[property].constructor === Object) {
                    dst[property] = dst[property] || {};
                    arguments.callee(dst[property], src[property]);
                } else {
                    dst[property] = src[property];
                }
            }
            return dst;
        }
        this.addPart = function(name) {
            if (!isStringValid(name)) {
                throw new TypeError("Invalid type of a first argument, a non-empty string expected.");
            }
            if (!hasPart(name)) {
                parts[name] = new Part(name);
            }
            return this;
        };
        this.deletePart = function(name) {
            if (!isStringValid(name)) {
                throw new TypeError("Invalid type of a first argument, a non-empty string expected.");
            }
            delete parts[name];
            return this;
        };
        this.isPartAvailable = isPartAvailable;
        this.$get = [ "$rootScope", "$injector", "$q", "$http", function($rootScope, $injector, $q, $http) {
            var service = function(options) {
                if (!isStringValid(options.key)) {
                    throw new TypeError("Unable to load data, a key is not a non-empty string.");
                }
                if (!isStringValid(options.urlTemplate)) {
                    throw new TypeError("Unable to load data, a urlTemplate is not a non-empty string.");
                }
                var errorHandler = options.loadFailureHandler;
                if (errorHandler !== undefined) {
                    if (!angular.isString(errorHandler)) {
                        throw new Error("Unable to load data, a loadFailureHandler is not a string.");
                    } else errorHandler = $injector.get(errorHandler);
                }
                var loaders = [], tables = [], deferred = $q.defer();
                function addTablePart(table) {
                    tables.push(table);
                }
                for (var part in parts) {
                    if (hasPart(part) && parts[part].isActive) {
                        loaders.push(parts[part].getTable(options.key, $q, $http, options.urlTemplate, errorHandler).then(addTablePart));
                    }
                }
                if (loaders.length) {
                    $q.all(loaders).then(function() {
                        var table = {};
                        for (var i = 0; i < tables.length; i++) {
                            deepExtend(table, tables[i]);
                        }
                        deferred.resolve(table);
                    }, function() {
                        deferred.reject(options.key);
                    });
                } else {
                    deferred.resolve({});
                }
                return deferred.promise;
            };
            service.addPart = function(name) {
                if (!isStringValid(name)) {
                    throw new TypeError("Invalid type of a first argument, a non-empty string expected.");
                }
                if (!hasPart(name)) {
                    parts[name] = new Part(name);
                    $rootScope.$broadcast("$translatePartialLoaderStructureChanged", name);
                } else if (!parts[name].isActive) {
                    parts[name].isActive = true;
                    $rootScope.$broadcast("$translatePartialLoaderStructureChanged", name);
                }
                return service;
            };
            service.deletePart = function(name, removeData) {
                if (!isStringValid(name)) {
                    throw new TypeError("Invalid type of a first argument, a non-empty string expected.");
                }
                if (removeData === undefined) {
                    removeData = false;
                } else if (typeof removeData !== "boolean") {
                    throw new TypeError("Invalid type of a second argument, a boolean expected.");
                }
                if (hasPart(name)) {
                    var wasActive = parts[name].isActive;
                    if (removeData) {
                        delete parts[name];
                    } else {
                        parts[name].isActive = false;
                    }
                    if (wasActive) {
                        $rootScope.$broadcast("$translatePartialLoaderStructureChanged", name);
                    }
                }
                return service;
            };
            service.isPartAvailable = isPartAvailable;
            return service;
        } ];
    } ]);
    angular.module("kt.translate").factory("$translateStaticFilesLoader", [ "$q", "$http", function($q, $http) {
        return function(options) {
            if (!options || (!options.prefix || !options.suffix)) {
                throw new Error("Couldn't load static files, no prefix or suffix specified!");
            }
            var deferred = $q.defer();
            $http({
                url: [ options.prefix, options.key, options.suffix ].join(""),
                method: "GET",
                params: ""
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(options.key);
            });
            return deferred.promise;
        };
    } ]);
    angular.module("kt.translate").factory("$translateUrlLoader", [ "$q", "$http", function($q, $http) {
        return function(options) {
            if (!options || !options.url) {
                throw new Error("Couldn't use urlLoader since no url is given!");
            }
            var deferred = $q.defer();
            $http({
                url: options.url,
                params: {
                    lang: options.key
                },
                method: "GET"
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(options.key);
            });
            return deferred.promise;
        };
    } ]);
    angular.module("kt.translate").constant("TRANSLATE_MF_INTERPOLATION_CACHE", "$translateMessageFormatInterpolation").factory("$translateMessageFormatInterpolation", function($cacheFactory, TRANSLATE_MF_INTERPOLATION_CACHE) {
        var $translateInterpolator = {}, $cache = $cacheFactory.get(TRANSLATE_MF_INTERPOLATION_CACHE), $mf = new MessageFormat(), $identifier = "messageformat";
        if (!$cache) {
            $cache = $cacheFactory(TRANSLATE_MF_INTERPOLATION_CACHE);
        }
        $cache.put("en", $mf);
        $translateInterpolator.setLocale = function(locale) {
            $mf = $cache.get(locale);
            if (!$mf) {
                $mf = new MessageFormat(locale);
                $cache.put(locale, $mf);
            }
        };
        $translateInterpolator.getInterpolationIdentifier = function() {
            return $identifier;
        };
        $translateInterpolator.interpolate = function(string, interpolateParams) {
            interpolateParams = interpolateParams || {};
            var interpolatedText = $cache.get(string + angular.toJson(interpolateParams));
            if (!interpolatedText) {
                interpolatedText = $mf.compile(string)(interpolateParams);
                $cache.put(string + angular.toJson(interpolateParams), interpolatedText);
            }
            return interpolatedText;
        };
        return $translateInterpolator;
    });
    angular.module("kt.translate").factory("$translateCookieStorage", [ "$cookieStore", function($cookieStore) {
        var $translateCookieStorage = {
            get: function(name) {
                return $cookieStore.get(name);
            },
            set: function(name, value) {
                $cookieStore.put(name, value);
            }
        };
        return $translateCookieStorage;
    } ]);
    angular.module("kt.translate").constant("$STORAGE_KEY", "NG_TRANSLATE_LANG_KEY");
    angular.module("kt.translate").factory("$translateLocalStorage", [ "$window", "$translateCookieStorage", function($window, $translateCookieStorage) {
        var localStorageAdapter = {
            get: function(name) {
                return $window.localStorage.getItem(name);
            },
            set: function(name, value) {
                $window.localStorage.setItem(name, value);
            }
        };
        var $translateLocalStorage = "localStorage" in $window && $window.localStorage !== null ? localStorageAdapter : $translateCookieStorage;
        return $translateLocalStorage;
    } ]);
    angular.module("kt.translate").provider("$translate", [ "$STORAGE_KEY", function($STORAGE_KEY) {
        var $translationTable = {}, $preferredLanguage, $fallbackLanguage, $uses, $nextLang, $storageFactory, $storageKey = $STORAGE_KEY, $storagePrefix, $missingTranslationHandlerFactory, $interpolationFactory, $interpolatorFactories = [], $loaderFactory, $loaderOptions, $notFoundIndicatorLeft, $notFoundIndicatorRight, NESTED_OBJECT_DELIMITER = ".";
        var translations = function(langKey, translationTable) {
            if (!langKey && !translationTable) {
                return $translationTable;
            }
            if (langKey && !translationTable) {
                if (angular.isString(langKey)) {
                    return $translationTable[langKey];
                } else {
                    angular.extend($translationTable, flatObject(langKey));
                }
            } else {
                if (!angular.isObject($translationTable[langKey])) {
                    $translationTable[langKey] = {};
                }
                angular.extend($translationTable[langKey], flatObject(translationTable));
            }
            return this;
        };
        var flatObject = function(data, path, result) {
            var key, keyWithPath, val;
            if (!path) {
                path = [];
            }
            if (!result) {
                result = {};
            }
            for (key in data) {
                if (!data.hasOwnProperty(key)) continue;
                val = data[key];
                if (angular.isObject(val)) {
                    flatObject(val, path.concat(key), result);
                } else {
                    keyWithPath = path.length ? "" + path.join(NESTED_OBJECT_DELIMITER) + NESTED_OBJECT_DELIMITER + key : key;
                    result[keyWithPath] = val;
                }
            }
            return result;
        };
        this.translations = translations;
        this.addInterpolation = function(factory) {
            $interpolatorFactories.push(factory);
            return this;
        };
        this.useMessageFormatInterpolation = function() {
            return this.useInterpolation("$translateMessageFormatInterpolation");
        };
        this.useInterpolation = function(factory) {
            $interpolationFactory = factory;
            return this;
        };
        this.preferredLanguage = function(langKey) {
            if (langKey) {
                $preferredLanguage = langKey;
                return this;
            } else {
                return $preferredLanguage;
            }
        };
        this.translationNotFoundIndicator = function(indicator) {
            this.translationNotFoundIndicatorLeft(indicator);
            this.translationNotFoundIndicatorRight(indicator);
            return this;
        };
        this.translationNotFoundIndicatorLeft = function(indicator) {
            if (!indicator) {
                return $notFoundIndicatorLeft;
            }
            $notFoundIndicatorLeft = indicator;
            return this;
        };
        this.translationNotFoundIndicatorRight = function(indicator) {
            if (!indicator) {
                return $notFoundIndicatorRight;
            }
            $notFoundIndicatorRight = indicator;
            return this;
        };
        this.fallbackLanguage = function(langKey) {
            if (langKey) {
                $fallbackLanguage = langKey;
                return this;
            } else {
                return $fallbackLanguage;
            }
        };
        this.uses = function(langKey) {
            if (langKey) {
                if (!$translationTable[langKey] && !$loaderFactory) {
                    throw new Error("$translateProvider couldn't find translationTable for langKey: '" + langKey + "'");
                }
                $uses = langKey;
                return this;
            } else {
                return $uses;
            }
        };
        var storageKey = function(key) {
            if (!key) {
                if ($storagePrefix) {
                    return $storagePrefix + $storageKey;
                }
                return $storageKey;
            }
            $storageKey = key;
        };
        this.storageKey = storageKey;
        this.useUrlLoader = function(url) {
            return this.useLoader("$translateUrlLoader", {
                url: url
            });
        };
        this.useStaticFilesLoader = function(options) {
            return this.useLoader("$translateStaticFilesLoader", options);
        };
        this.useLoader = function(loaderFactory, options) {
            $loaderFactory = loaderFactory;
            $loaderOptions = options || {};
            return this;
        };
        this.useLocalStorage = function() {
            return this.useStorage("$translateLocalStorage");
        };
        this.useCookieStorage = function() {
            return this.useStorage("$translateCookieStorage");
        };
        this.useStorage = function(storageFactory) {
            $storageFactory = storageFactory;
            return this;
        };
        this.storagePrefix = function(prefix) {
            if (!prefix) {
                return prefix;
            }
            $storagePrefix = prefix;
            return this;
        };
        this.useMissingTranslationHandlerLog = function() {
            return this.useMissingTranslationHandler("$translateMissingTranslationHandlerLog");
        };
        this.useMissingTranslationHandler = function(factory) {
            $missingTranslationHandlerFactory = factory;
            return this;
        };
        this.$get = [ "$log", "$injector", "$rootScope", "$q", function($log, $injector, $rootScope, $q) {
            var Storage, defaultInterpolator = $injector.get($interpolationFactory || "$translateDefaultInterpolation"), pendingLoader = false, interpolatorHashMap = {};
            var loadAsync = function(key) {
                if (!key) {
                    throw "No language key specified for loading.";
                }
                var deferred = $q.defer();
                $rootScope.$broadcast("$translateLoadingStart");
                pendingLoader = true;
                $nextLang = key;
                $injector.get($loaderFactory)(angular.extend($loaderOptions, {
                    key: key
                })).then(function(data) {
                    $rootScope.$broadcast("$translateLoadingSuccess");
                    var translationTable = {};
                    if (angular.isArray(data)) {
                        angular.forEach(data, function(table) {
                            angular.extend(translationTable, table);
                        });
                    } else {
                        angular.extend(translationTable, data);
                    }
                    translations(key, translationTable);
                    pendingLoader = false;
                    $nextLang = undefined;
                    deferred.resolve(key);
                    $rootScope.$broadcast("$translateLoadingEnd");
                }, function(key) {
                    $rootScope.$broadcast("$translateLoadingError");
                    deferred.reject(key);
                    $nextLang = undefined;
                    $rootScope.$broadcast("$translateLoadingEnd");
                });
                return deferred.promise;
            };
            if ($storageFactory) {
                Storage = $injector.get($storageFactory);
                if (!Storage.get || !Storage.set) {
                    throw new Error("Couldn't use storage '" + $storageFactory + "', missing get() or set() method!");
                }
            }
            if ($interpolatorFactories.length > 0) {
                angular.forEach($interpolatorFactories, function(interpolatorFactory) {
                    var interpolator = $injector.get(interpolatorFactory);
                    interpolator.setLocale($preferredLanguage || $uses);
                    interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
                });
            }
            var $translate = function(translationId, interpolateParams, interpolationId) {
                var table = $uses ? $translationTable[$uses] : $translationTable, Interpolator = interpolationId ? interpolatorHashMap[interpolationId] : defaultInterpolator;
                if (table && table.hasOwnProperty(translationId)) {
                    return Interpolator.interpolate(table[translationId], interpolateParams);
                }
                if ($missingTranslationHandlerFactory && !pendingLoader) {
                    $injector.get($missingTranslationHandlerFactory)(translationId, $uses);
                }
                if ($uses && $fallbackLanguage && $uses !== $fallbackLanguage) {
                    var translation = $translationTable[$fallbackLanguage][translationId];
                    if (translation) {
                        var returnVal;
                        Interpolator.setLocale($fallbackLanguage);
                        returnVal = Interpolator.interpolate(translation, interpolateParams);
                        Interpolator.setLocale($uses);
                        return returnVal;
                    }
                }
                if ($notFoundIndicatorLeft) {
                    translationId = [ $notFoundIndicatorLeft, translationId ].join(" ");
                }
                if ($notFoundIndicatorRight) {
                    translationId = [ translationId, $notFoundIndicatorRight ].join(" ");
                }
                return translationId;
            };
            $translate.preferredLanguage = function() {
                return $preferredLanguage;
            };
            $translate.fallbackLanguage = function() {
                return $fallbackLanguage;
            };
            $translate.proposedLanguage = function() {
                return $nextLang;
            };
            $translate.storage = function() {
                return Storage;
            };
            $translate.uses = function(key) {
                if (!key) {
                    return $uses;
                }
                var deferred = $q.defer();
                $rootScope.$broadcast("$translateChangeStart");
                function useLanguage(key) {
                    $uses = key;
                    $rootScope.$broadcast("$translateChangeSuccess");
                    if ($storageFactory) {
                        Storage.set($translate.storageKey(), $uses);
                    }
                    defaultInterpolator.setLocale($uses);
                    angular.forEach(interpolatorHashMap, function(interpolator, id) {
                        interpolatorHashMap[id].setLocale($uses);
                    });
                    deferred.resolve(key);
                    $rootScope.$broadcast("$translateChangeEnd");
                }
                if (!$translationTable[key] && $loaderFactory) {
                    loadAsync(key).then(useLanguage, function(key) {
                        $rootScope.$broadcast("$translateChangeError");
                        deferred.reject(key);
                        $rootScope.$broadcast("$translateChangeEnd");
                    });
                } else {
                    useLanguage(key);
                }
                return deferred.promise;
            };
            $translate.storageKey = function() {
                return storageKey();
            };
            $translate.refresh = function(langKey) {
                var deferred = $q.defer();
                function onLoadSuccess() {
                    deferred.resolve();
                    $rootScope.$broadcast("$translateRefreshEnd");
                }
                function onLoadFailure() {
                    deferred.reject();
                    $rootScope.$broadcast("$translateRefreshEnd");
                }
                if (!$loaderFactory) {
                    throw new Error("Couldn't refresh translation table, no loader registered!");
                }
                if (!langKey) {
                    $rootScope.$broadcast("$translateRefreshStart");
                    for (var lang in $translationTable) {
                        if ($translationTable.hasOwnProperty(lang)) {
                            delete $translationTable[lang];
                        }
                    }
                    var loaders = [];
                    if ($fallbackLanguage) {
                        loaders.push(loadAsync($fallbackLanguage));
                    }
                    if ($uses) {
                        loaders.push($translate.uses($uses));
                    }
                    if (loaders.length > 0) {
                        $q.all(loaders).then(onLoadSuccess, onLoadFailure);
                    } else onLoadSuccess();
                } else if ($translationTable.hasOwnProperty(langKey)) {
                    $rootScope.$broadcast("$translateRefreshStart");
                    delete $translationTable[langKey];
                    var loader = null;
                    if (langKey === $uses) {
                        loader = $translate.uses($uses);
                    } else {
                        loader = loadAsync(langKey);
                    }
                    loader.then(onLoadSuccess, onLoadFailure);
                } else deferred.reject();
                return deferred.promise;
            };
            if ($loaderFactory) {
                if (angular.equals($translationTable, {})) {
                    $translate.uses($translate.uses());
                }
                if ($fallbackLanguage && !$translationTable[$fallbackLanguage]) {
                    loadAsync($fallbackLanguage);
                }
            }
            return $translate;
        } ];
    } ]);
    angular.module("kt.ui.filter.startFrom", []).filter("startFrom", function() {
        return function(input, start) {
            start = +start;
            return input.slice(start);
        };
    });
    angular.module("kt.translate").filter("translate", [ "$parse", "$translate", function($parse, $translate) {
        return function(translationId, interpolateParams, interpolation) {
            if (!angular.isObject(interpolateParams)) {
                interpolateParams = $parse(interpolateParams)();
            }
            return $translate(translationId, interpolateParams, interpolation);
        };
    } ]);
    angular.module("kt.ui.accordion", []).constant("accordionConfig", {
        closeOthers: true
    }).controller("AccordionController", [ "$scope", "$attrs", "accordionConfig", function($scope, $attrs, accordionConfig) {
        this.groups = [];
        this.closeOthers = function(openGroup) {
            var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
            if (closeOthers) {
                angular.forEach(this.groups, function(group) {
                    if (group !== openGroup) {
                        group.isOpen = false;
                    }
                });
            }
        };
        this.addGroup = function(groupScope) {
            var that = this;
            this.groups.push(groupScope);
            groupScope.$on("$destroy", function(event) {
                that.removeGroup(groupScope);
            });
        };
        this.removeGroup = function(group) {
            var index = this.groups.indexOf(group);
            if (index !== -1) {
                this.groups.splice(index, 1);
            }
        };
    } ]).directive("accordion", function() {
        return {
            restrict: "EA",
            controller: "AccordionController",
            transclude: true,
            replace: false,
            template: '<div class="panel-group" ng-transclude></div>'
        };
    }).directive("accordionGroup", function() {
        return {
            require: "^accordion",
            restrict: "EA",
            transclude: true,
            replace: true,
            template: '<div class="panel panel-default"> \r\n      <div class="panel-heading" ><a class="accordion-toggle" ng-click="isOpen = !isOpen" accordion-transclude="heading">{{heading}}</a></div> \r\n      <div class="panel-collapse" collapse="!isOpen"> \r\n        <div class="panel-body" ng-transclude></div>  </div> \r\n    </div>',
            scope: {
                heading: "@",
                isOpen: "=?",
                isDisabled: "=?"
            },
            controller: function() {
                this.setHeading = function(element) {
                    this.heading = element;
                };
            },
            link: function(scope, element, attrs, accordionCtrl) {
                accordionCtrl.addGroup(scope);
                scope.$watch("isOpen", function(value) {
                    if (value) {
                        accordionCtrl.closeOthers(scope);
                        element.addClass("opened");
                    } else {
                        element.removeClass("opened");
                    }
                });
                scope.toggleOpen = function() {
                    if (!scope.isDisabled) {
                        scope.isOpen = !scope.isOpen;
                    }
                };
            }
        };
    }).directive("accordionHeading", function() {
        return {
            restrict: "EA",
            transclude: true,
            template: "",
            replace: true,
            require: "^accordionGroup",
            link: function(scope, element, attr, accordionGroupCtrl, transclude) {
                accordionGroupCtrl.setHeading(transclude(scope, function() {}));
            }
        };
    }).directive("accordionTransclude", function() {
        return {
            require: "^accordionGroup",
            link: function(scope, element, attr, controller) {
                scope.$watch(function() {
                    return controller[attr.accordionTransclude];
                }, function(heading) {
                    if (heading) {
                        element.html("");
                        element.append(heading);
                    }
                });
            }
        };
    }).directive("collapse", [ "$transition", function($transition) {
        return {
            link: function(scope, element, attrs) {
                var initialAnimSkip = true;
                var currentTransition;
                function doTransition(change) {
                    var newTransition = $transition(element, change);
                    if (currentTransition) {
                        currentTransition.cancel();
                    }
                    currentTransition = newTransition;
                    newTransition.then(newTransitionDone, newTransitionDone);
                    return newTransition;
                    function newTransitionDone() {
                        if (currentTransition === newTransition) {
                            currentTransition = undefined;
                        }
                    }
                }
                function expand() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        expandDone();
                    } else {
                        element.removeClass("collapse").addClass("collapsing");
                        doTransition({
                            height: element[0].scrollHeight + "px"
                        }).then(expandDone);
                    }
                }
                function expandDone() {
                    element.removeClass("collapsing");
                    element.addClass("collapse in");
                    element.css({
                        height: "auto"
                    });
                }
                function collapse() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        collapseDone();
                        element.css({
                            height: 0
                        });
                    } else {
                        element.css({
                            height: element[0].scrollHeight + "px"
                        });
                        var x = element[0].offsetWidth;
                        element.removeClass("collapse in").addClass("collapsing");
                        doTransition({
                            height: 0
                        }).then(collapseDone);
                    }
                }
                function collapseDone() {
                    element.removeClass("collapsing");
                    element.addClass("collapse");
                }
                scope.$watch(attrs.collapse, function(shouldCollapse) {
                    if (shouldCollapse) {
                        collapse();
                    } else {
                        expand();
                    }
                });
            }
        };
    } ]);
    angular.module("kt.ui.buttons", []).constant("buttonConfig", {
        activeClass: "active",
        toggleEvent: "click"
    }).directive("ktBtnRadio", [ "buttonConfig", function(buttonConfig) {
        var activeClass = buttonConfig.activeClass || "active";
        var toggleEvent = buttonConfig.toggleEvent || "click";
        return {
            require: "ngModel",
            link: function(scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$render = function() {
                    element.toggleClass(activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.ktBtnRadio)));
                };
                element.bind(toggleEvent, function() {
                    if (!element.hasClass(activeClass)) {
                        scope.$apply(function() {
                            ngModelCtrl.$setViewValue(scope.$eval(attrs.ktBtnRadio));
                            ngModelCtrl.$render();
                        });
                    }
                });
            }
        };
    } ]).directive("ktBtnCheckbox", [ "buttonConfig", function(buttonConfig) {
        var activeClass = buttonConfig.activeClass || "active";
        var toggleEvent = buttonConfig.toggleEvent || "click";
        return {
            require: "ngModel",
            link: function(scope, element, attrs, ngModelCtrl) {
                var trueValue = scope.$eval(attrs.ktBtnCheckboxTrue);
                var falseValue = scope.$eval(attrs.ktBtnCheckboxFalse);
                trueValue = angular.isDefined(trueValue) ? trueValue : true;
                falseValue = angular.isDefined(falseValue) ? falseValue : false;
                ngModelCtrl.$render = function() {
                    element.toggleClass(activeClass, angular.equals(ngModelCtrl.$modelValue, trueValue));
                };
                element.bind(toggleEvent, function() {
                    scope.$apply(function() {
                        ngModelCtrl.$setViewValue(element.hasClass(activeClass) ? falseValue : trueValue);
                        ngModelCtrl.$render();
                    });
                });
            }
        };
    } ]);
    angular.module("kt.ui.calendar", []).constant("uiCalendarConfig", {}).directive("ktCalendar", [ "uiCalendarConfig", "$timeout", function(uiCalendarConfig, $timeout) {
        "use strict";
        return {
            scope: {
                data: "="
            },
            link: function($scope, iElm, iAttrs, controller) {
                var opts = angular.extend({}, $scope.$parent.$eval(iAttrs.options));
                $timeout(function() {
                    var calendar = $(iElm).fullCalendar({
                        theme: opts.theme,
                        header: opts.header,
                        selectable: opts.selectable || false,
                        selectHelper: opts.selectHelper || false,
                        select: opts.select ? function(start, end, allDay) {
                            opts.select.apply(opts, [ start, end, allDay ]);
                            $scope.$parent.$apply();
                        } : null,
                        unselect: opts.unselect ? function(start, end, allDay) {
                            opts.unselect.apply(opts, [ start, end, allDay ]);
                            $scope.$parent.$apply();
                        } : null,
                        eventClick: opts.eventClick ? function(event) {
                            opts.eventClick.apply(opts, [ event ]);
                            $scope.$parent.$apply();
                        } : null,
                        eventMouseout: opts.eventMouseout ? function(event) {
                            opts.eventMouseout.apply(opts, [ event ]);
                            $scope.$parent.$apply();
                        } : null,
                        eventMouseover: opts.eventMouseover ? function(event) {
                            opts.eventMouseover.apply(opts, [ event ]);
                            $scope.$parent.$apply();
                        } : null,
                        dayClick: opts.dayClick ? function(event) {
                            opts.dayClick.apply(opts, [ event ]);
                            $scope.$parent.$apply();
                        } : null,
                        eventDataTransform: function(eventData) {
                            if (!!!eventData.$$hashKey) {
                                $scope.data.push(eventData);
                            }
                            return eventData;
                        },
                        defaultView: opts.defaultView,
                        editable: opts.editable || true,
                        droppable: opts.droppable || true,
                        eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
                            if (opts.eventDrop) {
                                opts.eventDrop.apply(opts, [ event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ]);
                            }
                            $scope.$parent.$apply();
                        }
                    });
                    $scope.$parent[iAttrs.ktCalendar] = calendar;
                });
                $scope.$watch("data", function(newData, oldData) {});
            }
        };
    } ]);
    angular.module("kt.ui.chart", []).directive("ktChart", [ function() {
        return {
            scope: {
                data: "=",
                xplotband: "=",
                yplotband: "=",
                xplotline: "=",
                yplotline: "="
            },
            controller: function($scope) {
                $scope.mainTitle = {};
                $scope.subTitle = {};
                $scope.tooltip = {};
                $scope.legend = {};
                $scope.datalabel = {};
                $scope.xaxis = [];
                $scope.yaxis = [];
                this.setMainTitle = function(newMainTitleOpt) {
                    $scope.mainTitle = newMainTitleOpt;
                };
                this.setSubTitle = function(newSubTitleOpt) {
                    $scope.subTitle = newSubTitleOpt;
                };
                this.setTooltip = function(newTooltip) {
                    $scope.tooltip = newTooltip;
                };
                this.setLegend = function(newLegendOpt) {
                    $scope.legend = newLegendOpt;
                };
                this.pushXAxis = function(newXAxisOpt) {
                    $scope.xaxis.push(newXAxisOpt);
                };
                this.pushYAxis = function(newYXisOpt) {
                    $scope.yaxis.push(newYXisOpt);
                };
                this.setDatalabel = function(newDatalabelOpt) {
                    $scope.datalabel = newDatalabelOpt;
                };
                this.setGaugeOpt = function(newGagueOpt) {
                    $scope.gaguePane = newGagueOpt;
                };
            },
            restrict: "ACM",
            link: function($scope, iElm, iAttrs, controller) {
                var options = angular.extend({}, {
                    type: iAttrs.type,
                    chartName: iAttrs.ktChart,
                    margintop: iAttrs.margintop === undefined ? null : Number(iAttrs.margintop),
                    marginbottom: iAttrs.marginbottom === undefined ? null : Number(iAttrs.marginbottom),
                    marginleft: iAttrs.marginleft === undefined ? null : Number(iAttrs.marginleft),
                    marginright: iAttrs.marginright === undefined ? null : Number(iAttrs.marginright),
                    backgroundColor: iAttrs.backgroundcolor,
                    spacingBottom: iAttrs.spacingBottom === undefined ? 0 : Number(iAttrs.spacingBottom),
                    plotBorderWidth: iAttrs.plotBorderWidth === undefined ? null : Number(iAttrs.plotBorderWidth),
                    plotBackgroundColor: iAttrs.plotBackgroundColor,
                    plotBorderColor: iAttrs.plotBorderColor,
                    plotShadow: iAttrs.plotShadow,
                    withlabel: iAttrs.withlabel,
                    click: iAttrs.click,
                    load: iAttrs.load,
                    selection: iAttrs.selection,
                    redraw: iAttrs.redraw,
                    plotOptions: iAttrs.plotOptions ? $scope.$parent.$eval(iAttrs.plotOptions) : {},
                    height: $scope.$parent.$eval(iAttrs.height) || null,
                    width: $scope.$parent.$eval(iAttrs.width) || null
                });
                initValue();
                showChart();
                function initValue() {
                    if (options.chartName === null || options.chartName === "") {
                        options.chartName = "chart";
                    }
                    $scope.legend.enabled = "";
                    if ($scope.datalabel.withlabel === undefined) {
                        $scope.datalabel.withlabel = "";
                    }
                }
                function clickItem(chartItem) {
                    if (options.click) {
                        controllerName = options.click.replace(/\(.*\)/, "");
                        controllerFunc = $scope.$parent[controllerName];
                        if (controllerFunc) {
                            controllerFunc.apply($scope.$parent, [ chartItem, $scope.$parent[options.chartName] ]);
                            $scope.$apply();
                        }
                    }
                }
                function redraw(event) {
                    if (options.redraw) {
                        controllerName = options.redraw.replace(/\(.*\)/, "");
                        controllerFunc = $scope.$parent[controllerName];
                        if (controllerFunc) {
                            controllerFunc.apply($scope.$parent, [ event ]);
                        }
                    }
                }
                function load(event) {
                    if (options.load) {
                        controllerName = options.load.replace(/\(.*\)/, "");
                        controllerFunc = $scope.$parent[controllerName];
                        if (controllerFunc) {
                            controllerFunc.apply($scope.$parent, [ event ]);
                        }
                    }
                }
                function selection(event) {
                    if (options.selection) {
                        controllerName = options.selection.replace(/\(.*\)/, "");
                        controllerFunc = $scope.$parent[controllerName];
                        if (controllerFunc) {
                            controllerFunc.apply($scope.$parent, [ event ]);
                            $scope.$apply();
                        }
                    }
                }
                $scope.$parent.addXGuage = function(object) {
                    $scope.$parent[options.chartName].xAxis[0].addPlotBand(object);
                };
                $scope.$parent.removeXGuage = function(id) {
                    $scope.$parent[options.chartName].xAxis[0].removePlotBand(id);
                };
                $scope.$parent.addYGuage = function(object) {
                    $scope.$parent[options.chartName].yAxis[0].addPlotBand(object);
                };
                $scope.$parent.removeYGuage = function(id) {
                    $scope.$parent[options.chartName].yAxis[0].removePlotBand(id);
                };
                function showChart() {
                    var click = function() {
                        if (options.click !== null && options.click !== "") {
                            clickItem(this);
                        }
                    }, plotOptions = {
                        scatter: {
                            marker: {
                                radius: 5
                            },
                            tooltip: {
                                headerFormat: "<b>{series.name}</b><br>"
                            }
                        },
                        pie: {
                            showInLegend: $scope.legend.enabled.toUpperCase() == "FALSE" ? false : true,
                            cursor: "pointer",
                            dataLabels: {
                                enabled: $scope.datalabel.withlabel.toUpperCase() == "TRUE" ? true : false,
                                formatter: function() {
                                    return "<b>" + this.point.name + "</b>: " + this.percentage + " %";
                                }
                            }
                        },
                        series: {
                            dataLabels: {
                                enabled: $scope.datalabel.withlabel.toUpperCase() == "TRUE" ? true : false,
                                format: "{y:." + $scope.datalabel.point + "f}"
                            },
                            point: {
                                events: {
                                    click: click
                                }
                            }
                        }
                    }, yAxis = [], xAxis = [], legend = {
                        enabled: ($scope.legend.enabledFlag === undefined ? "false" : $scope.legend.enabledFlag).toUpperCase() === "FALSE" ? false : true,
                        layout: $scope.legend.layout,
                        align: $scope.legend.align,
                        verticalAlign: $scope.legend.verticalalign,
                        backgroundColor: $scope.legend.backgroundcolor !== undefined ? $scope.legend.backgroundcolor : "#FFFFFF",
                        borderColor: $scope.legend.bordercolor !== undefined ? $scope.legend.bordercolor : "#808080",
                        itemStyle: {
                            color: $scope.legend.itemcolor !== undefined ? $scope.legend.itemcolor : "#000000",
                            fontWeight: $scope.legend.itemfontweight
                        },
                        itemHoverStyle: {
                            color: $scope.legend.itemhovercolor
                        },
                        x: Number($scope.legend.x),
                        y: Number($scope.legend.y)
                    }, title = {
                        style: {
                            color: $scope.mainTitle.fontcolor,
                            fontWeight: $scope.mainTitle.fontweight,
                            fontSize: $scope.mainTitle.fontsize
                        },
                        align: $scope.mainTitle.align,
                        text: $scope.mainTitle.text,
                        verticalAlign: $scope.mainTitle.verticalAlign
                    }, chartOption = {};
                    if ($scope.mainTitle.y) title.y = Number($scope.mainTitle.y);
                    if ($scope.mainTitle.x) title.x = Number($scope.mainTitle.x);
                    if ($scope.xaxis.length === 0) {
                        xAxis.push({
                            title: {
                                text: $scope.xaxis.text
                            },
                            lineWidth: 0,
                            tickLength: 0,
                            categories: $scope.xaxis.category,
                            plotBands: $scope.yplotband,
                            plotLines: $scope.yplotline,
                            labels: {
                                enabled: false,
                                step: $scope.xaxis.step
                            }
                        });
                    } else {
                        angular.forEach($scope.xaxis, function(value, key) {
                            xAxis.push({
                                title: {
                                    text: value.text
                                },
                                categories: value.category,
                                plotBands: $scope.xplotband,
                                plotLines: $scope.xplotline,
                                labels: {
                                    step: value.step,
                                    formatter: value.formatter
                                },
                                opposite: value.opposite
                            });
                        });
                    }
                    if ($scope.yaxis.length === 0) {
                        yAxis.push({
                            title: {
                                text: $scope.yaxis.text
                            },
                            gridLineWidth: 0,
                            categories: $scope.yaxis.category,
                            plotBands: $scope.yplotband,
                            plotLines: $scope.yplotline,
                            labels: {
                                enabled: false,
                                step: $scope.yaxis.step
                            }
                        });
                    } else {
                        if ($scope.yaxis[0].options) {
                            angular.forEach($scope.yaxis, function(value, key) {
                                yAxis.push(value.options);
                            });
                        } else {
                            angular.forEach($scope.yaxis, function(value, key) {
                                yAxis.push({
                                    title: {
                                        text: value.text
                                    },
                                    categories: value.category,
                                    plotBands: $scope.yplotband,
                                    plotLines: $scope.yplotline,
                                    labels: {
                                        step: value.step,
                                        formatter: value.formatter
                                    },
                                    opposite: value.opposite
                                });
                            });
                        }
                    }
                    angular.extend(plotOptions, options.plotOptions);
                    chartOption = {
                        colors: [ "#e43133", "#ee9c9d", "#a7a7a7", "#d5d5d5", "#990002", "#91494b", "#5c5c5c", "#767676", "#ee8182", "#f5c2c3", "#c9c9c9", "#e5e5e5" ],
                        chart: {
                            type: options.type,
                            backgroundColor: options.backgroundColor,
                            plotBorderWidth: options.plotBorderWidth,
                            plotBackgroundColor: options.plotBackgroundColor,
                            plotBorderColor: options.plotBorderColor,
                            plotShadow: options.plotShadow,
                            spacingBottom: options.spacingBottom,
                            marginTop: options.margintop,
                            marginBottom: options.marginbottom,
                            marginRight: options.marginright,
                            marginLeft: options.marginleft,
                            height: options.height,
                            width: options.width,
                            zoomType: "xy",
                            events: {
                                redraw: function(event) {
                                    if (options.redraw !== null && options.redraw !== "") {
                                        redraw(event);
                                    }
                                },
                                load: function(event) {
                                    if (options.load !== null && options.load !== "") {
                                        load(event);
                                    }
                                },
                                selection: function(event) {
                                    if (options.selection !== null && options.selection !== "") {
                                        selection(event);
                                    }
                                }
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        title: title,
                        subtitle: {
                            style: {
                                color: $scope.subTitle.fontcolor,
                                fontWeight: $scope.subTitle.fontweight,
                                fontSize: $scope.subTitle.fontsize
                            },
                            align: $scope.subTitle.align,
                            text: $scope.subTitle.text
                        },
                        xAxis: xAxis,
                        yAxis: yAxis,
                        tooltip: {
                            enabled: ($scope.tooltip.enabledFlag === undefined ? "false" : $scope.tooltip.enabledFlag).toUpperCase() === "FALSE" ? false : true,
                            valuePrefix: $scope.tooltip.valueprefix,
                            valueSuffix: $scope.tooltip.valuesuffix
                        },
                        legend: legend,
                        plotOptions: plotOptions,
                        series: $scope.data
                    };
                    if (iAttrs.option) {
                        chartOption = $scope.$parent.$eval(iAttrs.option);
                    }
                    if ($scope.gaguePane) {
                        chartOption.pane = $scope.gaguePane;
                    }
                    var highchart = jQuery(iElm).highcharts(chartOption);
                    $scope.$parent[options.chartName] = highchart.highcharts();
                }
                $scope.$watch("data", function(newScopeData, oldScopeData) {
                    while ($scope.$parent[options.chartName].series.length > 0) {
                        $scope.$parent[options.chartName].series[0].remove(false);
                    }
                    for (var i = 0; i < newScopeData.length; i++) {
                        $scope.$parent[options.chartName].addSeries(newScopeData[i], false);
                    }
                    $scope.$parent[options.chartName].redraw();
                }, true);
                $scope.$watch("xaxis", function(newScopeData, oldScopeData) {
                    for (var i = 0; i < newScopeData; i++) {
                        $scope.$parent[options.chartName].xAxis[i].update({
                            categories: newScopeData
                        });
                    }
                }, true);
                $scope.$watch("yaxis", function(newScopeData, oldScopeData) {
                    for (var i = 0; i < newScopeData; i++) {
                        $scope.$parent[options.chartName].yaxis[i].update({
                            categories: newScopeData
                        });
                    }
                }, true);
            }
        };
    } ]).directive("kChartMaintitle", [ function() {
        return {
            priority: 1,
            require: "^ktChart",
            restrict: "AE",
            link: function($scope, iElm, iAttrs, ktChartCtrl) {
                var options = angular.extend({}, {
                    text: iAttrs.text,
                    fontcolor: iAttrs.fontcolor,
                    fontsize: iAttrs.fontsize,
                    fontweight: iAttrs.fontweight,
                    align: iAttrs.align,
                    verticalAlign: iAttrs.verticalalign,
                    y: iAttrs.y,
                    x: iAttrs.x
                });
                ktChartCtrl.setMainTitle(angular.extend({}, options));
            }
        };
    } ]).directive("kChartSubtitle", [ function() {
        return {
            priority: 1,
            require: "^ktChart",
            restrict: "AE",
            link: function($scope, iElm, iAttrs, ktChartCtrl) {
                var options = angular.extend({}, {
                    text: iAttrs.text,
                    fontcolor: iAttrs.fontcolor,
                    fontsize: iAttrs.fontsize,
                    fontweight: iAttrs.fontweight,
                    align: iAttrs.align
                });
                ktChartCtrl.setSubTitle(angular.extend({}, options));
            }
        };
    } ]).directive("kChartTooltip", [ function() {
        return {
            priority: 1,
            require: "^ktChart",
            restrict: "AE",
            link: function($scope, iElm, iAttrs, ktChartCtrl) {
                var options = angular.extend({}, {
                    enabledFlag: iAttrs.enabled,
                    valueprefix: iAttrs.valueprefix,
                    valuesuffix: iAttrs.valuesuffix
                });
                ktChartCtrl.setTooltip(angular.extend({}, options));
            }
        };
    } ]).directive("kChartLegend", [ function() {
        return {
            priority: 1,
            require: "^ktChart",
            restrict: "AE",
            link: function($scope, iElm, iAttrs, ktChartCtrl) {
                var options = angular.extend({}, {
                    enabledFlag: iAttrs.enabled,
                    layout: iAttrs.layout,
                    align: iAttrs.align,
                    verticalalign: iAttrs.verticalalign,
                    x: iAttrs.x,
                    y: iAttrs.y,
                    backgroundcolor: iAttrs.backgroundcolor,
                    bordercolor: iAttrs.bordercolor,
                    itemhovercolor: iAttrs.itemhovercolor,
                    itemcolor: iAttrs.itemcolor,
                    itemfontweight: iAttrs.itemfontweight
                });
                ktChartCtrl.setLegend(angular.extend({}, options));
            }
        };
    } ]).directive("kChartXaxis", [ function() {
        return {
            priority: 1,
            require: "^ktChart",
            restrict: "AE",
            link: function($scope, iElm, iAttrs, ktChartCtrl) {
                var options = angular.extend({}, {
                    text: iAttrs.text,
                    step: iAttrs.step,
                    opposite: iAttrs.opposite === "true" ? true : false,
                    style: iAttrs.style ? $scope.$eval(iAttrs.style) : {},
                    category: $scope[iAttrs.category],
                    formatter: $scope[iAttrs.formatter]
                });
                ktChartCtrl.pushXAxis(angular.extend({}, options));
            }
        };
    } ]).directive("kChartYaxis", [ function() {
        return {
            priority: 1,
            require: "^ktChart",
            restrict: "AE",
            link: function($scope, iElm, iAttrs, ktChartCtrl) {
                var options = angular.extend({}, {
                    text: iAttrs.text,
                    step: iAttrs.step,
                    opposite: iAttrs.opposite === "true" ? true : false,
                    style: iAttrs.style ? $scope.$eval(iAttrs.style) : {},
                    category: $scope[iAttrs.category],
                    formatter: $scope[iAttrs.formatter]
                });
                if (iAttrs.options) {
                    options = {
                        options: $scope.$eval(iAttrs.options)
                    };
                }
                ktChartCtrl.pushYAxis(angular.extend({}, options));
            }
        };
    } ]).directive("kChartDatalabel", [ function() {
        return {
            priority: 1,
            require: "^ktChart",
            restrict: "AE",
            link: function($scope, iElm, iAttrs, ktChartCtrl) {
                var options = angular.extend({}, {
                    withlabel: iAttrs.withlabel,
                    point: iAttrs.point,
                    stacking: iAttrs.stacking
                });
                ktChartCtrl.setDatalabel(angular.extend({}, options));
            }
        };
    } ]).directive("gaugePane", [ function() {
        return {
            priority: 1,
            require: "^ktChart",
            restrict: "AE",
            link: function($scope, iElm, iAttrs, ktChartCtrl) {
                var options = {};
                if (iAttrs.gaugePane) {
                    options = $scope.$eval(iAttrs.gaugePane);
                }
                ktChartCtrl.setGaugeOpt(angular.extend({}, options));
            }
        };
    } ]);
    angular.module("kt.ui.date", []).constant("uiDateConfig", {}).directive("ktDate", [ "uiDateConfig", "uiDateConverter", function(uiDateConfig, uiDateConverter) {
        "use strict";
        var options;
        options = {};
        angular.extend(options, uiDateConfig);
        return {
            require: "?ngModel",
            link: function(scope, element, attrs, controller) {
                var getOptions = function() {
                    return angular.extend({}, uiDateConfig, scope.$eval(attrs.ktDate));
                };
                var initDateWidget = function() {
                    var showing = false;
                    var opts = getOptions();
                    if (controller) {
                        var _onSelect = opts.onSelect || angular.noop;
                        opts.onSelect = function(value, picker) {
                            scope.$apply(function() {
                                showing = true;
                                controller.$setViewValue(element.datepicker("getDate"));
                                _onSelect(value, picker);
                                element.blur();
                            });
                        };
                        var _beforeShow = opts.beforeShow || angular.noop;
                        opts.beforeShow = function(input, picker) {
                            showing = true;
                            _beforeShow(input, picker);
                        };
                        var _onClose = opts.onClose || angular.noop;
                        opts.onClose = function(value, picker) {
                            showing = false;
                            _onClose(value, picker);
                        };
                        element.off("blur.datepicker").on("blur.datepicker", function() {
                            if (!showing) {
                                scope.$apply(function() {
                                    element.datepicker("setDate", element.datepicker("getDate"));
                                    controller.$setViewValue(element.datepicker("getDate"));
                                });
                            }
                        });
                        controller.$render = function() {
                            var date = controller.$modelValue;
                            if (angular.isDefined(date) && date !== null && !angular.isDate(date)) {
                                if (angular.isString(controller.$modelValue)) {
                                    date = uiDateConverter.stringToDate(attrs.uiDateFormat, controller.$modelValue);
                                } else {
                                    throw new Error("ng-Model value must be a Date, or a String object with a date formatter - currently it is a " + typeof date + " - use ui-date-format to convert it from a string");
                                }
                            }
                            element.datepicker("setDate", date);
                        };
                    }
                    if (element.data("datepicker")) {
                        element.datepicker("option", opts);
                        element.datepicker("refresh");
                    } else {
                        element.datepicker(opts);
                        element.on("$destroy", function() {
                            element.datepicker("destroy");
                        });
                    }
                    if (controller) {
                        controller.$render();
                    }
                };
                scope.$watch(getOptions, initDateWidget, true);
            }
        };
    } ]).factory("uiDateConverter", [ "uiDateFormatConfig", function(uiDateFormatConfig) {
        function dateToString(dateFormat, value) {
            dateFormat = dateFormat || uiDateFormatConfig;
            if (value) {
                if (dateFormat) {
                    return jQuery.datepicker.formatDate(dateFormat, value);
                }
                if (value.toISOString) {
                    return value.toISOString();
                }
            }
            return null;
        }
        function stringToDate(dateFormat, value) {
            dateFormat = dateFormat || uiDateFormatConfig;
            if (angular.isString(value)) {
                if (dateFormat) {
                    return jQuery.datepicker.parseDate(dateFormat, value);
                }
                var isoDate = new Date(value);
                return isNaN(isoDate.getTime()) ? null : isoDate;
            }
            return null;
        }
        return {
            stringToDate: stringToDate,
            dateToString: dateToString
        };
    } ]).constant("uiDateFormatConfig", "").directive("ktDateFormat", [ "uiDateConverter", function(uiDateConverter) {
        var directive = {
            require: "ngModel",
            link: function(scope, element, attrs, modelCtrl) {
                var dateFormat = attrs.ktDateFormat;
                modelCtrl.$formatters.unshift(function(value) {
                    return uiDateConverter.stringToDate(dateFormat, value);
                });
                modelCtrl.$parsers.push(function(value) {
                    return uiDateConverter.dateToString(dateFormat, value);
                });
            }
        };
        return directive;
    } ]);
    var dialogModule = angular.module("kt.ui.dialog", [ "kt.ui.service.transition" ]);
    dialogModule.controller("MessageBoxController", [ "$scope", "dialog", "model", function($scope, dialog, model) {
        $scope.title = model.title;
        $scope.message = model.message;
        $scope.buttons = model.buttons;
        $scope.close = function(res) {
            dialog.close(res);
        };
    } ]);
    dialogModule.provider("$dialog", function() {
        var defaults = {
            backdrop: true,
            dialogClass: "modal",
            backdropClass: "modal-backdrop",
            transitionClass: "fade",
            triggerClass: "in",
            resolve: {},
            backdropFade: false,
            dialogFade: false,
            keyboard: true,
            backdropClick: true
        };
        var globalOptions = {};
        var activeBackdrops = {
            value: 0
        };
        this.options = function(value) {
            globalOptions = value;
        };
        this.$get = [ "$http", "$document", "$compile", "$rootScope", "$controller", "$templateCache", "$q", "$transition", "$injector", function($http, $document, $compile, $rootScope, $controller, $templateCache, $q, $transition, $injector) {
            var body = $document.find("body");
            function createElement(clazz) {
                var el = angular.element("<div>");
                el.addClass(clazz);
                return el;
            }
            function Dialog(opts) {
                var self = this, options = this.options = angular.extend({}, defaults, globalOptions, opts);
                this._open = false;
                this.backdropEl = createElement(options.backdropClass);
                if (options.backdropFade) {
                    this.backdropEl.addClass(options.transitionClass);
                    this.backdropEl.removeClass(options.triggerClass);
                }
                this.modalEl = createElement(options.dialogClass);
                if (options.dialogFade) {
                    this.modalEl.addClass(options.transitionClass);
                    this.modalEl.removeClass(options.triggerClass);
                }
                this.handledEscapeKey = function(e) {
                    if (e.which === 27) {
                        self.close();
                        e.preventDefault();
                        self.$scope.$apply();
                    }
                };
                this.handleBackDropClick = function(e) {
                    self.close();
                    e.preventDefault();
                    self.$scope.$apply();
                };
                this.handleLocationChange = function() {
                    self.close();
                };
            }
            Dialog.prototype.isOpen = function() {
                return this._open;
            };
            Dialog.prototype.open = function(templateUrl, controller) {
                var self = this, options = this.options;
                if (templateUrl) {
                    options.templateUrl = templateUrl;
                }
                if (controller) {
                    options.controller = controller;
                }
                if (!(options.template || options.templateUrl)) {
                    throw new Error("Dialog.open expected template or templateUrl, neither found. Use options or open method to specify them.");
                }
                this._loadResolves().then(function(locals) {
                    var $scope = locals.$scope = self.$scope = locals.$scope ? locals.$scope : $rootScope.$new();
                    self.modalEl.html(locals.$template);
                    if (self.options.controller) {
                        var ctrl = $controller(self.options.controller, locals);
                        self.modalEl.children().data("ngControllerController", ctrl);
                    }
                    $compile(self.modalEl)($scope);
                    self._addElementsToDom();
                    if (options.draggable === true) $(self.modalEl).draggable({
                        cursor: "move",
                        handle: ".modal-header"
                    });
                    setTimeout(function() {
                        if (self.options.dialogFade) {
                            self.modalEl.addClass(self.options.triggerClass);
                        }
                        if (self.options.backdropFade) {
                            self.backdropEl.addClass(self.options.triggerClass);
                        }
                        if (options.onOpen) {
                            options.onOpen.apply($scope, []);
                        }
                    });
                    self._bindEvents();
                });
                this.deferred = $q.defer();
                return this.deferred.promise;
            };
            Dialog.prototype.close = function(result) {
                var self = this;
                var fadingElements = this._getFadingElements();
                if (fadingElements.length > 0) {
                    for (var i = fadingElements.length - 1; i >= 0; i--) {
                        $transition(fadingElements[i], removeTriggerClass).then(onCloseComplete);
                    }
                    return;
                }
                this._onCloseComplete(result);
                function removeTriggerClass(el) {
                    el.removeClass(self.options.triggerClass);
                }
                function onCloseComplete() {
                    if (self._open) {
                        self._onCloseComplete(result);
                    }
                }
            };
            Dialog.prototype._getFadingElements = function() {
                var elements = [];
                if (this.options.dialogFade) {
                    elements.push(this.modalEl);
                }
                if (this.options.backdropFade) {
                    elements.push(this.backdropEl);
                }
                return elements;
            };
            Dialog.prototype._bindEvents = function() {
                if (this.options.keyboard) {
                    body.bind("keydown", this.handledEscapeKey);
                }
                if (this.options.backdrop && this.options.backdropClick) {
                    this.backdropEl.bind("click", this.handleBackDropClick);
                }
            };
            Dialog.prototype._unbindEvents = function() {
                if (this.options.keyboard) {
                    body.unbind("keydown", this.handledEscapeKey);
                }
                if (this.options.backdrop && this.options.backdropClick) {
                    this.backdropEl.unbind("click", this.handleBackDropClick);
                }
            };
            Dialog.prototype._onCloseComplete = function(result) {
                this._removeElementsFromDom();
                this._unbindEvents();
                this.deferred.resolve(result);
            };
            Dialog.prototype._addElementsToDom = function() {
                body.append(this.modalEl);
                if (this.options.backdrop) {
                    if (activeBackdrops.value === 0) {
                        body.append(this.backdropEl);
                    }
                    activeBackdrops.value++;
                }
                this._open = true;
            };
            Dialog.prototype._removeElementsFromDom = function() {
                this.modalEl.remove();
                if (this.options.backdrop) {
                    activeBackdrops.value--;
                    if (activeBackdrops.value === 0) {
                        this.backdropEl.remove();
                    }
                }
                this._open = false;
            };
            Dialog.prototype._loadResolves = function() {
                var values = [], keys = [], templatePromise, self = this;
                if (this.options.template) {
                    templatePromise = $q.when(this.options.template);
                } else if (this.options.templateUrl) {
                    templatePromise = $http.get(this.options.templateUrl, {
                        cache: $templateCache
                    }).then(function(response) {
                        return response.data;
                    });
                }
                angular.forEach(this.options.resolve || [], function(value, key) {
                    keys.push(key);
                    values.push(angular.isString(value) ? $injector.get(value) : $injector.invoke(value));
                });
                keys.push("$template");
                values.push(templatePromise);
                return $q.all(values).then(function(values) {
                    var locals = {};
                    angular.forEach(values, function(value, index) {
                        locals[keys[index]] = value;
                    });
                    locals.dialog = self;
                    return locals;
                });
            };
            return {
                dialog: function(opts) {
                    return new Dialog(opts);
                },
                messageBox: function(title, message, buttons) {
                    return new Dialog({
                        templateUrl: "template/dialog/message.html",
                        controller: "MessageBoxController",
                        resolve: {
                            model: function() {
                                return {
                                    title: title,
                                    message: message,
                                    buttons: buttons
                                };
                            }
                        }
                    });
                }
            };
        } ];
    });
    angular.module("kt.ui.itemSelector", []).constant("uiItemSelectorConfig", {}).directive("ktItemSelector", [ "uiItemSelectorConfig", "$compile", function(uiItemSelectorConfig, $compile) {
        "use strict";
        function getTemplate(leftOption, rightOption) {
            var template = '<div class="kt-item-selector">' + '<select class="pull-left left-select" ng-model="leftModel" ng-options="' + leftOption + ' in leftItems" multiple="multiple"></select>' + '<div class="buttonGroup pull-left">' + '<button type="button" ng-show="options.showCopyButton" ng-click="moveToRigth(leftModel)" class="btn right-copy-button"><i class="icon-arrow-right"></i></button>' + '<button type="button" ng-show="options.showMoveButton" ng-click="moveToRigth(leftModel,true)" class="btn right-move-button"><i class="icon-forward"></i></button>' + '<button type="button" ng-show="options.showMoveButton" ng-click="moveToLeft(rightModel,true)" class="btn left-move-button"><i class="icon-backward"></i></button>' + '<button type="button" ng-show="options.showCopyButton" ng-click="moveToLeft(rightModel)" class="btn left-copy-button"><i class="icon-arrow-left"></i></button>' + "</div>" + '<select class="pull-left right-select" ng-model="rightModel" ng-options="' + rightOption + ' in rightItems" multiple="multiple"></select>' + '<div class="clearfix"></div>' + "</div>";
            return template;
        }
        return {
            scope: {
                leftItems: "=",
                rightItems: "=",
                leftModel: "=",
                rightModel: "="
            },
            controller: function($scope, $element, $attrs) {
                function movingAtoB(a, b) {
                    if (!!!a) return;
                    if (_.isArray(a)) {
                        _.each(a, function(v) {
                            var newObj = {};
                            angular.copy(v, newObj);
                            delete newObj.$$hashKey;
                            b.push(newObj);
                        });
                    } else {
                        var newObj = {};
                        angular.copy(a, newObj);
                        delete newObj.$$hashKey;
                        b.push(newObj);
                    }
                }
                function removeAfromB(a, b) {
                    if (_.isArray(a)) {
                        _.each(a, function(v, i) {
                            _.each(b, function(o, i) {
                                if (_(v).isEqual(o)) {
                                    b.splice(i, 1);
                                }
                            });
                        });
                    } else {
                        _.each(b, function(o, i) {
                            if (_(a).isEqual(o)) {
                                b.splice(0, 1);
                            }
                        });
                    }
                }
                $scope.moveToRigth = function(leftModel, deleteOriginal) {
                    movingAtoB(leftModel, $scope.rightItems);
                    if (deleteOriginal) {
                        removeAfromB(leftModel, $scope.leftItems);
                        $scope.leftModel = null;
                    }
                };
                $scope.moveToLeft = function(rightModel, deleteOriginal) {
                    movingAtoB(rightModel, $scope.leftItems);
                    if (deleteOriginal) {
                        removeAfromB(rightModel, $scope.rightItems);
                        $scope.rightModel = null;
                    }
                };
            },
            restrict: "A",
            link: function($scope, iElm, iAttrs, controller) {
                var getOptions = function() {
                    return angular.extend({
                        showCopyButton: true,
                        showMoveButton: true
                    });
                };
                iElm.html(getTemplate(iAttrs.leftOptions, iAttrs.rightOptions));
                iElm.find("select").attr("size", $scope.leftItems.length);
                $scope.options = getOptions();
                $compile(iElm.contents())($scope);
            }
        };
    } ]);
    var _ = exports._;
    angular.module("kt.ui.grid", []).constant("ktGridConfig", {}).directive("ktGrid", [ "ktGridConfig", "$timeout", "$compile", "$translate", "$interpolate", function(ktGridConfig, $timeout, $compile, $translate, $interpolate) {
        return {
            scope: {
                data: "=",
                pagerData: "="
            },
            restrict: "ACM",
            compile: function compile(tElement, tAttrs, transclude) {
                return function($scope, iElm, iAttrs, controller) {
                    var options = angular.extend({
                        gridHeight: iAttrs.gridHeight ? $scope.$parent.$eval(iAttrs.gridHeight) : undefined,
                        gridWidth: iAttrs.gridWidth ? $scope.$parent.$eval(iAttrs.gridWidth) : undefined,
                        rowNum: iAttrs.rowNum ? $scope.$parent.$eval(iAttrs.rowNum) : undefined,
                        pager: iAttrs.pager === "true" ? true : false,
                        rownumbers: iAttrs.rownumbers,
                        rowNumWidth: iAttrs.rowNumWidth,
                        rowList: iAttrs.rowList,
                        rowTotal: iAttrs.rowTotal,
                        scrollrows: iAttrs.scrollrows,
                        footerrow: iAttrs.footerrow,
                        forcefit: iAttrs.forcefit,
                        caption: iAttrs.caption,
                        sortable: iAttrs.sortable,
                        scroll: iAttrs.scroll,
                        autowidth: iAttrs.autowidth,
                        autoheight: iAttrs.autoheight,
                        multiselect: iAttrs.multiselect,
                        recordtext: iAttrs.recordtext,
                        imgpath: iAttrs.imgpath
                    }, ktGridConfig), colMeta = buildColMeta(iElm), handlers = buildHandlers(iElm), gridId = iAttrs.ktGrid, gridInstance = null, hasIdIndex = false, hasColumnInfo = false, colNames;
                    function buildGrid() {}
                    function init() {
                        iElm.empty();
                        iElm.attr("id", gridId);
                        if (options.pager === true) {
                            iElm.after("<div id='" + gridId + "-pager'></div>");
                        }
                        if ($scope.data.columns) {
                            colNames = [];
                            hasColumnInfo = true;
                            angular.forEach($scope.data.columns, function(value, key) {
                                colNames.push(value.name);
                            });
                        }
                        gridInstance = jQuery(iElm).jqGrid({
                            datatype: "clientside",
                            height: options.gridHeight ? options.gridHeight === "auto" ? "auto" : Number(options.gridHeight) : undefined,
                            width: options.gridWidth ? Number(options.gridWidth) : "100%",
                            colNames: hasColumnInfo ? colNames : colMeta.colNames,
                            colModel: hasColumnInfo ? $scope.data.columns : colMeta.colModel,
                            pager: options.pager === true ? "#" + gridId + "-pager" : null,
                            rowTotal: options.rowTotal ? Number(options.rowTotal) : 0,
                            rowNum: options.rowNum ? Number(options.rowNum) : undefined,
                            rowList: options.rowList ? $scope.$eval(options.rowList) : [ 10, 20, 30 ],
                            scroll: options.scroll === "1" ? 1 : false,
                            sortable: options.sortable === "true" ? true : false,
                            sortname: options.sortname,
                            autowidth: options.autowidth === "true" ? true : false,
                            imgpath: options.imgpath,
                            viewrecords: true,
                            rownumbers: options.rownumbers === "true" ? true : false,
                            scrollrows: options.scrollrows === "true" ? true : false,
                            rowNumWidth: Number(options.rowNumWidth) || 10,
                            multiselect: options.multiselect === "true" ? true : false,
                            forceFit: options.forcefit === "true" ? true : false,
                            onSelectRow: handlers.onSelectRow,
                            onPaging: handlers.onPageChange,
                            onSortCol: handlers.onSortCol,
                            onCellSelect: handlers.onCellSelect,
                            onSelectAll: handlers.onSelectAll,
                            gridComplete: handlers.gridComplete,
                            caption: options.caption,
                            footerrow: options.footerrow === "true" ? true : false,
                            recordtext: options.recordtext ? options.recordtext : "records {0} - {1} of {2}"
                        });
                        $scope.$parent[iAttrs.ktGrid] = gridInstance;
                        if (colMeta.colGroups.length > 0) {
                            gridInstance.setGroupHeaders({
                                useColSpanStyle: colMeta.colMerge,
                                groupHeaders: colMeta.colGroups
                            });
                        }
                        $scope.$watch("data", function(newScopeData, oldScopeData) {
                            var msg = $translate.instant("GRID.NO-DATA") == "GRID.NO-DATA" ? "<span class='jqGridNoData'>조회된 데이터가 없거나 데이터를 조회중 입니다.</span>" : $translate.instant("GRID.NO-DATA");
                            gridInstance.clearGridData(true);
                            if (newScopeData.columns) {
                                gridInstance.jqGrid("GridUnload");
                                colNames = [];
                                angular.forEach(newScopeData.columns, function(value, key) {
                                    colNames.push(value.title);
                                });
                                gridInstance = jQuery("#" + gridId).jqGrid({
                                    datatype: "clientside",
                                    height: gridInstance.getGridParam().height,
                                    width: gridInstance.getGridParam().width,
                                    colNames: colNames,
                                    colModel: newScopeData.columns,
                                    pager: gridInstance.getGridParam().pager,
                                    rowNum: gridInstance.getGridParam().rowNum,
                                    rowList: gridInstance.getGridParam().rowList,
                                    scroll: gridInstance.getGridParam().scroll,
                                    sortable: gridInstance.getGridParam().sortable,
                                    sortname: gridInstance.getGridParam().sortname,
                                    autowidth: gridInstance.getGridParam().autowidth,
                                    imgpath: gridInstance.getGridParam().imgpath,
                                    viewrecords: true,
                                    rownumbers: gridInstance.getGridParam().rownumbers,
                                    scrollrows: options.scrollrows === "true" ? true : false,
                                    rowNumWidth: gridInstance.getGridParam().rowNumWidth,
                                    multiselect: options.multiselect === "true" ? true : false,
                                    forceFit: gridInstance.getGridParam().forceFit,
                                    onSelectRow: handlers.onSelectRow,
                                    onPaging: handlers.onPageChange,
                                    onSortCol: handlers.onSortCol,
                                    onCellSelect: handlers.onCellSelect,
                                    caption: options.caption,
                                    lastpage: newScopeData.total,
                                    page: newScopeData.page,
                                    records: newScopeData.records,
                                    rowTotal: newScopeData.records,
                                    pageServer: newScopeData.page,
                                    recordsServer: newScopeData.records,
                                    lastpageServer: newScopeData.total,
                                    footerrow: options.footerrow === "true" ? true : false,
                                    recordtext: options.recordtext ? options.recordtext : "records {0} - {1} of {2}"
                                });
                                $scope.$parent[iAttrs.ktGrid] = gridInstance;
                            }
                            if (newScopeData.rows === undefined || newScopeData.rows === null || newScopeData.rows.length === undefined || newScopeData.rows.length === 0) {
                                if (jQuery("#" + gridId + "-emptyMsg").length === 0) jQuery(iElm).parent().append("<div id='" + gridId + "-emptyMsg' style=\"font-size:'8pt';text-align:center;padding:'10px';height:'auto'\">" + msg + "<div>");
                            } else {
                                jQuery("#" + gridId + "-emptyMsg").remove();
                                gridInstance.footerData("set", newScopeData.footerData);
                                if (newScopeData.total && newScopeData.page && options.pager) {
                                    var page = newScopeData.page;
                                    var records = newScopeData.records;
                                    var total = newScopeData.total;
                                    var rowNum = Number(gridInstance.getGridParam("rowNum"));
                                    angular.forEach(newScopeData.rows, function(value, key) {
                                        value.$$id = (page - 1) * rowNum + key;
                                    });
                                    gridInstance.addRowData("$$id", newScopeData.rows);
                                    gridInstance.setGridParam({
                                        lastpage: newScopeData.total,
                                        page: newScopeData.page,
                                        records: newScopeData.records,
                                        rowTotal: newScopeData.records,
                                        data: newScopeData.rows,
                                        pageServer: newScopeData.page,
                                        recordsServer: newScopeData.records,
                                        lastpageServer: newScopeData.total
                                    });
                                } else {
                                    angular.forEach(newScopeData.rows, function(value, key) {
                                        value.$$id = key + 1;
                                    });
                                    gridInstance.addRowData("$$id", newScopeData.rows);
                                }
                                gridInstance.each(function() {
                                    if (this.grid) this.updatepager(true);
                                });
                                if (options.pager !== true) gridInstance.trigger("reloadGrid", [ {
                                    lastpage: newScopeData.total,
                                    page: newScopeData.page
                                } ]);
                            }
                        }, true);
                    }
                    function getHandlerMethodNameMap(el) {
                        var $tr = el.children("tbody").children("tr");
                        return {
                            onSelectRowFuncName: $tr.attr("on-select-row") || "",
                            onSelectCellFuncName: $tr.attr("on-select-cell") || ""
                        };
                    }
                    function buildColMeta(el) {
                        var cn = [], cm = [], ci = [], cg = [], colMerge = false;
                        angular.forEach(el.children("tbody").children("tr").children("td"), function(tdEl) {
                            var $td = angular.element(tdEl), expc = $td.html(), name = expc.replace(/[{}|<>\s]/g, ""), title = $td.attr("title") || name, index = $td.attr("index") || name, width = $td.attr("width") || 100, sorttype = $td.attr("sorttype") || "text", sortable = $td.attr("sortable") === "true" ? true : false, editable = $td.attr("editable") === "true" ? true : false, editoptions = $td.attr("editoptions") ? $scope.$eval($td.attr("editoptions")) : null, formatter = $td.attr("formatter") || "text", cellattr = $td.attr("cellattr") || "text", formatoptions = $td.attr("formatoptions") ? $scope.$eval($td.attr("formatoptions")) : null, align = $td.attr("align") || "center", fixed = $td.attr("fixed") === "true" ? true : false, hidden = $td.attr("hidden") === "hidden" || $td.attr("hidden") === "true" ? true : false;
                            if (index === "id") hasIdIndex = true;
                            cm.push({
                                name: name,
                                index: index,
                                width: width,
                                align: align,
                                hidden: hidden,
                                formatter: formatter === "text" ? function(cellvalue, options, rowObject) {
                                    if (options.colModel.formatoptions === null) options.colModel.formatoptions = {};
                                    if (options.colModel.formatoptions.defaultValue !== undefined && cellvalue === null) {
                                        return options.colModel.formatoptions.defaultValue || "";
                                    } else {
                                        return cellvalue;
                                    }
                                } : $scope.$parent.$eval(formatter),
                                formatoptions: formatoptions,
                                cellattr: $scope.$parent.$eval(cellattr),
                                sortable: sortable,
                                sorttype: sorttype,
                                editable: editable,
                                fixed: fixed
                            });
                        });
                        if (el.children("thead").children("tr").length > 1) {
                            var indexAmended = 0;
                            colMerge = el.children("thead").children("tr:first").attr("row-merge") === "true" ? true : false;
                            angular.forEach(el.children("thead").children("tr:first").children("th"), function(value, index) {
                                var numberOfColumns = Number(value.getAttribute("colspan")) || 1;
                                if (value.innerHTML !== "") {
                                    if (value.innerHTML.indexOf("{{") >= 0) {
                                        cg.push({
                                            startColumnName: cm[index + indexAmended].name,
                                            numberOfColumns: numberOfColumns,
                                            titleText: $interpolate(value.innerHTML)({})
                                        });
                                    } else {
                                        cg.push({
                                            startColumnName: cm[index + indexAmended].name,
                                            numberOfColumns: numberOfColumns,
                                            titleText: value.innerHTML
                                        });
                                    }
                                }
                                if (numberOfColumns > 1) indexAmended = indexAmended + numberOfColumns - 1;
                            });
                            angular.forEach(el.children("thead").children("tr:nth-child(2)").children("th"), function(value, key) {
                                if (value.innerHTML.indexOf("{{") >= 0) {
                                    cn.push($interpolate(value.innerHTML)({}));
                                } else {
                                    cn.push(value.innerHTML);
                                }
                            });
                        } else {
                            angular.forEach(el.children("thead").children("tr").children("th"), function(value, key) {
                                if (value.innerHTML.indexOf("{{") >= 0) {
                                    cn.push($interpolate(value.innerHTML)({}));
                                } else {
                                    cn.push(value.innerHTML);
                                }
                            });
                        }
                        return {
                            colNames: cn,
                            colModel: cm,
                            colGroups: cg,
                            colMerge: colMerge
                        };
                    }
                    function buildHandlers() {
                        var handlerMethodNameMap = getHandlerMethodNameMap(iElm), controllerName = handlerMethodNameMap.onSelectRowFuncName.replace(/\(.*\)/, ""), cellControllerName = handlerMethodNameMap.onSelectCellFuncName.replace(/\(.*\)/, ""), pageChangeName = iAttrs.onPageChange ? iAttrs.onPageChange.replace(/\(.*\)/, "") : null, sortChangeName = iAttrs.sortChangeName ? iAttrs.sortChangeName.replace(/\(.*\)/, "") : null, selectAllFuncName = iAttrs.onSelectAll ? iAttrs.onSelectAll.replace(/\(.*\)/, "") : null, gridCompleteFuncName = iAttrs.gridComplete ? iAttrs.gridComplete.replace(/\(.*\)/, "") : null, controllerArray = controllerName !== undefined && controllerName !== null && controllerName.indexOf(".") > -1 ? controllerName.split(".") : null, controllerFunc = controllerArray ? $scope.$parent.$eval(controllerArray[0])[controllerArray[1]] : $scope.$parent[controllerName], cellControllerArray = cellControllerName !== undefined && cellControllerName !== null && cellControllerName.indexOf(".") > -1 ? cellControllerName.split(".") : null, cellControllerFunc = cellControllerArray ? $scope.$parent.$eval(cellControllerArray[0])[cellControllerArray[1]] : $scope.$parent[cellControllerName], pageChangeArray = pageChangeName !== undefined && pageChangeName !== null && pageChangeName.indexOf(".") > -1 ? pageChangeName.split(".") : null, pageChangeFunc = pageChangeArray ? $scope.$parent.$eval(pageChangeArray[0])[pageChangeArray[1]] : $scope.$parent[pageChangeName], selectAllArray = selectAllFuncName !== undefined && selectAllFuncName !== null && selectAllFuncName.indexOf(".") > -1 ? selectAllFuncName.split(".") : null, selectAllFunc = selectAllArray ? $scope.$parent.$eval(selectAllArray[0])[selectAllArray[1]] : $scope.$parent[selectAllFuncName], gridCompleteArray = gridCompleteFuncName !== undefined && gridCompleteFuncName !== null && gridCompleteFuncName.indexOf(".") > -1 ? gridCompleteFuncName.split(".") : null, gridCompleteFunc = gridCompleteArray ? $scope.$parent.$eval(gridCompleteArray[0])[gridCompleteArray[1]] : $scope.$parent[gridCompleteFuncName], sortChangeArray = sortChangeName !== undefined && sortChangeName !== null && sortChangeName.indexOf(".") > -1 ? sortChangeName.split(".") : null, sortChangeFunc = sortChangeArray ? $scope.$parent.$eval(sortChangeArray[0])[sortChangeArray[1]] : $scope.$parent[sortChangeName];
                        return {
                            onSelectRow: function(rowid) {
                                var rowData, page, rowNum, rowIndex;
                                if (options.pager === true) {
                                    rowData = jQuery(iElm).jqGrid("getRowData", rowid);
                                    page = gridInstance.getGridParam("page");
                                    rowNum = gridInstance.getGridParam("rowNum");
                                    rowIndex = rowid - (page - 1) * rowNum;
                                } else {
                                    rowData = jQuery(iElm).jqGrid("getRowData", rowid);
                                    rowIndex = options.scroll ? Number(rowid.replace("jqg", "")) - 1 : Number(rowid.replace("jqg", "")) - 1;
                                }
                                $timeout(function() {
                                    if (controllerFunc) {
                                        controllerFunc.apply($scope.$parent, [ $scope.data.rows[rowIndex], rowData ]);
                                    }
                                });
                            },
                            onCellSelect: function(rowid, iCol, cellcontent, e) {
                                var rowData, page, rowNum, rowIndex;
                                if (options.pager) {
                                    rowData = jQuery(iElm).jqGrid("getRowData", rowid);
                                    page = gridInstance.getGridParam("page");
                                    rowNum = gridInstance.getGridParam("rowNum");
                                    rowIndex = rowid - (page - 1) * rowNum;
                                } else {
                                    rowData = jQuery(iElm).jqGrid("getRowData", rowid);
                                    rowIndex = options.scroll ? Number(rowid.replace("jqg", "")) - 2 : Number(rowid.replace("jqg", "")) - 1;
                                }
                                $timeout(function() {
                                    if (cellControllerFunc) {
                                        cellControllerFunc.apply($scope.$parent, [ $scope.data.rows[rowIndex][gridInstance.getGridParam("colModel")[iCol].index], gridInstance.getCell(rowid, iCol), rowIndex, iCol, cellcontent, e ]);
                                    }
                                });
                            },
                            onPageChange: function(name) {
                                $timeout(function() {
                                    var page = gridInstance.getGridParam("page");
                                    var rowNum = gridInstance.getGridParam("rowNum");
                                    if (pageChangeFunc) {
                                        pageChangeFunc.apply($scope.$parent, [ page, Number(rowNum) ]);
                                    }
                                });
                            },
                            onSelectAll: function(aRowids, status) {
                                $timeout(function() {
                                    if (selectAllFunc) {
                                        selectAllFunc.apply($scope.$parent, [ aRowids, status ]);
                                    }
                                });
                            },
                            gridComplete: function() {
                                $timeout(function() {
                                    if (gridCompleteFunc) {
                                        gridCompleteFunc.apply($scope.$parent, []);
                                    }
                                });
                            },
                            onSortCol: function(index, iCol, sortorder) {
                                $timeout(function() {
                                    gridInstance.setGridParam({
                                        lastpage: $scope.data.total,
                                        page: $scope.data.page,
                                        records: $scope.data.records,
                                        rowTotal: $scope.data.records,
                                        data: $scope.data.rows,
                                        pageServer: $scope.data.page,
                                        recordsServer: $scope.data.records,
                                        lastpageServer: $scope.data.total
                                    });
                                    gridInstance.each(function() {
                                        if (this.grid) this.updatepager(true);
                                    });
                                });
                            }
                        };
                    }
                    $timeout(function() {
                        init();
                    });
                };
            }
        };
    } ]);
    angular.module("kt.ui.map", []).directive("infowindow", [ "$compile", function($compile) {
        return {
            require: "^ktMap",
            restrict: "AE",
            controller: function($scope, $element, $attrs) {},
            link: function($scope, iElm, iAttrs, controller) {
                var elText = iElm.html();
                var newInfoWindow = new olleh.maps.InfoWindow({
                    cBox: false,
                    content: elText,
                    maxWidth: iAttrs.maxWidth ? Number(iAttrs.maxWidth) : undefined
                });
                var d = newInfoWindow.open;
                newInfoWindow.open = function(a, b, c) {
                    d.apply(newInfoWindow, [ a, b, c ]);
                    $compile(newInfoWindow.childDiv)($scope.$parent);
                };
                $scope.infowindows.push(newInfoWindow);
                $scope.$parent[iAttrs.infowindow] = newInfoWindow;
            }
        };
    } ]).directive("ktMap", [ "$compile", function($compile) {
        return {
            scope: {
                center: "=",
                markers: "="
            },
            controller: function($scope, $element, $attrs) {
                $scope.infowindows = [];
            },
            restrict: "EA",
            link: function($scope, iElm, iAttrs, controller) {
                if ($scope.center === undefined) {
                    throw new Error("center 값이 없습니다. center를 전달해 주세요.");
                }
                var wrapperTemplate = '<div class="mapWrapper"> \r\n								<div> \r\n									<div class="canvas_map" style="position:absolute; width:100%; height:100%; left:0px; top:0px"></div> \r\n								</div> \r\n							</div>';
                iElm.html(wrapperTemplate);
                var srcproj = new olleh.maps.Projection("UTM_K");
                var destproj = new olleh.maps.Projection("EPSG:4326");
                var point = new olleh.maps.Point($scope.center.x, $scope.center.y);
                olleh.maps.Projection.transform(point, destproj, srcproj);
                var map = new olleh.maps.Map(iElm.find(".canvas_map").get()[0], {
                    center: new olleh.maps.Coord(point.x, point.y),
                    zoom: Number(iAttrs.zoom) || 5,
                    mapTypeId: olleh.maps.MapTypeId.BASEMAP,
                    disableDefaultUI: true
                });
                $scope.$watch("markers", function(newMarkers) {
                    _(newMarkers).each(function(value, key, newMarkers) {
                        var srcproj = new olleh.maps.Projection(value.srcproj);
                        var destproj = new olleh.maps.Projection(value.destproj);
                        var point = new olleh.maps.Point(value.x, value.y);
                        olleh.maps.Projection.transform(point, destproj, srcproj);
                        var newMark = new olleh.maps.Marker({
                            position: new olleh.maps.Coord(point.x, point.y),
                            map: map,
                            icon: new olleh.maps.MarkerImage(value.image, new olleh.maps.Size(value.size[0], value.size[1]), new olleh.maps.Pixel(0, 0), new olleh.maps.Pixel(0, 0))
                        });
                        if (value.onClick) {
                            olleh.maps.event.addListener(newMark, "click", function() {
                                $scope.$apply(function() {
                                    value.onClick.apply(null, [ newMark ]);
                                });
                            });
                        }
                        $scope.$parent[value.instance] = newMark;
                    });
                }, true);
                $scope.$watch("center", function(newCenter) {
                    var point = new olleh.maps.Point(newCenter.x, newCenter.y);
                    olleh.maps.Projection.transform(point, destproj, srcproj);
                    map.setCenter(new olleh.maps.Coord(point.x, point.y));
                }, true);
                $scope.$parent[iAttrs.ktMap] = map;
                $compile(iElm.contents())($scope);
            }
        };
    } ]);
    angular.module("kt.ui.markupPreview", []).directive("ktMarkupPreview", [ "$timeout", function($timeout) {
        return {
            scope: {
                ktMarkupPreview: "="
            },
            restrict: "ACM",
            link: function(scope, element, attrs, ngModelCtrl) {
                showValue();
                function showValue() {
                    $timeout(function() {
                        var value = scope.ktMarkupPreview;
                        jQuery(element).html(value);
                    }, 100);
                }
                scope.$watch("ktMarkupPreview", function(newScopeData, oldScopeData) {
                    scope.ktMarkupPreview = newScopeData;
                    showValue();
                }, true);
            }
        };
    } ]);
    angular.module("kt.ui.miniChart", []).directive("ktMiniChart", function() {
        return {
            restrict: "A",
            scope: {
                data: "=",
                options: "="
            },
            link: function(scope, iElement, iAttrs) {
                var options = angular.extend({
                    type: iAttrs.type
                }, scope.options);
                scope.$watch("options", function(newVal) {
                    options = angular.extend({
                        type: iAttrs.type
                    }, newVal);
                    jQuery(iElement).sparkline(scope.data[0].data, options);
                });
                scope.$watch("data[0].data", function(newVal) {
                    jQuery(iElement).sparkline(newVal, options);
                }, true);
                jQuery(iElement).bind("sparklineClick", function(ev) {
                    var sparkline = ev.sparklines[0], region = sparkline.getCurrentRegionFields();
                });
            }
        };
    });
    angular.module("kt.ui.modal", [ "kt.ui.dialog" ]).directive("ktModal", [ "$parse", "$modal", "$timeout", function($parse, $modal, $timeout) {
        return {
            restrict: "EA",
            terminal: true,
            link: function(scope, elm, attrs) {
                var opts = angular.extend({}, scope.$eval(attrs.uiOptions || attrs.bsOptions || attrs.options));
                var shownExpr = attrs.ktModal || attrs.show;
                var setClosed;
                opts = angular.extend(opts, {
                    template: elm.html(),
                    scope: scope,
                    resolve: {
                        $scope: function() {
                            return scope;
                        }
                    },
                    windowClass: opts.dialogClass
                });
                var dialog;
                elm.remove();
                if (attrs.close) {
                    setClosed = function() {
                        $parse(attrs.close)(scope);
                    };
                } else {
                    setClosed = function() {
                        if (angular.isFunction($parse(shownExpr).assign)) {
                            $parse(shownExpr).assign(scope, false);
                        }
                    };
                }
                scope.$watch(shownExpr, function(isShown, oldShown) {
                    if (isShown) {
                        dialog = $modal.open(opts);
                        dialog.opened.then(function() {
                            if (opts.onOpen) {
                                $timeout(function() {
                                    opts.onOpen.apply(null, []);
                                });
                            }
                        });
                        dialog.result.then(function() {}, function() {
                            setClosed();
                        });
                    } else {
                        if (dialog && dialog.opened) {
                            dialog.close();
                        }
                    }
                });
            }
        };
    } ]).factory("$$stackedMap", function() {
        return {
            createNew: function() {
                var stack = [];
                return {
                    add: function(key, value) {
                        stack.push({
                            key: key,
                            value: value
                        });
                    },
                    get: function(key) {
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                return stack[i];
                            }
                        }
                    },
                    keys: function() {
                        var keys = [];
                        for (var i = 0; i < stack.length; i++) {
                            keys.push(stack[i].key);
                        }
                        return keys;
                    },
                    top: function() {
                        return stack[stack.length - 1];
                    },
                    remove: function(key) {
                        var idx = -1;
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                idx = i;
                                break;
                            }
                        }
                        return stack.splice(idx, 1)[0];
                    },
                    removeTop: function() {
                        return stack.splice(stack.length - 1, 1)[0];
                    },
                    length: function() {
                        return stack.length;
                    }
                };
            }
        };
    }).directive("modalBackdrop", [ "$timeout", function($timeout) {
        return {
            restrict: "EA",
            replace: true,
            template: '<div class="modal-backdrop fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + index*10}" ng-click="close($event)"></div>',
            link: function(scope, element, attrs) {
                scope.backdropClass = attrs.backdropClass || "";
                scope.animate = false;
                $timeout(function() {
                    scope.animate = true;
                });
            }
        };
    } ]).directive("modalWindow", [ "$modalStack", "$timeout", function($modalStack, $timeout) {
        return {
            restrict: "EA",
            scope: {
                index: "@",
                animate: "="
            },
            replace: true,
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || '<div tabindex="-1" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)"><div class="modal-dialog" ng-class="{\'modal-sm\': size == \'sm\', \'modal-lg\': size == \'lg\'}"><div class="modal-content" modal-transclude></div></div></div>';
            },
            link: function(scope, element, attrs) {
                element.addClass(attrs.windowClass || "");
                scope.size = attrs.size;
                $timeout(function() {
                    scope.animate = true;
                    if (!element[0].querySelectorAll("[autofocus]").length) {
                        element[0].focus();
                    }
                });
                scope.close = function(evt) {
                    var modal = $modalStack.getTop();
                    if (modal && modal.value.backdrop && modal.value.backdrop != "static" && evt.target === evt.currentTarget) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $modalStack.dismiss(modal.key, "backdrop click");
                    }
                };
            }
        };
    } ]).directive("modalTransclude", function() {
        return {
            link: function($scope, $element, $attrs, controller, $transclude) {
                $transclude($scope.$parent, function(clone) {
                    $element.empty();
                    $element.append(clone);
                });
            }
        };
    }).factory("$modalStack", [ "$transition", "$timeout", "$document", "$compile", "$rootScope", "$$stackedMap", function($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {
        var OPENED_MODAL_CLASS = "modal-open";
        var backdropDomEl, backdropScope;
        var openedWindows = $$stackedMap.createNew();
        var $modalStack = {};
        function backdropIndex() {
            var topBackdropIndex = -1;
            var opened = openedWindows.keys();
            for (var i = 0; i < opened.length; i++) {
                if (openedWindows.get(opened[i]).value.backdrop) {
                    topBackdropIndex = i;
                }
            }
            return topBackdropIndex;
        }
        $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
            if (backdropScope) {
                backdropScope.index = newBackdropIndex;
            }
        });
        function removeModalWindow(modalInstance) {
            var body = $document.find("body").eq(0);
            var modalWindow = openedWindows.get(modalInstance).value;
            openedWindows.remove(modalInstance);
            removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 0, function() {
                modalWindow.modalScope.$destroy();
                body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
                checkRemoveBackdrop();
            });
        }
        function checkRemoveBackdrop() {
            if (backdropDomEl && backdropIndex() == -1) {
                var backdropScopeRef = backdropScope;
                removeAfterAnimate(backdropDomEl, backdropScope, 150, function() {
                    backdropScopeRef.$destroy();
                    backdropScopeRef = null;
                });
                backdropDomEl = undefined;
                backdropScope = undefined;
            }
        }
        function removeAfterAnimate(domEl, scope, emulateTime, done) {
            scope.animate = false;
            var transitionEndEventName = $transition.transitionEndEventName;
            if (transitionEndEventName) {
                var timeout = $timeout(afterAnimating, emulateTime);
                domEl.bind(transitionEndEventName, function() {
                    $timeout.cancel(timeout);
                    afterAnimating();
                    scope.$apply();
                });
            } else {
                $timeout(afterAnimating);
            }
            function afterAnimating() {
                if (afterAnimating.done) {
                    return;
                }
                afterAnimating.done = true;
                domEl.remove();
                if (done) {
                    done();
                }
            }
        }
        $document.bind("keydown", function(evt) {
            var modal;
            if (evt.which === 27) {
                modal = openedWindows.top();
                if (modal && modal.value.keyboard) {
                    evt.preventDefault();
                    $rootScope.$apply(function() {
                        $modalStack.dismiss(modal.key, "escape key press");
                    });
                }
            }
        });
        $modalStack.open = function(modalInstance, modal) {
            openedWindows.add(modalInstance, {
                deferred: modal.deferred,
                modalScope: modal.scope,
                backdrop: modal.backdrop,
                keyboard: modal.keyboard
            });
            var body = $document.find("body").eq(0), currBackdropIndex = backdropIndex();
            if (currBackdropIndex >= 0 && !backdropDomEl) {
                backdropScope = $rootScope.$new(true);
                backdropScope.index = currBackdropIndex;
                var angularBackgroundDomEl = angular.element("<div modal-backdrop></div>");
                angularBackgroundDomEl.attr("backdrop-class", modal.backdropClass);
                backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
                body.append(backdropDomEl);
            }
            var angularDomEl = angular.element('<div class="modal"></div>');
            angularDomEl.attr({
                "template-url": modal.windowTemplateUrl,
                "window-class": modal.windowClass,
                size: modal.size,
                index: openedWindows.length() - 1,
                animate: "animate"
            }).html(modal.content);
            var modalDomEl = $compile(angularDomEl)(modal.scope);
            openedWindows.top().value.modalDomEl = modalDomEl;
            body.append(modalDomEl);
            body.addClass(OPENED_MODAL_CLASS);
        };
        $modalStack.close = function(modalInstance, result) {
            var modalWindow = openedWindows.get(modalInstance);
            if (modalWindow) {
                modalWindow.value.deferred.resolve(result);
                removeModalWindow(modalInstance);
            }
        };
        $modalStack.dismiss = function(modalInstance, reason) {
            var modalWindow = openedWindows.get(modalInstance);
            if (modalWindow) {
                modalWindow.value.deferred.reject(reason);
                removeModalWindow(modalInstance);
            }
        };
        $modalStack.dismissAll = function(reason) {
            var topModal = this.getTop();
            while (topModal) {
                this.dismiss(topModal.key, reason);
                topModal = this.getTop();
            }
        };
        $modalStack.getTop = function() {
            return openedWindows.top();
        };
        return $modalStack;
    } ]).provider("$modal", function() {
        var $modalProvider = {
            options: {
                backdrop: true,
                keyboard: true
            },
            $get: [ "$injector", "$rootScope", "$q", "$http", "$templateCache", "$controller", "$modalStack", function($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {
                var $modal = {};
                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template) : $http.get(angular.isFunction(options.templateUrl) ? options.templateUrl() : options.templateUrl, {
                        cache: $templateCache
                    }).then(function(result) {
                        return result.data;
                    });
                }
                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    angular.forEach(resolves, function(value) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        }
                    });
                    return promisesArr;
                }
                $modal.open = function(modalOptions) {
                    var modalResultDeferred = $q.defer();
                    var modalOpenedDeferred = $q.defer();
                    var modalInstance = {
                        result: modalResultDeferred.promise,
                        opened: modalOpenedDeferred.promise,
                        close: function(result) {
                            $modalStack.close(modalInstance, result);
                        },
                        dismiss: function(reason) {
                            $modalStack.dismiss(modalInstance, reason);
                        }
                    };
                    modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
                    modalOptions.resolve = modalOptions.resolve || {};
                    if (!modalOptions.template && !modalOptions.templateUrl) {
                        throw new Error("One of template or templateUrl options is required.");
                    }
                    var templateAndResolvePromise = $q.all([ getTemplatePromise(modalOptions) ].concat(getResolvePromises(modalOptions.resolve)));
                    templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                        var modalScope = (modalOptions.scope || $rootScope).$new();
                        modalScope.$close = modalInstance.close;
                        modalScope.$dismiss = modalInstance.dismiss;
                        var ctrlInstance, ctrlLocals = {};
                        var resolveIter = 1;
                        if (modalOptions.controller) {
                            ctrlLocals.$scope = modalScope;
                            ctrlLocals.$modalInstance = modalInstance;
                            angular.forEach(modalOptions.resolve, function(value, key) {
                                ctrlLocals[key] = tplAndVars[resolveIter++];
                            });
                            ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                            if (modalOptions.controllerAs) {
                                modalScope[modalOptions.controllerAs] = ctrlInstance;
                            }
                        }
                        $modalStack.open(modalInstance, {
                            scope: modalScope,
                            deferred: modalResultDeferred,
                            content: tplAndVars[0],
                            backdrop: modalOptions.backdrop,
                            keyboard: modalOptions.keyboard,
                            backdropClass: modalOptions.backdropClass,
                            windowClass: modalOptions.windowClass,
                            windowTemplateUrl: modalOptions.windowTemplateUrl,
                            size: modalOptions.size
                        });
                    }, function resolveError(reason) {
                        modalResultDeferred.reject(reason);
                    });
                    templateAndResolvePromise.then(function() {
                        modalOpenedDeferred.resolve(true);
                    }, function() {
                        modalOpenedDeferred.reject(false);
                    });
                    return modalInstance;
                };
                return $modal;
            } ]
        };
        return $modalProvider;
    });
    angular.module("kt.ui.navigation", []).directive("ktNavigation", function($location) {
        "use strict";
        return {
            restrict: "A",
            link: function postLink(scope, element, attrs, controller) {
                element.addClass("kt-navigation");
                scope.$watch(function() {
                    return $location.path();
                }, function(newValue, oldValue) {
                    $("li[data-match-route]", element).each(function(k, li) {
                        var $li = angular.element(li), pattern = $li.attr("data-match-route"), regexp = new RegExp("^" + pattern + "$", [ "i" ]);
                        if (regexp.test(newValue)) {
                            $li.addClass("active");
                        } else {
                            $li.removeClass("active");
                        }
                    });
                });
            }
        };
    }).directive("ktDropdown", function($parse, $compile, $timeout) {
        var buildTemplate = function(items, ul, width) {
            if (!ul) ul = [ '<ul class="dropdown-menu" role="menu" aria-labelledby="drop1"><div class="white-line" style="width:' + width + 'px; border: 1px solid #fff; position: absolute; top: -1px;"></div>', "</ul>" ];
            angular.forEach(items, function(item, index) {
                if (item.divider) return ul.splice(index + 1, 0, '<li class="divider"></li>');
                var li = "<li" + (item.submenu && item.submenu.length ? ' class="dropdown-submenu"' : "") + ">" + '<a tabindex="-1" ng-href="' + (item.href || "") + '"' + (item.click ? '" ng-click="' + item.click + '"' : "") + (item.target ? '" target="' + item.target + '"' : "") + (item.method ? '" data-method="' + item.method + '"' : "") + ">" + (item.text || "") + "</a>";
                if (item.submenu && item.submenu.length) li += buildTemplate(item.submenu).join("\n");
                li += "</li>";
                ul.splice(index + 1, 0, li);
            });
            return ul;
        };
        return {
            restrict: "EA",
            scope: true,
            link: function postLink(scope, iElement, iAttrs) {
                var getter = $parse(iAttrs.ktDropdown), items = getter(scope);
                $timeout(function() {
                    if (!angular.isArray(items)) {}
                    var dropdown = angular.element(buildTemplate(items, null, $(iElement).outerWidth()).join(""));
                    dropdown.insertAfter(iElement);
                    $compile(iElement.next("ul.dropdown-menu"))(scope);
                    $(iElement).on("click", function(a, b) {
                        $(iElement).next().find(".white-line").width($(iElement.get()).outerWidth() - 4);
                    });
                });
                iElement.addClass("dropdown-toggle").attr("data-toggle", "dropdown");
            }
        };
    });
    angular.module("kt.ui.popover", [ "kt.ui.tooltip" ]).directive("ktPopoverPopup", function() {
        return {
            restrict: "EA",
            replace: true,
            scope: {
                title: "@",
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            template: '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }"> \r\n							  <div class="arrow"></div> \r\n							  <div class="popover-inner"> \r\n						      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3> \r\n						      <div class="popover-content" ng-bind="content"></div> \r\n							  </div> \r\n							</div>'
        };
    }).directive("ktPopover", [ "$compile", "$timeout", "$parse", "$window", "$tooltip", function($compile, $timeout, $parse, $window, $tooltip) {
        return $tooltip("ktPopover", "ktPopover", "click");
    } ]);
    angular.module("kt.ui.progressbar", [ "kt.ui.service.transition" ]).constant("progressConfig", {
        animate: true,
        autoType: false,
        stackedTypes: [ "success", "info", "warning", "danger" ]
    }).controller("ProgressBarController", [ "$scope", "$attrs", "progressConfig", function($scope, $attrs, progressConfig) {
        var animate = angular.isDefined($attrs.animate) ? $scope.$eval($attrs.animate) : progressConfig.animate;
        var autoType = angular.isDefined($attrs.autoType) ? $scope.$eval($attrs.autoType) : progressConfig.autoType;
        var stackedTypes = angular.isDefined($attrs.stackedTypes) ? $scope.$eval("[" + $attrs.stackedTypes + "]") : progressConfig.stackedTypes;
        this.makeBar = function(newBar, oldBar, index) {
            var newValue = angular.isObject(newBar) ? newBar.value : newBar || 0;
            var oldValue = angular.isObject(oldBar) ? oldBar.value : oldBar || 0;
            var type = angular.isObject(newBar) && angular.isDefined(newBar.type) ? newBar.type : autoType ? getStackedType(index || 0) : null;
            return {
                from: oldValue,
                to: newValue,
                type: type,
                animate: animate
            };
        };
        function getStackedType(index) {
            return stackedTypes[index];
        }
        this.addBar = function(bar) {
            $scope.bars.push(bar);
            $scope.totalPercent += bar.to;
        };
        this.clearBars = function() {
            $scope.bars = [];
            $scope.totalPercent = 0;
        };
        this.clearBars();
    } ]).directive("progress", function() {
        return {
            restrict: "EA",
            replace: true,
            controller: "ProgressBarController",
            scope: {
                value: "=",
                onFull: "&",
                onEmpty: "&"
            },
            template: '<div class="progress">\r\n        <progressbar ng-repeat="bar in bars" width="bar.to" old="bar.from" animate="bar.animate" type="bar.type">\r\n        </progressbar>\r\n        </div>',
            link: function(scope, element, attrs, controller) {
                scope.$watch("value", function(newValue, oldValue) {
                    controller.clearBars();
                    if (angular.isArray(newValue)) {
                        for (var i = 0, n = newValue.length; i < n; i++) {
                            controller.addBar(controller.makeBar(newValue[i], oldValue[i], i));
                        }
                    } else {
                        controller.addBar(controller.makeBar(newValue, oldValue));
                    }
                }, true);
                scope.$watch("totalPercent", function(value) {
                    if (value >= 100) {
                        scope.onFull();
                    } else if (value <= 0) {
                        scope.onEmpty();
                    }
                }, true);
            }
        };
    }).directive("progressbar", [ "$transition", function($transition) {
        return {
            restrict: "EA",
            replace: true,
            scope: {
                width: "=",
                old: "=",
                type: "=",
                animate: "="
            },
            template: "<div class='bar' ng-class='type && \"bar-\" + type'></div>",
            link: function(scope, element) {
                scope.$watch("width", function(value) {
                    if (scope.animate) {
                        element.css("width", scope.old + "%");
                        $transition(element, {
                            width: value + "%"
                        });
                    } else {
                        element.css("width", value + "%");
                    }
                });
            }
        };
    } ]);
    angular.module("kt.ui.select", []).value("uiSelectConfig", {
        placeholder: "선택하세요."
    }).directive("ktSelect", [ "uiSelectConfig", "$timeout", function(uiSelectConfig, $timeout) {
        var options = {};
        if (uiSelectConfig) {
            angular.extend(options, uiSelectConfig);
        }
        return {
            require: "?ngModel",
            compile: function(tElm, tAttrs) {
                var watch, repeatOption, repeatAttr, isSelect = tElm.is("select"), isMultiple = tAttrs.multiple !== undefined;
                if (tElm.is("select")) {
                    repeatOption = tElm.find("option[ng-repeat], option[data-ng-repeat]");
                    if (repeatOption.length) {
                        repeatAttr = repeatOption.attr("ng-repeat") || repeatOption.attr("data-ng-repeat");
                        watch = jQuery.trim(repeatAttr.split("|")[0]).split(" ").pop();
                    }
                }
                return function(scope, elm, attrs, controller) {
                    var opts = angular.extend({}, options, scope.$eval(attrs.ktSelect));
                    if (isSelect) {
                        delete opts.multiple;
                        delete opts.initSelection;
                    } else if (isMultiple) {
                        opts.multiple = true;
                    }
                    if (controller) {
                        controller.$render = function() {
                            if (isSelect) {
                                elm.select2("val", controller.$viewValue);
                            } else {
                                if (isMultiple) {
                                    if (!controller.$viewValue) {
                                        elm.select2("data", []);
                                    } else if (angular.isArray(controller.$viewValue)) {
                                        elm.select2("data", controller.$viewValue);
                                    } else {
                                        elm.select2("val", controller.$viewValue);
                                    }
                                } else {
                                    if (angular.isObject(controller.$viewValue)) {
                                        elm.select2("data", controller.$viewValue);
                                    } else if (!controller.$viewValue) {
                                        elm.select2("data", null);
                                    } else {
                                        elm.select2("val", controller.$viewValue);
                                    }
                                }
                            }
                        };
                        if (watch) {
                            scope.$watch(watch, function(newVal, oldVal, scope) {
                                if (!newVal) return;
                                $timeout(function() {
                                    elm.select2("val", controller.$viewValue);
                                    elm.trigger("change");
                                });
                            });
                        }
                        controller.$parsers.push(function(value) {
                            var div = elm.prev();
                            div.toggleClass("ng-invalid", !controller.$valid).toggleClass("ng-valid", controller.$valid).toggleClass("ng-invalid-required", !controller.$valid).toggleClass("ng-valid-required", controller.$valid).toggleClass("ng-dirty", controller.$dirty).toggleClass("ng-pristine", controller.$pristine);
                            return value;
                        });
                        if (!isSelect) {
                            elm.bind("change", function() {
                                if (scope.$$phase) return;
                                scope.$apply(function() {
                                    controller.$setViewValue(elm.select2("data"));
                                });
                            });
                            if (opts.initSelection) {
                                var initSelection = opts.initSelection;
                                opts.initSelection = function(element, callback) {
                                    initSelection(element, function(value) {
                                        controller.$setViewValue(value);
                                        callback(value);
                                    });
                                };
                            }
                        }
                    }
                    attrs.$observe("disabled", function(value) {
                        elm.select2("enable", !value);
                    });
                    attrs.$observe("readonly", function(value) {
                        elm.select2("readonly", !!value);
                    });
                    if (attrs.ngMultiple) {
                        scope.$watch(attrs.ngMultiple, function(newVal) {
                            elm.select2(opts);
                        });
                    }
                    $timeout(function() {
                        elm.select2(opts);
                        elm.val(controller.$viewValue);
                        controller.$render();
                        if (!opts.initSelection && !isSelect) controller.$setViewValue(elm.select2("data"));
                    });
                };
            }
        };
    } ]);
    angular.module("kt.ui.tab", []).controller("TabsController", [ "$scope", "$element", function($scope, $element) {
        var panes = $scope.panes = [];
        this.select = $scope.select = function selectPane(pane) {
            angular.forEach(panes, function(pane) {
                pane.selected = false;
            });
            pane.selected = true;
        };
        this.addPane = function addPane(pane) {
            if (!panes.length) {
                $scope.select(pane);
            }
            panes.push(pane);
        };
        this.removePane = function removePane(pane) {
            var index = panes.indexOf(pane);
            panes.splice(index, 1);
            if (pane.selected && panes.length > 0) {
                $scope.select(panes[index < panes.length ? index : index - 1]);
            }
        };
    } ]).directive("ktTab", function() {
        return {
            restrict: "EA",
            transclude: true,
            scope: {},
            controller: "TabsController",
            template: '<div class="tabbable"> \r\n                <ul class="nav nav-tabs"> \r\n                  <li ng-repeat="pane in panes" ng-class="{active:pane.selected}"> \r\n                    <a ng-click="select(pane)">{{pane.heading}}</a> \r\n                  </li> \r\n                </ul> \r\n                <div class="tab-content" ng-transclude></div> \r\n              </div>',
            replace: true
        };
    }).directive("ktPanel", [ "$parse", function($parse) {
        return {
            require: "^ktTab",
            restrict: "EA",
            transclude: true,
            scope: {
                heading: "@",
                onSelect: "&select",
                onDeselect: "&deselect"
            },
            link: function(scope, element, attrs, tabsCtrl) {
                var getSelected, setSelected;
                scope.selected = false;
                if (attrs.active) {
                    getSelected = $parse(attrs.active);
                    setSelected = getSelected.assign;
                    scope.$watch(function watchSelected() {
                        return getSelected(scope.$parent);
                    }, function updateSelected(value) {
                        scope.selected = value;
                    });
                    scope.selected = getSelected ? getSelected(scope.$parent) : false;
                }
                scope.$watch("selected", function(selected) {
                    if (selected) {
                        tabsCtrl.select(scope);
                        scope.onSelect();
                    }
                    if (setSelected) {
                        setSelected(scope.$parent, selected);
                    }
                });
                tabsCtrl.addPane(scope);
                scope.$on("$destroy", function() {
                    tabsCtrl.removePane(scope);
                });
            },
            template: '<div class="tab-pane" ng-class="{active: selected}" ng-show="selected" ng-transclude></div>',
            replace: true
        };
    } ]);
    angular.module("kt.ui.table.pagination", []).constant("tablePaginationConfig", {
        boundaryLinks: false,
        directionLinks: true,
        firstText: "First",
        previousText: "Previous",
        nextText: "Next",
        lastText: "Last"
    }).directive("pagination", [ "tablePaginationConfig", function(paginationConfig) {
        return {
            restrict: "EA",
            scope: {
                numPages: "=",
                currentPage: "=",
                maxSize: "=",
                onSelectPage: "&"
            },
            template: '<nav class="ngPaging"><ul class="pagination">' + "<li ng-repeat=\"page in pages\" ng-class=\"{active: page.active, disabled: page.disabled, First: page.text == 'First', Previous: page.text == 'Previous', Next: page.text == 'Next', Last: page.text == 'Last'}\"><a ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>" + "</ul>" + "</nav>",
            replace: true,
            link: function(scope, element, attrs) {
                var boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
                var directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$eval(attrs.directionLinks) : paginationConfig.directionLinks;
                var firstText = angular.isDefined(attrs.firstText) ? attrs.firstText : paginationConfig.firstText;
                var previousText = angular.isDefined(attrs.previousText) ? attrs.previousText : paginationConfig.previousText;
                var nextText = angular.isDefined(attrs.nextText) ? attrs.nextText : paginationConfig.nextText;
                var lastText = angular.isDefined(attrs.lastText) ? attrs.lastText : paginationConfig.lastText;
                function makePage(number, text, isActive, isDisabled) {
                    return {
                        number: number,
                        text: text,
                        active: isActive,
                        disabled: isDisabled
                    };
                }
                scope.$watch("numPages + currentPage + maxSize", function() {
                    scope.pages = [];
                    var startPage = 1, endPage = scope.numPages;
                    if (scope.maxSize && scope.maxSize < scope.numPages) {
                        startPage = Math.max(scope.currentPage - Math.floor(scope.maxSize / 2), 1);
                        endPage = startPage + scope.maxSize - 1;
                        if (endPage > scope.numPages) {
                            endPage = scope.numPages;
                            startPage = endPage - scope.maxSize + 1;
                        }
                    }
                    for (var number = startPage; number <= endPage; number++) {
                        var page = makePage(number, number, scope.isActive(number), false);
                        scope.pages.push(page);
                    }
                    if (directionLinks) {
                        var previousPage = makePage(scope.currentPage - 1, previousText, false, scope.noPrevious());
                        scope.pages.unshift(previousPage);
                        var nextPage = makePage(scope.currentPage + 1, nextText, false, scope.noNext());
                        scope.pages.push(nextPage);
                    }
                    if (boundaryLinks) {
                        var firstPage = makePage(1, firstText, false, scope.noPrevious());
                        scope.pages.unshift(firstPage);
                        var lastPage = makePage(scope.numPages, lastText, false, scope.noNext());
                        scope.pages.push(lastPage);
                    }
                    if (scope.currentPage > scope.numPages) {
                        scope.selectPage(scope.numPages);
                    }
                });
                scope.noPrevious = function() {
                    return scope.currentPage === 1;
                };
                scope.noNext = function() {
                    return scope.currentPage === scope.numPages;
                };
                scope.isActive = function(page) {
                    return scope.currentPage === page;
                };
                scope.selectPage = function(page) {
                    if (!scope.isActive(page) && page > 0 && page <= scope.numPages) {
                        scope.currentPage = page;
                        scope.onSelectPage({
                            page: page
                        });
                    }
                };
            }
        };
    } ]);
    angular.module("kt.ui.table", []).directive("ktTable", [ "$compile", "$q", "$parse", "$http", "ktTableParams", function($compile, $q, $parse, $http, ktTableParams) {
        "use strict";
        return {
            restrict: "A",
            priority: 1001,
            scope: true,
            controller: [ "$scope", "$timeout", function($scope, $timeout) {
                var updateParams;
                $scope.params = $scope.params || {
                    page: 1,
                    count: 10
                };
                $scope.$watch("params.filter", function(value) {
                    if ($scope.params.$liveFiltering) {
                        return updateParams(value);
                    }
                }, true);
                updateParams = function(newParams) {
                    newParams = angular.extend($scope.params, newParams);
                    $scope.paramsModel.assign($scope.$parent, new ktTableParams(newParams));
                    return $scope.params = angular.copy(newParams);
                };
                $scope.goToPage = function(page) {
                    if (page > 0 && $scope.params.page !== page && $scope.params.count * (page - 1) <= $scope.params.total) {
                        return updateParams({
                            page: page
                        });
                    }
                };
                $scope.changeCount = function(count) {
                    return updateParams({
                        page: 1,
                        count: count
                    });
                };
                $scope.doFilter = function() {
                    return updateParams({
                        page: 1
                    });
                };
                return $scope.sortBy = function(column) {
                    var sorting, sortingParams;
                    if (!column.sortable) {
                        return;
                    }
                    sorting = $scope.params.sorting && $scope.params.sorting[column.sortable] && $scope.params.sorting[column.sortable] === "desc";
                    sortingParams = {};
                    sortingParams[column.sortable] = sorting ? "asc" : "desc";
                    return updateParams({
                        sorting: sortingParams
                    });
                };
            } ],
            compile: function(element, attrs) {
                var columns, i;
                i = 0;
                columns = [];
                angular.forEach(element.find("tr[ng-repeat] td"), function(item) {
                    var el;
                    el = $(item);
                    return columns.push({
                        id: i++,
                        title: el.attr("title") || el.text(),
                        sortable: el.attr("sortable") ? el.attr("sortable") : false,
                        filter: el.attr("filter") ? $parse(el.attr("filter"))() : false,
                        filterData: el.attr("filter-data") ? el.attr("filter-data") : null
                    });
                });
                return function(scope, element, attrs) {
                    var generatePages, headerTemplate, paginationTemplate;
                    scope.columns = columns;
                    generatePages = function(currentPage, totalItems, pageSize) {
                        var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
                        maxBlocks = 11;
                        pages = [];
                        numPages = Math.ceil(totalItems / pageSize);
                        if (numPages > 1) {
                            pages.push({
                                type: "prev",
                                number: Math.max(1, currentPage - 1),
                                active: currentPage > 1
                            });
                            pages.push({
                                type: "first",
                                number: 1,
                                active: currentPage > 1
                            });
                            maxPivotPages = Math.round((maxBlocks - 5) / 2);
                            minPage = Math.max(2, currentPage - maxPivotPages);
                            maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                            minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                            i = minPage;
                            while (i <= maxPage) {
                                if (i === minPage && i !== 2 || i === maxPage && i !== numPages - 1) {
                                    pages.push({
                                        type: "more"
                                    });
                                } else {
                                    pages.push({
                                        type: "page",
                                        number: i,
                                        active: currentPage !== i
                                    });
                                }
                                i++;
                            }
                            pages.push({
                                type: "last",
                                number: numPages,
                                active: currentPage !== numPages
                            });
                            pages.push({
                                type: "next",
                                number: Math.min(numPages, currentPage + 1),
                                active: currentPage < numPages
                            });
                        }
                        return pages;
                    };
                    scope.$parent.$watch(attrs.ktTable, function(params) {
                        if (angular.isUndefined(params)) {
                            return;
                        }
                        scope.paramsModel = $parse(attrs.ktTable);
                        scope.pages = generatePages(params.page, params.total, params.count);
                        return scope.params = angular.copy(params);
                    }, true);
                    if (attrs.showFilter) {
                        scope.$parent.$watch(attrs.showFilter, function(value) {
                            return scope.show_filter = value;
                        });
                    }
                    angular.forEach(columns, function(column) {
                        var promise;
                        if (!column.filterData) {
                            return;
                        }
                        promise = $parse(column.filterData)(scope, {
                            $column: column
                        });
                        if (!(angular.isObject(promise) && angular.isFunction(promise.then))) {
                            throw new Error("Function " + column.filterData + " must be promise");
                        }
                        delete column["filterData"];
                        return promise.then(function(data) {
                            if (!angular.isArray(data)) {
                                data = [];
                            }
                            data.unshift({
                                title: "-",
                                id: ""
                            });
                            return column.data = data;
                        });
                    });
                    if (!element.hasClass("kt-table")) {
                        scope.templates = {
                            header: attrs.templateHeader ? attrs.templateHeader : "tmpl/kt-table/header.html",
                            pagination: attrs.templatePagination ? attrs.templatePagination : "tmpl/kt-table/pager.html"
                        };
                        headerTemplate = $compile('<thead ng-include="templates.header"></thead>')(scope);
                        element.filter("thead").remove();
                        element.prepend(headerTemplate).addClass("kt-table");
                        return element;
                    }
                };
            }
        };
    } ]);
    angular.module("kt.ui.table").factory("ktTableParams", function() {
        var __hasProp = {}.hasOwnProperty;
        var isNumber, ktTableParams;
        isNumber = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        ktTableParams = function(data) {
            var ignoreFields, key, lastKey, name, params, v, value, _i, _len, _ref;
            ignoreFields = [ "total", "counts" ];
            this.page = 1;
            this.count = 1;
            this.counts = [ 10, 25, 50, 100 ];
            this.filter = {};
            this.sorting = {};
            for (key in data) {
                value = data[key];
                if (key.indexOf("[") >= 0) {
                    params = key.split(/\[(.*)\]/);
                    lastKey = "";
                    _ref = params.reverse();
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        name = _ref[_i];
                        if (name !== "") {
                            v = value;
                            value = {};
                            value[lastKey = name] = isNumber(v) ? parseFloat(v) : v;
                        }
                    }
                    this[lastKey] = angular.extend(this[lastKey] || {}, value[lastKey]);
                } else {
                    this[key] = isNumber(data[key]) ? parseFloat(data[key]) : data[key];
                }
            }
            this.orderBy = function() {
                var column, direction, sorting, _ref1;
                sorting = [];
                _ref1 = this.sorting;
                for (column in _ref1) {
                    if (!__hasProp.call(_ref1, column)) continue;
                    direction = _ref1[column];
                    sorting.push((direction === "asc" ? "+" : "-") + column);
                }
                return sorting;
            };
            this.url = function(asString) {
                var item, pairs, pname, subkey;
                asString = asString || false;
                pairs = asString ? [] : {};
                for (var key in this) {
                    if (this.hasOwnProperty(key)) {
                        if (ignoreFields.indexOf(key) >= 0) {
                            continue;
                        }
                        item = this[key];
                        name = encodeURIComponent(key);
                        if (typeof item === "object") {
                            for (subkey in item) {
                                if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                    pname = name + "[" + encodeURIComponent(subkey) + "]";
                                    if (asString) {
                                        pairs.push(pname + "=" + encodeURIComponent(item[subkey]));
                                    } else {
                                        pairs[pname] = encodeURIComponent(item[subkey]);
                                    }
                                }
                            }
                        } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                            if (asString) {
                                pairs.push(name + "=" + encodeURIComponent(item));
                            } else {
                                pairs[name] = encodeURIComponent(item);
                            }
                        }
                    }
                }
                return pairs;
            };
            return this;
        };
        return ktTableParams;
    });
    angular.module("kt.ui.textEditor", []).directive("ktTextEditor", function() {
        return {
            scope: {
                ktTextEditor: "="
            },
            restrict: "ACM",
            link: function(scope, element, attrs, ngModelCtrl) {
                var editor = CKEDITOR.replace(attrs.id);
                editor.setData(scope.ktTextEditor);
                editor.on("change", function() {
                    scope.$apply(function() {
                        scope.ktTextEditor = editor.getData();
                    });
                });
            }
        };
    });
    angular.module("kt.ui.tooltip", []).factory("$position", [ "$document", "$window", function($document, $window) {
        function getStyle(el, cssprop) {
            if (el.currentStyle) {
                return el.currentStyle[cssprop];
            } else if ($window.getComputedStyle) {
                return $window.getComputedStyle(el)[cssprop];
            }
            return el.style[cssprop];
        }
        function isStaticPositioned(element) {
            return (getStyle(element, "position") || "static") === "static";
        }
        var parentOffsetEl = function(element) {
            var docDomEl = $document[0];
            var offsetParent = element.offsetParent || docDomEl;
            while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docDomEl;
        };
        return {
            position: function(element) {
                var elBCR = this.offset(element);
                var offsetParentBCR = {
                    top: 0,
                    left: 0
                };
                var offsetParentEl = parentOffsetEl(element[0]);
                if (offsetParentEl != $document[0]) {
                    offsetParentBCR = this.offset(angular.element(offsetParentEl));
                    offsetParentBCR.top += offsetParentEl.clientTop;
                    offsetParentBCR.left += offsetParentEl.clientLeft;
                }
                return {
                    width: element.prop("offsetWidth"),
                    height: element.prop("offsetHeight"),
                    top: elBCR.top - offsetParentBCR.top,
                    left: elBCR.left - offsetParentBCR.left
                };
            },
            offset: function(element) {
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: element.prop("offsetWidth"),
                    height: element.prop("offsetHeight"),
                    top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop),
                    left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft)
                };
            }
        };
    } ]).factory("$position", [ "$document", "$window", function($document, $window) {
        function getStyle(el, cssprop) {
            if (el.currentStyle) {
                return el.currentStyle[cssprop];
            } else if ($window.getComputedStyle) {
                return $window.getComputedStyle(el)[cssprop];
            }
            return el.style[cssprop];
        }
        function isStaticPositioned(element) {
            return (getStyle(element, "position") || "static") === "static";
        }
        var parentOffsetEl = function(element) {
            var docDomEl = $document[0];
            var offsetParent = element.offsetParent || docDomEl;
            while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docDomEl;
        };
        return {
            position: function(element) {
                var elBCR = this.offset(element);
                var offsetParentBCR = {
                    top: 0,
                    left: 0
                };
                var offsetParentEl = parentOffsetEl(element[0]);
                if (offsetParentEl != $document[0]) {
                    offsetParentBCR = this.offset(angular.element(offsetParentEl));
                    offsetParentBCR.top += offsetParentEl.clientTop;
                    offsetParentBCR.left += offsetParentEl.clientLeft;
                }
                return {
                    width: element.prop("offsetWidth"),
                    height: element.prop("offsetHeight"),
                    top: elBCR.top - offsetParentBCR.top,
                    left: elBCR.left - offsetParentBCR.left
                };
            },
            offset: function(element) {
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: element.prop("offsetWidth"),
                    height: element.prop("offsetHeight"),
                    top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop),
                    left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft)
                };
            }
        };
    } ]).provider("$tooltip", function() {
        var defaultOptions = {
            placement: "top",
            animation: true,
            popupDelay: 0
        };
        var triggerMap = {
            mouseenter: "mouseleave",
            click: "click",
            focus: "blur"
        };
        var globalOptions = {};
        this.options = function(value) {
            angular.extend(globalOptions, value);
        };
        function snake_case(name) {
            var regexp = /[A-Z]/g;
            var separator = "-";
            return name.replace(regexp, function(letter, pos) {
                return (pos ? separator : "") + letter.toLowerCase();
            });
        }
        this.$get = [ "$window", "$compile", "$timeout", "$parse", "$document", "$position", function($window, $compile, $timeout, $parse, $document, $position) {
            return function $tooltip(type, prefix, defaultTriggerShow) {
                var options = angular.extend({}, defaultOptions, globalOptions);
                function setTriggers(trigger) {
                    var show, hide;
                    show = trigger || options.trigger || defaultTriggerShow;
                    if (angular.isDefined(options.trigger)) {
                        hide = triggerMap[options.trigger] || show;
                    } else {
                        hide = triggerMap[show] || show;
                    }
                    return {
                        show: show,
                        hide: hide
                    };
                }
                var directiveName = snake_case(type);
                var triggers = setTriggers(undefined);
                var template = "<" + directiveName + "-popup " + 'title="{{tt_title}}" ' + 'content="{{tt_content}}" ' + 'placement="{{tt_placement}}" ' + 'animation="tt_animation()" ' + 'is-open="tt_isOpen"' + ">" + "</" + directiveName + "-popup>";
                return {
                    restrict: "EA",
                    scope: true,
                    link: function link(scope, element, attrs) {
                        var tooltip = $compile(template)(scope);
                        var transitionTimeout;
                        var popupTimeout;
                        var $body;
                        scope.tt_isOpen = false;
                        function toggleTooltipBind() {
                            if (!scope.tt_isOpen) {
                                showTooltipBind();
                            } else {
                                hideTooltipBind();
                            }
                        }
                        function showTooltipBind() {
                            if (scope.tt_popupDelay) {
                                popupTimeout = $timeout(show, scope.tt_popupDelay);
                            } else {
                                scope.$apply(show);
                            }
                        }
                        function hideTooltipBind() {
                            scope.$apply(function() {
                                hide();
                            });
                        }
                        function show() {
                            var position, ttWidth, ttHeight, ttPosition;
                            if (!scope.tt_content) {
                                return;
                            }
                            if (transitionTimeout) {
                                $timeout.cancel(transitionTimeout);
                            }
                            tooltip.css({
                                top: 0,
                                left: 0,
                                display: "block"
                            });
                            if (options.appendToBody) {
                                $body = $body || $document.find("body");
                                $body.append(tooltip);
                            } else {
                                element.after(tooltip);
                            }
                            position = $position.position(element);
                            ttWidth = tooltip.prop("offsetWidth");
                            ttHeight = tooltip.prop("offsetHeight");
                            switch (scope.tt_placement) {
                              case "right":
                                ttPosition = {
                                    top: position.top + position.height / 2 - ttHeight / 2 + "px",
                                    left: position.left + position.width + "px"
                                };
                                break;

                              case "bottom":
                                ttPosition = {
                                    top: position.top + position.height + "px",
                                    left: position.left + position.width / 2 - ttWidth / 2 + "px"
                                };
                                break;

                              case "left":
                                ttPosition = {
                                    top: position.top + position.height / 2 - ttHeight / 2 + "px",
                                    left: position.left - ttWidth + "px"
                                };
                                break;

                              default:
                                ttPosition = {
                                    top: position.top - ttHeight + "px",
                                    left: position.left + position.width / 2 - ttWidth / 2 + "px"
                                };
                                break;
                            }
                            tooltip.css(ttPosition);
                            scope.tt_isOpen = true;
                        }
                        function hide() {
                            scope.tt_isOpen = false;
                            $timeout.cancel(popupTimeout);
                            if (angular.isDefined(scope.tt_animation) && scope.tt_animation()) {
                                transitionTimeout = $timeout(function() {
                                    tooltip.remove();
                                }, 500);
                            } else {
                                tooltip.remove();
                            }
                        }
                        attrs.$observe(type, function(val) {
                            scope.tt_content = val;
                        });
                        attrs.$observe(prefix + "Title", function(val) {
                            scope.tt_title = val;
                        });
                        attrs.$observe(prefix + "Placement", function(val) {
                            scope.tt_placement = angular.isDefined(val) ? val : options.placement;
                        });
                        attrs.$observe(prefix + "Animation", function(val) {
                            scope.tt_animation = angular.isDefined(val) ? $parse(val) : function() {
                                return options.animation;
                            };
                        });
                        attrs.$observe(prefix + "PopupDelay", function(val) {
                            var delay = parseInt(val, 10);
                            scope.tt_popupDelay = !isNaN(delay) ? delay : options.popupDelay;
                        });
                        attrs.$observe(prefix + "Trigger", function(val) {
                            element.unbind(triggers.show);
                            element.unbind(triggers.hide);
                            triggers = setTriggers(val);
                            if (triggers.show === triggers.hide) {
                                element.bind(triggers.show, toggleTooltipBind);
                            } else {
                                element.bind(triggers.show, showTooltipBind);
                                element.bind(triggers.hide, hideTooltipBind);
                            }
                        });
                    }
                };
            };
        } ];
    }).directive("tooltipPopup", function() {
        return {
            restrict: "E",
            replace: true,
            scope: {
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            template: '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }"> \r\n	  <div class="tooltip-arrow"></div> \r\n	  <div class="tooltip-inner" ng-bind="content"></div> \r\n	</div>'
        };
    }).directive("tooltip", [ "$tooltip", function($tooltip) {
        return $tooltip("tooltip", "tooltip", "mouseenter");
    } ]).directive("tooltipHtmlUnsafePopup", function() {
        return {
            restrict: "E",
            replace: true,
            scope: {
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            template: '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }"> \r\n	  <div class="tooltip-arrow"></div> \r\n	  <div class="tooltip-inner" ng-bind-html-unsafe="content"></div> \r\n	</div>'
        };
    }).directive("tooltipHtmlUnsafe", [ "$tooltip", function($tooltip) {
        return $tooltip("tooltipHtmlUnsafe", "tooltip", "mouseenter");
    } ]);
    angular.module("kt.ui.tree", []).controller("treeCtrl", [ "$scope", "$element", function($scope, $element) {
        var previousTarget = null;
        var selectedModel = null;
        var previousSelect = null;
        var currentSelect = null;
        var initflag = true;
        var c = 0;
        $scope.idx = 0;
        $scope.setSelectedModel = function(data) {
            selectedModel = data;
            currentSelect = data;
            $scope.onSelect({
                selected: data
            });
            if (data.selected !== "true") {
                $scope.changeCss();
            }
        };
        $scope.toggle = function(treeData) {
            treeData.show = !treeData.show;
        };
        $scope.click = function(data, $event, selectable) {
            if ($.trim(selectable) == "false") {
                return;
            }
            var dataToPass = angular.copy(data, {});
            dataToPass = omitHash(dataToPass);
            $scope.ngModel = dataToPass;
            selectedModel.selected = false;
            selectedModel = data;
            $scope.onClick({
                clicked: dataToPass,
                $event: $event
            });
            if ($scope.ngModel !== undefined) {
                $scope.setSelectedModel(data);
            }
        };
        $scope.changeCss = function() {
            if (previousSelect === null) {
                if (!$scope.init) {
                    previousSelect = currentSelect;
                } else {
                    previousSelect = $scope.init;
                }
            }
            if (initflag && !$scope.init) {
                previousSelect = currentSelect;
                initflag = false;
            }
            $("#" + previousSelect.$$id).removeClass("kt-tree-clicked");
            $("#" + currentSelect.$$id).addClass("kt-tree-clicked");
            previousSelect = currentSelect;
        };
        function omitHash(data) {
            var hashOmittedData;
            hashOmittedData = _.omit(data, "$$hashKey");
            if (data.children.length > 0) angular.forEach(data.children, function(value, key) {
                data.children[key] = omitHash(value);
            });
            return hashOmittedData;
        }
        $scope.hover = function($event) {
            if (previousTarget !== null) $(previousTarget).removeClass("kt-tree-hovered");
            previousTarget = $event.currentTarget;
            $($event.currentTarget).addClass("kt-tree-hovered");
        };
        $scope.checkSelect = function(data) {
            var returnObj = {
                "kt-tree-clicked": data == $scope.init ? true : false
            };
            if (data.css) {
                returnObj[data.css] = true;
            }
            if (data.selected) {
                selectedModel = data;
                if (data.selected == $.trim("true")) returnObj["kt-tree-clicked"] = true;
            }
            return returnObj;
        };
        $scope.showChildren = function(treeData) {
            return treeData.show && treeData.children.length > 0;
        };
        $scope.isSelected = function(data) {
            var selected = false;
            if (angular.equals($scope.selected, data)) {
                selected = true;
            }
            return {
                selected: selected
            };
        };
        $scope.setId = function(data) {
            data.$$id = "tree" + $scope.idx++;
        };
        $scope.addClass = function(treeData, isLast) {
            var cssOpts = {
                "kt-tree-open": treeData.show,
                "kt-tree-closed": !treeData.show,
                "kt-tree-leaf": treeData.children.length > 0 ? false : true,
                "kt-tree-last": isLast
            };
            if (treeData.level) cssOpts["kt-tree-level-" + treeData.level] = true;
            return cssOpts;
        };
    } ]).directive("ktTree", function() {
        return {
            restrict: "EA",
            scope: {
                data: "=",
                onSelect: "&",
                onClick: "&",
                selectable: "="
            },
            controller: "treeCtrl",
            template: '<script type="text/ng-template"  id="tree_item_renderer.html"> \r\n				<ins ng-click="toggle(treeData)" class="kt-tree-icon kt-tree-ocl">&nbsp;</ins> \r\n				<a href="" ng-click="click(treeData, $event, selectable)" ng-mouseover="hover($event)" ng-class="checkSelect(treeData)" ng-init="setId(treeData)" id="{{treeData.$$id}}"> \r\n					<ins class="kt-tree-icon kt-tree-themeicon">&nbsp;</ins>{{treeData.text}} \r\n				</a> \r\n				<ul> \r\n					<li ng-repeat="treeData in treeData.children" ng-class="addClass(treeData, $last)" ng-include="\'tree_item_renderer.html\'"></li> \r\n				</ul> \r\n				</script> \r\n				<div class="kt-tree kt-tree-default"> \r\n				<ul class="unstyled">\r\n					<li ng-repeat="treeData in data" ng-class="addClass(treeData, $last)" ng-include="\'tree_item_renderer.html\'"></li>\r\n				</ul></div>',
            link: function($scope, element, attrs, treeCtrl) {
                $scope.$watch("ngModel", function(newValue, beforeValue) {
                    if (newValue) $scope.setSelectedModel(newValue);
                });
            }
        };
    });
})({}, function() {
    return this;
}());