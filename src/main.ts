import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import RedisStore from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'

import { ms, type StringValue } from '@/src/shared/utils/ms.util'
import { parseBoolearn } from '@/src/shared/utils/parse-boolearn.util'

import { CoreModule } from './core/core.module'
import { RedisService } from './core/redis/redis.service'

async function bootstrap() {
	// Create a new NestJS application
	const app = await NestFactory.create(CoreModule)

	// Get the ConfigService to retrieve application configuration values
	const config = app.get(ConfigService)
	// Get the RedisService to interact with Redis
	const redis = app.get(RedisService)

	// Use cookie-parser to parse cookies, with a secret key from configuration
	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	// Apply global validation pipes for input transformation and validation
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	// Configure express-session middleware to handle session management
	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'), // Session secret
			name: config.getOrThrow<string>('SESSION_NAME'), // Session cookie name
			resave: false, // Do not resave the session if unmodified
			saveUninitialized: false, // Do not save uninitialized sessions
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'), // Cookie domain
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')), // Set max age using ms function
				httpOnly: parseBoolearn(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				), // httpOnly flag for security
				secure: parseBoolearn(
					config.getOrThrow<string>('SESSION_SECURE')
				), // Secure flag for HTTPS
				sameSite: 'lax' // SameSite attribute to prevent CSRF attacks
			},
			// Use Redis as the session store
			store: new RedisStore({
				client: redis, // Redis client instance
				prefix: config.getOrThrow<string>('SESSION_FOLDER') // Redis session key prefix
			})
		})
	)

	// Enable CORS (Cross-Origin Resource Sharing) with allowed origins and credentials support
	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'), // Allowed origin for CORS
		credentials: true, // Allow sending cookies with requests
		exposedHeaders: ['set-cookie'] // Expose the 'set-cookie' header in responses
	})

	// Start the server and listen on the specified port
	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}

// Call the bootstrap function to launch the application
bootstrap()
