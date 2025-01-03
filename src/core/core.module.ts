import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AccountModule } from '../modules/auth/account/account.module'
import { SessionModule } from '../modules/auth/session/session.module'
import { IS_DEV_ENV } from '../shared/utils/is-dev.util'

import { getGraphQLConfig } from './config/graphsql.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

/**
 * The CoreModule is the root module of the application that brings together various core services and configurations.
 * It imports essential modules such as GraphQL, Prisma, Redis, and authentication-related modules.
 */
@Module({
	imports: [
		/**
		 * ConfigModule is configured to load environment variables.
		 * It is globally available and can be used across the application.
		 * The `ignoreEnvFile` option disables loading the .env file in non-development environments.
		 * The `isGlobal` option makes the configuration available throughout the application.
		 */
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),

		/**
		 * GraphQLModule is set up asynchronously with the ApolloDriver.
		 * The `useFactory` option allows for the dynamic configuration of the GraphQLModule using the `getGraphQLConfig` function.
		 * The `ConfigService` is injected to access configuration values, such as GraphQL endpoint and settings.
		 */
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [CoreModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService]
		}),

		/**
		 * PrismaModule integrates Prisma ORM into the application, enabling database operations.
		 */
		PrismaModule,

		/**
		 * RedisModule provides functionality for Redis-based caching and data storage.
		 */
		RedisModule,

		/**
		 * AccountModule handles user account-related operations, such as registration and authentication.
		 */
		AccountModule,

		/**
		 * SessionModule manages user session data, including authentication tokens and session management.
		 */
		SessionModule
	]
})
export class CoreModule {}
