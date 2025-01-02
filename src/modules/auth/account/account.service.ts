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

		if (isUsernameExists) {
			throw new ConflictException('This username is already taken.')
		}

		// Check if the email already exists in the database
		const isEmailExists = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (isEmailExists) {
			throw new ConflictException('This email is already taken.')
		}

		// Create the new user in the database after validation
		// Note: `user` variable is not used directly but required for the user creation process
		await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password), // Hash the password before storing
				displayName: username // Default display name is the same as the username
			}
		})

		return true // Return true indicating user creation was successful
	}
}
