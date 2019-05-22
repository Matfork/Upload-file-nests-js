import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { User } from '../graphql.schema';
import { UserGuard } from './user.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

const pubSub = new PubSub();

@Resolver('user')
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query('getAllUsers')
  @UseGuards(UserGuard)
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Query('getUser')
  async findOneById(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<User> {
    return await this.userService.findOneById(id);
  }

  @Mutation('addUser')
  async create(@Args('createUserInput') args: CreateUserDto): Promise<User> {
    const createdUser = await this.userService.create(args);
    pubSub.publish('userCreated', { userCreated: createdUser });
    return createdUser;
  }

  @Subscription('userCreated')
  userCreated() {
    return pubSub.asyncIterator('userCreated');
  }
}
