import { ParseIntPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Subscription,
  Context,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { User } from '../graphql.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGraphqlGuard } from './guard/jwt-auth.graphqlguard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGraphqlGuard } from './guard/roles.graphql.guard';
import { SessionRequiredGraphqlGuard } from './guard/session-auth.graphql.guard';

const pubSub = new PubSub();

@Resolver('User')
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query('getAllUsers')
  @UseGuards(
    SessionRequiredGraphqlGuard,
    JwtAuthGraphqlGuard,
    RolesGraphqlGuard,
  )
  @Roles('admin')
  async getAllUsers(@Context() { req, session }) {
    return await this.userService.findAll();
  }

  /**
    query{
      getAllUsers{
        id
        email
        firstName
        lastName
        details{
          nick
          status
        }
        extra
      }
    }

    HTTP HEADERS
    {
      "Authorization": "Bearer ..."
    }
  */
  @Query('getUser')
  @UseGuards(JwtAuthGraphqlGuard)
  async findOneById(
    @Args('id', ParseIntPipe)
    id: number,
    @Context() ctx,
  ): Promise<User> {
    return await this.userService.findOneById(id);
  }

  /**    
   mutation ( $inputCreateUser: InputCreateUser!) {
    addUser(createUserInput: $inputCreateUser){
      id
      email
      firstName
      lastName    
    }
  }

  QUERY VARIABLES
  {
    "inputCreateUser": {
    "id": 11,
    "email":"test20@gmail.com",
    "firstName":"MAtt",
    "role":"user",
      "age": 25
    }  
  }
   */
  @Mutation('addUser')
  @UseGuards(JwtAuthGraphqlGuard, RolesGraphqlGuard)
  async create(@Args('createUserInput') args: CreateUserDto): Promise<User> {
    const createdUser = await this.userService.create(args);
    pubSub.publish('userCreated', { userCreated: createdUser });
    return createdUser;
  }

  @Subscription('userCreated')
  userCreated() {
    return pubSub.asyncIterator('userCreated');
  }

  //If needed
  @ResolveProperty('extra')
  async genExtra(@Parent() user) {
    return (await user.details) ? 'Has details' : null;
  }
}
