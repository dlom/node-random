# node-random [![Build Status](https://travis-ci.org/dlom/node-random.svg?branch=master)](https://travis-ci.org/dlom/node-random)

A [random.org](random.org) API client

## Install

`npm install node-random`

## Usage

The `options` argument is always optional.

`numbers` is an alias for `integers`

`sequence` is an alias for `sequences`

```javascript
var random = require("node-random");

random.integers(options, function(error, data) {
    // data is an array of numbers
});

random.sequences(options, function(error, quota) {
    // data is an array of numbers
});

random.strings(options, function(error, data) {
    // data is an array of strings
});

random.quota(options, function(error, data) {
    // data is an integer
});
```

## Options Defaults

### `random.integers`

See [here](http://www.random.org/clients/http/#integers) for the meanings (Option names are slightly different);

* `number` - `1`
* `minimum` - `0`
* `maximum` - `10000`
* `columns` - `1` (When this is more than 1, `data` is a 2D array -- rows by columns)
* `base` - `10`
* `random` - `"new"`

### `random.sequences`

See [here](http://www.random.org/clients/http/#sequences) for the meanings (Option names are slightly different);

* `minimum` - `0`
* `maximum` - `10`
* `columns` - `1` (When this is more than 1, `data` is a 2D array -- rows by columns)
* `base` - `10`
* `random` - `"new"`

### `random.strings`

See [here](http://www.random.org/clients/http/#strings) for the meanings (Option names are slightly different);

* `number` - `1`
* `length` - `10`
* `digits` - `true`
* `upper` - `true`
* `lower` - `true`
* `unique` - `false`
* `random` - `"new"`

### `random.quota`

See [here](http://www.random.org/clients/http/#quota) for the meanings (Option names are slightly different);

* `ip` - `""`

## Examples

```javascript
var random = require("node-random");

// Get 2 random numbers between 1 and 6
console.log("Rolling 2 dice");
random.numbers({
    "number": 2,
    "minimum": 1,
    "maximum": 6
}, function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
        console.log(d);
    });
});

// Get a random 3x3 grid and print the middle vertical row
random.sequences({
    "minimum": 1,
    "maximum": 9,
    "columns": 3
}, function(error, data) {
    if (error) throw error;
    console.log(data);
    console.log(data[0][1]);
    console.log(data[1][1]);
    console.log(data[2][1]);
});

// Get 20 different lowercase characters
random.strings({
    "length": 1,
    "number": 20,
    "upper": false,
    "digits": false
}, function(error, data) {
   if (error) throw error;
   console.log(data.join(" and "));
});

// Check your quota
random.quota(function(error, quota) {
    console.log("Remaining bytes: " + quota)
});
```

## Aliases

* `random.numbers` = `random.integers`
* `random.sequence` = `random.sequences`
* `random.string` = `random.strings`
