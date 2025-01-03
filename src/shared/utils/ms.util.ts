// Constants for converting time units to milliseconds
const s = 1000 // 1 second = 1000 milliseconds
const m = s * 60 // 1 minute = 60 seconds
const h = m * 60 // 1 hour = 60 minutes
const d = h * 24 // 1 day = 24 hours
const w = d * 7 // 1 week = 7 days
const y = d * 365.25 // 1 year = 365.25 days (including leap years)

// Time unit types
type Unit =
	| 'Years'
	| 'Year'
	| 'Yrs'
	| 'Yr'
	| 'Y'
	| 'Weeks'
	| 'Week'
	| 'W'
	| 'Days'
	| 'Day'
	| 'D'
	| 'Hours'
	| 'Hour'
	| 'Hrs'
	| 'Hr'
	| 'H'
	| 'Minutes'
	| 'Minute'
	| 'Mins'
	| 'Min'
	| 'M'
	| 'Seconds'
	| 'Second'
	| 'Secs'
	| 'Sec'
	| 's'
	| 'Milliseconds'
	| 'Millisecond'
	| 'Msecs'
	| 'Msec'
	| 'Ms'

// Time unit type, accounting for both uppercase and lowercase variants
type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>

// A string type that can contain a number and a time unit
export type StringValue =
	| `${number}` // A number
	| `${number}${UnitAnyCase}` // A number followed by a time unit
	| `${number} ${UnitAnyCase}` // A number followed by a space and a time unit

// Function to convert a time string to milliseconds
export function ms(str: StringValue): number {
	// Validate the input: should be a string, non-empty, and no longer than 100 characters
	if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
		throw new Error(
			'Value provided to ms() must be a string with length between 1 and 99.'
		)
	}

	// Regular expression to match a number followed by an optional time unit
	const match =
		/^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
			str
		)

	// If there is no match, return NaN (invalid input)
	const groups = match?.groups as { value: string; type?: string } | undefined
	if (!groups) {
		return NaN
	}

	// Convert the extracted value to a float
	const n = parseFloat(groups.value)
	// Normalize the type to lowercase (to handle case insensitivity)
	const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>

	// Return the time in milliseconds based on the matched time unit
	switch (type) {
		case 'years':
		case 'year':
		case 'yrs':
		case 'yr':
		case 'y':
			return n * y // Convert years to milliseconds
		case 'weeks':
		case 'week':
		case 'w':
			return n * w // Convert weeks to milliseconds
		case 'days':
		case 'day':
		case 'd':
			return n * d // Convert days to milliseconds
		case 'hours':
		case 'hour':
		case 'hrs':
		case 'hr':
		case 'h':
			return n * h // Convert hours to milliseconds
		case 'minutes':
		case 'minute':
		case 'mins':
		case 'min':
		case 'm':
			return n * m // Convert minutes to milliseconds
		case 'seconds':
		case 'second':
		case 'secs':
		case 'sec':
		case 's':
			return n * s // Convert seconds to milliseconds
		case 'milliseconds':
		case 'millisecond':
		case 'msecs':
		case 'msec':
		case 'ms':
			return n // Return the value in milliseconds directly
		default:
			// If no valid unit is found, throw an error
			throw new Error(
				`Error: The time unit ${type} was recognized, but there is no corresponding case. Please check the entered data.`
			)
	}
}
