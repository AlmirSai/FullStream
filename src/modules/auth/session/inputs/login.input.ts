import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

/**
 * LoginInput is a DTO (Data Transfer Object) used for validating and transferring
 * login credentials (login and password) from the client to the server.
 * It uses class-validator decorators to enforce validation rules on the input fields.
 */
@InputType()
export class LoginInput {
	/**
	 * The login field is a required string that represents the user's login (e.g., username or email).
	 * It is validated to ensure it is a non-empty string.
	 */
	@Field()
	@IsString()
	@IsNotEmpty()
	public login: string

	/**
	 * The password field is a required string that represents the user's password.
	 * It must meet the following validation criteria:
	 * - Be at least 8 characters long.
	 * - Contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
	 * This is achieved using a regular expression with a custom error message.
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
