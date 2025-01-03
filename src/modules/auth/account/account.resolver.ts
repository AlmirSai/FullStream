import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorisation } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorizated.decorator'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'
import { UserModel } from './modules/user.model'

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
	 * The `me` query is used to fetch the profile of the currently authenticated user.
	 * It retrieves the user ID using the `@Authorized` decorator and passes it to the `AccountService.me` method.
	 * The result of the query is a `UserModel` representing the user's profile.
	 */
	@Authorisation() // Custom authorization check
	@Query(() => UserModel, { name: 'findProfile' }) // GraphQL query that fetches user profile
	public async me(@Authorized('id') id: string) {
		// Fetch user profile by ID using the AccountService
		return this.accountService.me(id)
	}

	/**
	 * The `createUser` mutation allows for creating a new user account.
	 * It accepts an input of type `CreateUserInput` (which includes the username, email, and password),
	 * and returns a boolean indicating whether the user was successfully created.
	 * The resolver delegates the actual creation to the `AccountService.create` method.
	 */
	@Mutation(() => Boolean, { name: 'createUser' }) // GraphQL mutation to create a new user
	public async create(
		@Args('data') input: CreateUserInput // Accepts `CreateUserInput` as an argument
	): Promise<boolean> {
		// Delegate the user creation logic to the AccountService
		return this.accountService.create(input)
	}
}
