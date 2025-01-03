import { Global, Module } from '@nestjs/common'

import { RedisService } from './redis.service'

/**
 * The RedisModule provides Redis-related functionality within the application.
 * It is a global module, meaning it can be used across the entire application
 * without the need to import it in other modules.
 *
 * @Global() makes the RedisModule globally available throughout the application.
 * The RedisService is provided and exported, allowing other modules to use it.
 */
@Global()
@Module({
	/**
	 * The providers array defines the services that are available within this module.
	 * In this case, we provide RedisService, which is responsible for interacting with Redis.
	 */
	providers: [RedisService],

	/**
	 * The exports array makes the RedisService available to other modules that import this module.
	 * Any module importing RedisModule will have access to the RedisService.
	 */
	exports: [RedisService]
})
export class RedisModule {}
