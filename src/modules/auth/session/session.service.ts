import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

import { LoginInput } from './inputs/login.input'

/**
 * SessionService handles the session management logic for user authentication.
 * It includes methods for logging in and logging out users by interacting with Prisma and session cookies.
 */
@Injectable()
export class SessionService {
	/**
	 * Constructor injects PrismaService to interact with the database and ConfigService to manage configurations.
	 */
	public constructor(
		private readonly PrismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService
	) {}

	public async findByUser(req: Request) {
		const userId = req.session.userId

		if (!userId) {
			throw new NotFoundException('User not found in session')
		}

		const keys = await this.redisService.keys('*')

		const userSessions = []

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)

			if (sessionData) {
				const session = JSON.parse(sessionData)

				if (session.userId === userId) {
					userSessions.push({
						...session,
						id: key.split(':')[1]
					})
				}
			}
		}

		userSessions.sort((a, b) => b.createdAt - a.createdAt)

		return userSessions.filter(session => session.id !== req.session.id)
	}

	public async findCurrent(req: Request) {
		const sessionId = req.session.id

		const sessionData = await this.redisService.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		)

		const session = JSON.parse(sessionData)

		return {
			...session,
			id: sessionId
		}
	}

	/**
	 * The login method is responsible for authenticating the user.
	 * It checks whether the provided username/email and password are correct, and if so, creates a session for the user.
	 *
	 * @param req - The Express request object, which contains the session.
	 * @param input - The login credentials (login and password).
	 * @returns The authenticated user object if successful, otherwise throws an exception.
	 * @throws NotFoundException if the user is not found.
	 * @throws UnauthorizedException if the password is incorrect.
	 */
	public async login(req: Request, input: LoginInput, userAgent: string) {
		const { login, password } = input

		// Check if the user exists by searching for matching username or email
		const user = await this.PrismaService.user.findFirst({
			where: {
				OR: [
					{ username: { equals: login } },
					{ email: { equals: login } }
				]
			}
		})

		// If the user is not found, throw an exception
		if (!user) {
			throw new NotFoundException('User not found')
		}

		// Verify the provided password against the stored hashed password
		const isValidPassword = await verify(user.password, password)

		// If the password is invalid, throw an exception
		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid password')
		}

		const metadata = getSessionMetadata(req, userAgent)

		// Set up the session for the authenticated user
		return new Promise((resolve, reject) => {
			req.session.createdAt = new Date()
			req.session.userId = user.id
			req.session.metadaat = metadata

			// Save the session
			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Failed to save session'
						)
					)
				}

				resolve(user) // Return the user object upon successful login
			})
		})
	}

	/**
	 * The logout method destroys the user's session and clears the session cookie.
	 *
	 * @param req - The Express request object containing the session.
	 * @returns true if the session is successfully destroyed, otherwise throws an exception.
	 * @throws InternalServerErrorException if there is an error during logout.
	 */
	public async logout(req: Request) {
		return new Promise((resolve, reject) => {
			// Destroy the session
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Failed to close session'
						)
					)
				}

				// Clear the session cookie
				req.res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve(true) // Return true upon successful logout
			})
		})
	}
	public async clearSession(req: Request) {
		req.res.clearCookie(
			this.configService.getOrThrow<string>('SESSION_NAME')
		)

		return true
	}

	public async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new ConflictException('Cannot remove current session')
		}

		await this.redisService.del(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
		)

		return true
	}
}

console.log(PrismaService)
