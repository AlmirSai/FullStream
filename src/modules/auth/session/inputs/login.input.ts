import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

@InputType()
export class LoginInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	public login: string

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
