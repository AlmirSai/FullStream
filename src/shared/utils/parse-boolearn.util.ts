// Function to parse a string or boolean to a boolean value
export function parseBoolearn(value: string): boolean {
	// If the value is already a boolean, return it directly
	if (typeof value === 'boolean') {
		return value
	}

	// If the value is a string, proceed to check its content
	if (typeof value === 'string') {
		// Convert the string to lowercase and trim whitespace for accurate comparison
		const lowerValue = value.trim().toLowerCase()

		// If the string is "true" (case-insensitive), return true
		if (lowerValue === 'true') {
			return true
		}

		// If the string is "false" (case-insensitive), return false
		if (lowerValue === 'false') {
			return false
		}
	}

	// If the value is neither a boolean nor a valid string representation of a boolean, throw an error
	throw new Error(`Failed to convert the value "${value}" to a boolean.`)
}
