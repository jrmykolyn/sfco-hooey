/**
 * Hooey is a JavaScript plugin for generating random
 * strings. Hooey supports upper and lower case
 * alphabetical characters, integers, and some
 * punctuation marks.
 * 
 * Hooey ships with default settings and a public API
 * that allows invoking scripts to quickly generate
 * random strings. By passing an options object to
 * Hooey's `getRandomString` method, an invoking
 * script can easily customize the returned values.
 *
 * @summary   Hooey is a JavaScript plugin for generating random strings.
 *
 * @link      N/A
 * @since     0.0.1
 * @requires  N/A
 *
 * @author    Jesse R Mykolyn <jrmykolyn@gmail.com>
 */

try {
	(function() {
		/* -------------------------------------------------- */
		/* Private Vars */
		/* -------------------------------------------------- */
		var whitelist = {
			alpha_lower: 'abcdefghijklmnopqrstuvwxyz',
			alpha_upper: 'ABCDEFGHIJKLMNOPRSTUVXYZ',
			nums: '1234567890',
			punc: '-_!?'
		};


		/* -------------------------------------------------- */
		/* Private Functions */
		/* -------------------------------------------------- */
		function getRandomString(opts) {
			// Re-assign `opts` or set to empty obj.
			opts = opts || {};

			// Initialize required vars. from rcvd. `opts`, fallback to defaults.
			var count = opts.count || 1,
				length = opts.length || 10,
				exclude = opts.exclude || [],
				prepend = opts.prepend || '',
				append = opts.append || '',
				allowOverflow = opts.allowOverflow || false;

			// Initialize 'return'-related vars.
			var output = [],
				string = '',
				whitelist_clone = Object.assign({}, whitelist);

			do {
				// If conflict between `length` && `prepend`/`append`, break out of loop.
				if (!allowOverflow && getLengthConflict(length, [prepend, append])) {
					break;
				}

				// Remove 'excluded' keys (character sets) from `whitelist_clone`.
				try {
					exclude.forEach(function(el, i, arr) {
						if (whitelist_clone[el]) { delete whitelist_clone[el]; }
					});
				} catch (error) {
					console.log('ERROR: Received invalid data type for `exclude` option.');
					console.log('Expected: ARRAY. Received:', (typeof exclude).toUpperCase());
				}

				// Build random string array (`output`).
				for (var i = 0, x = count; i < x; i++) {
					string = buildRandomString(length, whitelist_clone);
					string = prependString(string, prepend, allowOverflow);
					string = appendString(string, append, allowOverflow);

					output.push(string);
				}

				// Return `output`.
				if (count > 1) {
					return output;
				} else {
					return output.join('');
				}
			} while (0);

			// Return `null` in case of error or conflict between specified options.
			return null;
		}


		function buildRandomString(length, whitelistObj) {
			var key_pos,
				key,
				char_pos,
				string = '';

			for (var j = 0, y = length; j < y; j++) {
				key_pos = Math.floor(Math.random()*Object.keys(whitelistObj).length);
				key = Object.keys(whitelistObj)[key_pos];

				char_pos = Math.floor(Math.random()*whitelistObj[key].length);

				string += whitelistObj[key].charAt(char_pos);
			}

			// Update `string` and add to `output` arr.
			return string;
		}


		function prependString(string, prepend, allowOverflow) {
			prepend = prepend || '';
			allowOverflow = allowOverflow || false;

			if (!allowOverflow) { 
				string = string.substring(prepend.length);
			}

			return prepend + string;
		}


		function appendString(string, append, allowOverflow) {
			append = append || '';
			allowOverflow = allowOverflow || false;

			if (!allowOverflow) {
				string = string.substring(0, (string.length - append.length));
			}

			return string + append;
		}


		function reduceStringArr(stringArr) {
			return stringArr.reduce(function(prev, curr, i, el) {
				if (typeof prev === 'string' && typeof curr === 'string') {
					return prev + curr;
				}
			});
		}


		function getLengthConflict(length, additionalCharsArr) {
			length = length || null;
			additionalCharsArr = Array.isArray(additionalCharsArr) ? additionalCharsArr : null;

			// If args. are valid, check for conflict. 
			if (length && additionalCharsArr) {
				var additionalChars = reduceStringArr(additionalCharsArr);

				if (additionalChars.length >= length) {
					console.log('ERROR: There is a conflict between options: length; prepend; append; allowOverflow.');
					return true;
				}

			// Else return `null` if args. are invalid.
			} else {
				return null
			}

			// Return `false` if no conflict exists.
			return false;
		}


		function runCollisionCheck(opts, force) {
			// Re-assign args. or fallback to defaults.
			opts = opts || {};
			force = force || false;

			// Declare all required/config. vars.
			var count = opts.count || 100;

			// Adjust `opts` to prevent conflict between `runCollisionCheck()` && `getRandomString()`.
			opts.count = 1;

			// Declare local vars.
			var MAX_SAFE_COUNT = 50000,
				found_collision = false,
				collection = [],
				string = '',
				i = 0;

			// Check `count` against `MAX_SAFE_COUNT`,
			// Display warning and `return` if invocation is not being forced.
			if (count >= MAX_SAFE_COUNT && force !== true) {
				console.log('WARNING:');
				console.log('Generating 50,000 or more strings may cause the browser to hang.');
				console.log('Re-invoke `sfcoHooey()` width `force` argument to contine.');

				return null;
			}

			// Generate strings and check for collisions.
			while (!found_collision && (i < count)) {
				string = getRandomString(opts);

				if (collection.indexOf(string) >= 0) {
					found_collision = string;
					break;
				}

				collection.push(string);
				i++
			}

			// Log results to console.
			if (found_collision) {
				console.log('FOUND COLLISION:', string); /// TEMP
			} else {
				console.log('Did not find a collision after ' + count + ' iterations.');
			}

			return found_collision;
		}


		/* -------------------------------------------------- */
		/* Public API */
		/* -------------------------------------------------- */
		window.sfcoHooey = function() {
			return {
				getRandomString: getRandomString,
				runCollisionCheck: runCollisionCheck
			};
		};
	})();
} catch (error) {
	console.log('ERROR: Failed to execute `sfcoHooey` due to the following:');
	console.log(error);
}