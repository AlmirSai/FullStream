import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { User } from './../../../prisma/generated/index.d'

// Custom decorator to retrieve the currently authorized user from the request context
export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		let user: User

		// Check the type of the request (HTTP or GraphQL)
		if (ctx.getType() === 'http') {
			// For HTTP requests, retrieve the user from the request object
			user = ctx.switchToHttp().getRequest().user
		} else {
			// For GraphQL requests, use the GqlExecutionContext to retrieve the user
			const context = GqlExecutionContext.create(ctx)
			user = context.getContext().req.user
		}

		// If a specific data field (e.g., 'id', 'email') is provided, return that field, otherwise return the entire user object
		return data ? user[data] : user
	}
)
