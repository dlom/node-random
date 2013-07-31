var request = require("request");
var qs = require("querystring");
var statusCodes = require("http").STATUS_CODES;

var random = module.exports = {};

var endpoint = "http://www.random.org/";

// Copied and modified from underscore source
var defaults = function(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
        if (source) {
            for (var prop in source) {
                if (obj[prop] == null) obj[prop] = source[prop];
            }
        }
    });
    return obj;
};

// Copied and modified from underscore source
var extend = function(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};

var randomMappings = {
    "number": "num",
    "minimum": "min",
    "maximum": "max",
    "columns": "col",
    "random": "rnd",
    "length": "len",
    "upper": "upperalpha",
    "lower": "loweralpha"
};

var onoffMappings = {
    "true": "on",
    "false": "off"
};

var remapKeys = function(obj, mappings) {
    var remapped = extend({}, obj);
    for (var prop in mappings) {
        if (obj[prop] != null) {
            remapped[mappings[prop]] = obj[prop];
            delete remapped[prop];
        }
    }
    return remapped;
};

var remapValues = function(obj, mappings) {
    var remapped = extend({}, obj);
    for (var prop in remapped) {
        key = JSON.stringify(obj[prop]);
        if (mappings.hasOwnProperty(key)) {
            remapped[prop] = mappings[key];
        }
    }
    return remapped;
};

var parseNumbers = function(raw, opts) {
    var data = raw.trim().split("\n").map(function(x) {
        return x.split("\t").map(function(y) {
            return parseInt(y, 10);
        });
    });
    return (opts.col === 1) ? data.map(function(x) { return x[0]; }) : data;
};

var parseStrings = function(raw, opts) {
    return raw.trim().split("\n");
};

var methods = {
    "integers": {
        "defaultOpts": {
            "number": 1,
            "minimum": 0,
            "maximum": 10000,
            "columns": 1,
            "base": 10,
            "random": "new"
        },
        "parse": parseNumbers
    },
    "numbers": "integers",
    "sequences": {
        "defaultOpts": {
            "minimum": 1,
            "maximum": 10,
            "columns": 1,
            "base": 10,
            "random": "new"
        },
        "parse": parseNumbers
    },
    "sequence": "sequences",
    "strings": {
        "defaultOpts": {
            "number": 1,
            "length": 10,
            "digits": true,
            "upper": true,
            "lower": true,
            "unique": false,
            "random": "new"
        },
        "parse": parseStrings
    }
}

for (var method in methods) {
    if (typeof methods[method] === "string") {
        random[method] = random[methods[method]];
    } else {
        random[method] = (function(method) {
            return function(opts, callback) {
                if (typeof opts === "function" && callback == null) {
                    callback = opts;
                    opts = {};
                } else if (opts == null) {
                    opts = {};
                }
                opts = defaults(opts, methods[method].defaultOpts);
                opts = extend(opts, { "format": "plain" });
                opts = remapKeys(opts, randomMappings);
                opts = remapValues(opts, onoffMappings);

                var url = endpoint + method + "?" + qs.stringify(opts);
                request.get(url, function(error, response, body) {
                    var data;
                    if (!error && response.statusCode !== 200) {
                        data = null;
                        if (response.statusCode === 503) {
                            errorMessage = "503: " + body.replace(/^Error: /g, "");;
                        } else {
                            errorMessage = response.statusCode + ": " + statusCodes[response.statusCode] + " (" + url + ")"
                        }
                        error = new Error(errorMessage);
                    } else {
                        data = methods[method].parse(body, opts);
                    }
                    callback && callback(error, data);
                });
            };
        })(method);
    }
}

random.quota = function(opts, callback) {
    var method = "quota";
    var defaultOpts = {
        "ip": ""
    };

    if (typeof opts === "function" && callback == null) {
        callback = opts;
        opts = {};
    } else if (opts == null) {
        opts = {};
    }
    opts = defaults(opts, defaultOpts);
    opts = extend(opts, { "format": "plain" });

    var url = endpoint + method + "?" + qs.stringify(opts);
    request.get(url, function(error, response, body) {
        var data;
        if (!error && response.statusCode !== 200) {
            data = null;
            if (response.statusCode === 503) {
                errorMessage = "503: " + body.replace(/^Error: /g, "");;
            } else {
                errorMessage = response.statusCode + ": " + statusCodes[response.statusCode] + " (" + url + ")"
            }
            error = new Error(errorMessage);
        } else {
            data = parseInt(body, 10);
        }
        callback && callback(error, data);
    });
};
