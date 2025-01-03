import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'

/**
 * RedisService is a wrapper around the ioredis Redis client.
 * It provides functionality to interact with Redis by extending the Redis class from ioredis.
 *
 * The constructor retrieves the Redis URI from the configuration service and
 * initializes the Redis client with this URI to establish a connection to Redis.
 */
@Injectable()
export class RedisService extends Redis {
	/**
	 * Constructor for RedisService.
	 * @param configService - The ConfigService is injected to access application configuration.
	 * It retrieves the Redis URI from the configuration file or environment variables.
	 *
	 * @throws Error if the 'REDIS_URI' configuration value is not found.
	 */
	public constructor(private readonly configService: ConfigService) {
		/**
		 * The super() method calls the constructor of the Redis class from ioredis.
		 * It initializes the Redis client with the URI retrieved from the configuration.
		 * The configService.getOrThrow<string>('REDIS_URI') ensures that the URI is provided
		 * and throws an error if it is missing.
		 */
		super(configService.getOrThrow<string>('REDIS_URI'))
	}
}
