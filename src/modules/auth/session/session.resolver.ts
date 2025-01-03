import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import type { GqlContext } from '@/src/shared/types/gql-context.types'

import { UserModel } from '../account/modules/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionService } from './session.service'

/**
 * SessionResolver is a GraphQL resolver responsible for handling session-related queries and mutations.
 * It allows users to log in and log out by interacting with the `SessionService`.
 */
@Resolver('Session')
export class SessionResolver {
	/**
	 * Constructor injects the `SessionService`, which contains the business logic for managing user sessions.
	 */
	public constructor(private readonly sessionService: SessionService) {}

	/**
	 * The `login` mutation allows users to log in by providing their login credentials.
	 * It returns a `UserModel` representing the logged-in user.
	 *
	 * @param req - The GraphQL context that contains the request object.
	 * @param input - The login credentials input, which includes login and password.
	 * @returns A `UserModel` containing the user's information upon successful login.
	 */
	@Mutation(() => UserModel, { name: 'loginUser' })
	public async login(
		@Context() { req }: GqlContext, // Extracting request from the GraphQL context
		@Args('data') input: LoginInput // The login credentials (username/email and password)
	) {
		// Call the `login` method of the `SessionService` to handle login logic
		return this.sessionService.login(req, input)
	}

	/**
	 * The `logout` mutation allows users to log out.
	 * It returns a boolean indicating whether the logout operation was successful.
	 *
	 * @param req - The GraphQL context containing the request object.
	 * @returns `true` if the logout operation was successful, otherwise `false`.
	 */
	@Mutation(() => Boolean, { name: 'logoutUser' })
	public async logout(@Context() { req }: GqlContext) {
		// Call the `logout` method of the `SessionService` to handle logout logic
		return this.sessionService.logout(req)
	}
}
