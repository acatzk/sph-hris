import { Mutation, Resolver } from '@nestjs/graphql';
import { SignInService } from './sign-in.service';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@/guards/access-token.guard';
import { AccessToken } from '@/decorators/access-token.decorator';

@Resolver('SignIn')
export class SignInResolver {
  constructor(private readonly signInService: SignInService) {}

  /**
   * Processes the google access token and generates an HRIS authentication token based on the matched user.
   *
   * @param {string} accessToken - The access token used for authentication.
   * @return {Promise<string>} A promise that resolves to the generated authentication token.
   */
  @Mutation(() => String)
  @UseGuards(AccessTokenGuard)
  async createSignIn(@AccessToken() accessToken: string): Promise<string> {
    return await this.signInService.processAuthTokenGeneration(accessToken);
  }
}
