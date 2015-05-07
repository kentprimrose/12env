'use strict';

/* Verify the named item is present in process.env, and that it conforms
 * to any specified criteria. The item is created and/or modified in 
 * process.env for future use.
 *
 * Name of the item is required.
 *
 * Criteria may include the following:
 *   - a DEFAULT value (in case the named value is not found)
 *   - an ENUM list of acceptable values
 *   - a TYPE that the value must match (INTEGER or BOOLEAN)
 *
 * The named item is assumed to be required. If not found or defaulted,
 * an Error is thrown.
 *
 * For booleans, anything besides 'TRUE' (case insensitive) is considered false.
 */

var TYPES = [ 'INTEGER', 'BOOLEAN' ];

function config(name, criteria) {

    // Validate input parameters.
    if (name === undefined) {
        throw new ReferenceError('Must provide the name of the item to be verified.');
    }
    if (criteria === undefined) {
        criteria = {};
    }
    if (criteria.type !== undefined) {
        criteria.type = criteria.type.toUpperCase();
        if (TYPES.indexOf(criteria.type) < 0) {
            throw new Error('Can only check for the following types: ' + TYPES);
        }
    }

    // Just a shortcut to avoid repetitive typing and resolving.
    var env = process.env;

    // If the named item is not found, use the default.
    if (typeof env[name] === 'undefined') {

        // But if no default has been provided, throw an error.
        if (typeof criteria.default === 'undefined') {
            throw new Error(name + ' has not been defined');
        }

        env[name] = criteria.default;
    }

    // If there is an enumeration of valid values, be sure the value of the named item is OK.
    if (criteria.enum && criteria.enum.indexOf(env[name]) < 0) {
        throw new Error(name + ' is "' + env[name] + '" but must be in ' + criteria.enum);
    }

    // Verify (and convert) item type
    if (criteria.type === "INTEGER") {
        if (env[name] != parseInt(env[name], 10)) {
            throw new Error(env[name] + ' is not an INTEGER');
        }
        env[name] = parseInt(env[name], 10);
    } else if (criteria.type === "BOOLEAN") {
        env[name] = (env[name].toUpperCase() === 'TRUE');
    }

    return env[name];
}

module.exports = config;
