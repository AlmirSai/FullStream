// Importing ConfigService from NestJS for configuration handling.
// dotenv is used to load environment variables from a .env file into process.env.
import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'

// Loading environment variables from the .env file.
dotenv.config()

/**
 * Helper function to determine if the current environment is 'development'.
 *
 * @param configService - The ConfigService from NestJS, used to access environment variables.
 * @returns A boolean indicating whether the environment is 'development'.
 */
export function isDev(configService: ConfigService): boolean {
	// Checks if the 'NODE_ENV' environment variable is set to 'development'.
	return configService.getOrThrow<string>('NODE_ENV') === 'development'
}

// A constant that checks the value of NODE_ENV in process.env to determine if it's 'development'.
export const IS_DEV_ENV = process.env.NODE_ENV === 'development'
