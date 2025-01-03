import { applyDecorators, UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '../guards/gql-guard.guard'

/**
 * Decorator that applies the GqlAuthGuard to a resolver or controller.
 * This guard verifies that the session contains a valid user ID and verifies the existence of the user.
 * If the user is not authenticated, it throws an UnauthorizedException.
 */
export function Authorisation() {
	return applyDecorators(UseGuards(GqlAuthGuard))
}
