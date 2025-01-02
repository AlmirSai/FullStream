import { Query, Resolver } from '@nestjs/graphql'

import { UserModel } from '@/src/modules/auth/account/modules/user.model'

import { AccountService } from './account.service'

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: 'findAllUsers' })
	public async findAll() {
		return this.accountService.findAll()
	}
}
