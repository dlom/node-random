var expect = require("chai").expect;
var express = require("express");
var eightTrack = require("eight-track");

var random = require("../random.js");

describe("random", function() {
    before(function(done) {
        this.server = express().use(eightTrack({
            "url": random.endpoint,
            "fixtureDir": "test/cassettes"
        })).listen(1337, function() {
            random.endpoint = "http://localhost:1337";
            done();
        });
    });

    describe("integers", function() {
        it("should not return an array if there's only one number", function(done) {
            random.integers({
                "number": 1
            }, function(err, data) {
                if (err) return done(err);
                expect(data).to.not.be.an.instanceOf(Array);
                expect(data).to.be.a("number");
                expect(data).to.be.within(1, 10000);
                done();
            });
        });
        it("should return the right number of random integers between a range", function(done) {
            var lowerBound = 1;
            var upperBound = 5;
            var amount = 3;
            random.integers({
                "minimum": lowerBound,
                "maximum": upperBound,
                "number": amount
            }, function(err, data) {
                if (err) return done(err);
                expect(data).to.be.an.instanceOf(Array);
                expect(data).to.have.length(amount);
                data.forEach(function(row) {
                    expect(row).to.be.within(lowerBound, upperBound);
                });
                done();
            });
        });
        it("should return the right amount of random integers in the right amount of columns", function(done) {
            var total = 100;
            var columns = 5;
            random.integers({
                "number": total,
                "columns": columns
            },function(err, data) {
                if (err) return done(err);
                expect(data).to.have.length(total / columns);
                data.forEach(function(row) {
                    expect(row).to.have.length(columns);
                });
                done();
            });
        });
        it("should be capable of handling different bases", function(done) {
            var amount = 10;
            random.numbers({
                "base": 2,
                "number": amount
            }, function(err, data) {
                if (err) return done(err);
                expect(data).to.have.length(amount);
                data.forEach(function(value) {
                    expect(value).to.be.within(1, 10000);
                });
                done();
            })
        });
    });

    describe("sequences", function() {
        it("should return a sequence of numbers", function(done) {
            var minimum = 1;
            var maximum = 10;
            random.sequences({
                "minimum": minimum,
                "maximum": maximum
            }, function(err, data) {
                if (err) return done(err);
                expect(data).to.have.length((maximum - minimum) + 1);
                done();
            });
        });
        it("should return the right amount of numbers in the right amount of columns", function(done) {
            var minimum = 1;
            var maximum = 100;
            var columns = 5;
            random.sequences({
                "minimum": minimum,
                "maximum": maximum,
                "columns": columns
            },function(err, data) {
                if (err) return done(err);
                expect(data).to.have.length(((maximum - minimum) + 1) / columns);
                data.forEach(function(row) {
                    expect(row).to.have.length(columns);
                });
                done();
            });
        });
    });

    describe("strings", function() {
        it("should not return an array if there's only one string", function(done) {
            random.strings({
                "number": 1
            }, function(err, data) {
                if (err) return done(err);
                expect(data).to.not.be.an.instanceOf(Array);
                expect(data).to.be.a("string");
                expect(data).to.have.length(10);
                done();
            });
        });
        it("should return the right number of random strings with the right length", function(done) {
            var amount = 10;
            var length = 20;
            random.strings({
                "number": amount,
                "length": length
            }, function(err, data) {
                if (err) return done(err);
                expect(data).to.be.an.instanceOf(Array);
                expect(data).to.have.length(amount);
                data.forEach(function(row) {
                    expect(row).to.have.length(length);
                });
                done();
            });
        });
    });

    describe("quota", function() {
        it("should return the current quota", function(done) {
            random.quota(function(err, data) {
                if (err) return done(err);
                expect(data).to.be.a("number");
                done();
            });
        });
    });

    describe("aliases", function() {
        describe("numbers", function() {
            it("should be the same as integers", function() {
                expect(random.numbers).to.deep.equal(random.integers);
            });
        });
        describe("sequence", function() {
            it("should be the same as sequences", function() {
                expect(random.sequence).to.deep.equal(random.sequences);
            });
        });
        describe("string", function() {
            it("should be the same as strings", function() {
                expect(random.string).to.deep.equal(random.strings);
            });
        });
    });

    after(function(done) {
        this.server.close(done);
    });
});
