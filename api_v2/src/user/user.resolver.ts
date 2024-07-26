import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserDTO } from '@/graphql/graphql';
import { User } from '@prisma/client';

//This is where the function is to query all the fetched users and user ID
@Resolver(() => UserDTO)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserDTO])
  async allUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Query(() => [UserDTO], { nullable: true })
  async userById(@Args('id') id: number): Promise<User | null> {
    return this.userService.getUserById(id);
  }
}
