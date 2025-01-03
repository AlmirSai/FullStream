// Importing 'express-session' types to extend the session data structure
import 'express-session'

import type { SessionMetadata } from './session-metadata.types'

// Declaring module augmentation for 'express-session' to add custom session properties.
declare module 'express-session' {
	/**
	 * Extends the default session data type to include additional properties.
	 *
	 * `userId` - Stores the unique identifier of the logged-in user.
	 * `createdAt` - Stores the date and time when the session was created.
	 * Both properties are optional and may be set during the session initialization.
	 */
	interface SessionData {
		userId?: string // The ID of the user in the session.
		createdAt?: Date | string // The timestamp when the session was created.
		metadaat: SessionMetadata
	}
}
