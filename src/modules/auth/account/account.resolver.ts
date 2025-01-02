import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Mutation(() => Boolean, { name: 'createUser' })
	public async create(@Args('data') input: CreateUserInput) {
		return this.accountService.create(input)
	}
}
