import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/modules/user.model'

import { AccountService } from './account.service'
import { CreateUserInout } from './inputs/create-user.input'

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: 'findAllUsers' })
	public async findAll() {
		return this.accountService.findAll()
	}

	@Mutation(() => UserModel, { name: 'createUser' })
	public async create(@Args('data') input: CreateUserInout) {
		return this.accountService.create(input)
	}
}
