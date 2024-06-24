import { ErrorMessageEnum } from '@/enums/error-messages.enum';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SignInService {
  private readonly logger = new Logger(SignInService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Generates an authentication token for a user based on their Google access token.
   *
   * @param {string} accessToken - The Google access token of the user.
   * @return {Promise<string>} - A promise that resolves to the generated authentication token.
   * @throws {HttpException} - If the user is not found.
   */
  async processAuthTokenGeneration(accessToken: string): Promise<string> {
    try {
      const userGoogleInfo = await this.getUserGoogleInfo(accessToken);

      const user = await this.prismaService.user.findFirst({
        where: { email: userGoogleInfo.email },
      });

      if (!user) {
        throw new HttpException('User not found', 500);
      }

      const authToken = await this.generateAuthToken(
        user.id,
        user.email,
        user.roleId,
      );

      return authToken;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the user information from Google using the access token.
   *
   * @param {string} accessToken - The access token provided by Google for authentication.
   * @return {Promise<{ email: string }>} - A promise that resolves to an object containing the email of the user.
   * @throws {HttpException} - If there is an error in retrieving the user information or if the access token is invalid.
   */
  async getUserGoogleInfo(accessToken: string): Promise<{ email: string }> {
    const googleEndpoint = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;

    const response = await firstValueFrom(
      this.httpService.get(googleEndpoint),
    ).catch((error) => {
      this.logger.error(error);

      // Todo: Implement enums once PR for enums is merged
      const errorMessage =
        error.response.status !== 200
          ? ErrorMessageEnum.INVALID_ACCESS_TOKEN
          : 'Something went wrong. Please try again later.';

      throw new HttpException(errorMessage, 500);
    });

    return response.data;
  }

  /**
   * Generates an authentication token based on the provided user ID, email, and role ID.
   *
   * @param {number} id - The user ID for whom the token is generated.
   * @param {string | null} email - The email associated with the user.
   * @param {number} roleId - The role ID of the user.
   * @return {Promise<string>} A promise that resolves to the generated authentication token.
   */
  async generateAuthToken(
    id: number,
    email: string | null,
    roleId: number,
  ): Promise<string> {
    const signingPayload = {
      nameid: id,
      email,
      role: roleId,
    };

    const signOptions = { issuer: 'sun-hris' };

    return this.jwtService.signAsync(signingPayload, signOptions);
  }
}
