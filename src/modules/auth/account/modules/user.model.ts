import { Field, ID, ObjectType } from '@nestjs/graphql'

/**
 * UserModel represents the structure of a user object in the GraphQL schema.
 * This object type is used to define how user data is exposed through GraphQL queries.
 */
@ObjectType()
export class UserModel {
	/**
	 * The `id` field is the unique identifier for the user.
	 * It is of type `ID`, which represents a unique value for the user in the GraphQL schema.
	 */
	@Field(() => ID)
	public id: string

	/**
	 * The `email` field represents the user's email address.
	 * It is a string value and is required to be unique for each user.
	 */
	@Field(() => String)
	public email: string

	/**
	 * The `password` field stores the user's password.
	 * In practice, this would be hashed and not exposed directly in GraphQL responses.
	 */
	@Field(() => String)
	public password: string

	/**
	 * The `username` field is the unique name chosen by the user.
	 * It can be used for login or display purposes.
	 */
	@Field(() => String)
	public username: string

	/**
	 * The `displayName` field represents the user's full name or a name displayed publicly.
	 * This value is typically shown in user profiles or comments.
	 */
	@Field(() => String)
	public displayName: string

	/**
	 * The `avatar` field stores the URL to the user's profile picture.
	 * It is nullable, meaning the user may not have an avatar set.
	 */
	@Field(() => String, { nullable: true })
	public avatar: string

	/**
	 * The `bio` field stores a short biography or description of the user.
	 * It is also nullable, allowing the user to choose whether to include a bio.
	 */
	@Field(() => String, { nullable: true })
	public bio: string

	/**
	 * The `createdAt` field stores the timestamp of when the user was created in the system.
	 * It is of type `Date` and represents the creation date in ISO format.
	 */
	@Field(() => Date)
	public createdAt: Date

	/**
	 * The `updatedAt` field stores the timestamp of when the user was last updated in the system.
	 * It is of type `Date` and represents the last update date in ISO format.
	 */
	@Field(() => Date)
	public updatedAt: Date
}
