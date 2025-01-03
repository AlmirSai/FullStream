import { Module } from '@nestjs/common'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'

/**
 * AccountModule is the module responsible for handling account-related functionality.
 * It includes both the resolver and the service that handle account-specific logic.
 * The resolver is responsible for processing GraphQL queries and mutations,
 * while the service contains the business logic related to user accounts.
 */
@Module({
	/**
	 * The providers array defines the classes that are instantiated by the NestJS dependency injection system.
	 * These are made available throughout the module and can be injected into other components (e.g., controllers, resolvers).
	 */
	providers: [AccountResolver, AccountService]
})
export class AccountModule {}
