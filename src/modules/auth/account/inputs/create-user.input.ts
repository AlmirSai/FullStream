import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength
} from 'class-validator'

/**
 * CreateUserInput defines the structure for creating a new user.
 * It is used as an input type for GraphQL mutations to validate user data.
 * The input includes fields such as username, email, and password, with validation rules.
 */
@InputType()
export class CreateUserInput {
	/**
	 * The `username` field represents the user's chosen username.
	 * It must be a non-empty string and follow a specific pattern (alphanumeric with optional hyphens).
	 * The pattern ensures that usernames contain only valid characters (letters, digits, and hyphens).
	 */
	@Field()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	public username: string

	/**
	 * The `email` field represents the user's email address.
	 * It must be a valid email format and a non-empty string.
	 */
	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	public email: string

	/**
	 * The `password` field represents the user's password.
	 * It must be a non-empty string, have a minimum length of 8 characters,
	 * and meet certain complexity requirements (including one uppercase letter, one lowercase letter,
	 * one number, and one special character).
	 * A custom error message is provided if the password does not meet these criteria.
	 */
	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		{
			message:
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
		}
	)
	public password: string
}
