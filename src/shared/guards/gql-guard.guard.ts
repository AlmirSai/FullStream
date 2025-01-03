import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { PrismaService } from '@/src/core/prisma/prisma.service'

/**
 * GqlAuthGuard is a custom guard for GraphQL that ensures the user is authenticated.
 * It checks if the user is logged in by verifying the session and the user's ID.
 */
@Injectable()
export class GqlAuthGuard implements CanActivate {
	/**
	 * Constructor injects PrismaService to interact with the database.
	 */
	public constructor(private readonly prismaService: PrismaService) {}

	/**
	 * The `canActivate` method is responsible for checking if the request is authenticated.
	 * It ensures that the session contains a valid `userId` and verifies the existence of the user.
	 *
	 * @param context - The execution context of the request.
	 * @returns `true` if the user is authenticated, otherwise throws an UnauthorizedException.
	 * @throws UnauthorizedException if the user is not authenticated.
	 */
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		// Convert the execution context to a GraphQL context
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req

		// Check if the userId exists in the session, if not, the user is not authenticated
		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException('You are not authenticated')
		}

		// Fetch the user from the database using the userId from the session
		const user = await this.prismaService.user.findUnique({
			where: {
				id: request.session.userId
			}
		})

		// If user is not found, throw an UnauthorizedException (this is optional but recommended)
		if (!user) {
			throw new UnauthorizedException('User not found')
		}

		// Attach the user to the request object for use in resolvers
		request.user = user

		// Return true to indicate the user is authenticated
		return true
	}
}
