import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { LogoutRequestInput } from '@/graphql/graphql';

@Injectable()
export class LogoutService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Processes the logout request by validating and deleting the provided token.
   *
   * @param {LogoutRequestInput} logoutRequest - The input object containing the token to be logged out.
   * @param {string} logoutRequest.token - The token to be logged out.
   * @returns {Promise<string>} A promise that resolves to a string message indicating the result of the logout operation.
   */

  async logout(logoutRequest: LogoutRequestInput): Promise<string> {
    const tokenExists = await this.prisma.personalAccessToken.findFirst({
      where: { token: logoutRequest.token },
    });

    if (!tokenExists) {
      return 'Token not found';
    }

    await this.prisma.personalAccessToken.delete({
      where: { id: tokenExists.id },
    });

    return 'Successfully logged out';
  }
}
