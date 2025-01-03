import { Module } from '@nestjs/common'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

/**
 * SessionModule is a module responsible for handling sessions in the application.
 * It includes the `SessionResolver` for processing GraphQL queries and mutations related to sessions
 * and the `SessionService` that contains the business logic for managing user sessions.
 */
@Module({
	// The providers array contains the classes that are responsible for handling the session logic.
	// `SessionResolver` processes GraphQL queries and mutations, while `SessionService` handles the core business logic.
	providers: [SessionResolver, SessionService]
})
export class SessionModule {}
