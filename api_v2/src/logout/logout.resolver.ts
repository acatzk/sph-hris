import { LogoutRequestInput } from '@/graphql/graphql';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LogoutService } from './logout.service';

@Resolver('Logout')
export class LogoutResolver {
  constructor(private readonly logoutService: LogoutService) {}
  /**
   * Handles the logout mutation request.
   *
   * @param {LogoutRequestInput} logOut - The input object containing the token to be logged out.
   * @param {string} logOut.token - The token to be logged out.
   * @returns {Promise<string>} A promise that resolves to a string message indicating the result of the logout operation.
   */

  @Mutation(() => String)
  async logout(@Args('logOut') logOut: LogoutRequestInput): Promise<string> {
    return await this.logoutService.logout(logOut);
  }
}
