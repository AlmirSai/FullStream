import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'

/**
 * AccountResolver is responsible for handling GraphQL mutations related to user accounts.
 * This resolver listens for the `createUser` mutation and delegates the logic to the `AccountService`.
 * The `AccountService` is responsible for processing the business logic related to creating a user.
 */
@Resolver('Account')
export class AccountResolver {
	/**
	 * The constructor injects the `AccountService` into the resolver,
	 * allowing the resolver to delegate user account logic to the service layer.
	 */
	public constructor(private readonly accountService: AccountService) {}

	/**
	 * The `createUser` mutation allows for creating a new user account.
	 * It accepts an input of type `CreateUserInput` (which includes the username, email, and password),
	 * and returns a boolean indicating whether the user was successfully created.
	 * The resolver delegates the actual creation to the `AccountService.create` method.
	 */
	@Mutation(() => Boolean, { name: 'createUser' })
	public async create(
		@Args('data') input: CreateUserInput
	): Promise<boolean> {
		return this.accountService.create(input)
	}
}
