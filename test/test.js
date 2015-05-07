'use strict';

var config = require('../index');
var assert = require('chai').assert;

describe('Process environment', function() {

    it('should verify that a value has been set', function() {
        process.env.ENV = 'TEST';
        assert.doesNotThrow( function() {
            config('ENV');
        }, Error);
    });

    it('should complain if an expected value has NOT been set', function() {
        delete process.env.ENV;
        assert.throw( function() {
            config('ENV');
        }, Error);
    });

    it('should verify that found value is in set of allowed values', function() {
        process.env.ENV = 'TEST';
        assert.doesNotThrow( function() {
            config('ENV',  { enum: [ 'DEV', 'TEST', 'STAGE', 'PROD' ] });
        }, Error);
    });

    it('should complain if found value is NOT in set of allowed values', function() {
        process.env.ENV = 'BOGUS';
        assert.throw( function() {
            config('ENV',  { enum: [ 'DEV', 'TEST', 'STAGE', 'PROD' ] });
        }, Error);
    });

    it('should verify that defaulted value is in set of allowed values', function() {
        delete process.env.ENV;
        assert.doesNotThrow( function() {
            config('ENV',  { enum: [ 'DEV', 'TEST', 'STAGE', 'PROD' ], default: 'DEV' });
        }, Error);
    });

    it('should complain if defaulted value is NOT in set of allowed values', function() {
        delete process.env.ENV;
        assert.throw( function() {
            config('ENV',  { enum: [ 'DEV', 'TEST', 'STAGE', 'PROD' ], default: 'BOGUS' });
        }, Error);
    });

});

