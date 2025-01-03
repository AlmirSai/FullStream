// Importing types for Express Request and Response to define the shape of the GraphQL context.
import type { Request, Response } from 'express'

/**
 * GraphQL Context Interface
 *
 * This interface defines the shape of the context used in GraphQL resolvers.
 * It contains the request and response objects, providing access to the Express
 * session and other HTTP-related functionality.
 */
export interface GqlContext {
	/**
	 * The request object from Express.
	 * Provides access to the session and any data sent by the client.
	 * It contains information about the incoming HTTP request.
	 */
	req: Request

	/**
	 * The response object from Express.
	 * Provides methods for sending a response back to the client.
	 * Used for sending data and managing HTTP response.
	 */
	res: Response
}
