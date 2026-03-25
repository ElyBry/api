import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { IdResult } from '../common/id.model';
import { User } from './user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async users(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    const { limit: l, offset } = getPaginationParams(page, limit);
    return this.usersService.findAll(l, offset);
  }

  @Query(() => [User], { name: 'usersDeleted' })
  async usersDeleted(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    const { limit: l, offset } = getPaginationParams(page, limit);
    return this.usersService.findDeleted(l, offset);
  }

  @Query(() => User, { name: 'user', nullable: true })
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create({
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
    });
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.usersService.update(id, {
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
    });
  }

  @Mutation(() => IdResult)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.softDelete(id);
  }
}
