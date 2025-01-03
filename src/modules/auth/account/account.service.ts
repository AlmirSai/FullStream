import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { CreateUserInput } from './inputs/create-user.input'

/**
 * AccountService contains the business logic for managing user accounts.
 * It is responsible for handling account creation and validating input data before creating a new user.
 */
@Injectable()
export class AccountService {
	/**
	 * Constructor injects the PrismaService, which interacts with the database to perform user-related operations.
	 */
	public constructor(private readonly prismaService: PrismaService) {}

	/**
	 * The `me` method fetches the user profile by the provided user ID.
	 * It interacts with Prisma to retrieve the user's information.
	 *
	 * @param id - The user ID used to find the specific user.
	 * @returns The user object if found in the database.
	 */
	public async me(id: string) {
		// Fetch the user from the database by ID
		const user = await this.prismaService.user.findUnique({
			where: { id }
		})

		// Return the found user (or null if not found)
		return user
	}

	/**
	 * The `create` method is responsible for creating a new user account.
	 * It checks if the username and email are already taken, hashes the password,
	 * and creates the user in the database.
	 *
	 * @param input - The input data used to create the user (includes username, email, and password).
	 * @returns A boolean indicating whether the user was successfully created.
	 * @throws ConflictException If the username or email already exists in the database.
	 */
	public async create(input: CreateUserInput): Promise<boolean> {
		const { username, email, password } = input

		// Check if the username already exists in the database
		const isUsernameExists = await this.prismaService.user.findUnique({
			where: {
				username
			}
		})

		// If the username is taken, throw a ConflictException
		if (isUsernameExists) {
			throw new ConflictException('This username is already taken.')
		}

		// Check if the email already exists in the database
		const isEmailExists = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		// If the email is taken, throw a ConflictException
		if (isEmailExists) {
			throw new ConflictException('This email is already taken.')
		}

		// Hash the password before storing it in the database
		// Use the argon2 hash function for secure password storage
		const hashedPassword = await hash(password)

		// Create the new user in the database after validation
		// The displayName is set to the username by default
		await this.prismaService.user.create({
			data: {
				username,
				email,
				password: hashedPassword, // Store the hashed password
				displayName: username // Default display name is the username
			}
		})

		// Return true indicating user creation was successful
		return true
	}
}
