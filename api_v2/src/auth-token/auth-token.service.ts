import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Position } from '@/enums/position.enum';
import { Role } from '@/enums/role.enum';

@Injectable()
export class AuthTokenService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Sets the authentication token in the cache for a period of seven days.
   *
   * @param {string} authToken - The authentication token to set in the cache.
   * @return {Promise<void>} - A promise that resolves when the token is successfully set in the cache.
   */
  async setCachedToken(authToken: string): Promise<void> {
    const sevenDays = 604800;

    await this.cacheManager.set('authToken', authToken, sevenDays);
  }

  /**
   * Fetches a new authentication token by signing a payload with the JWT service.
   * Important note: The email value has to exist in the database.
   *
   * @return {Promise<string>} A promise that resolves to the newly generated authentication token.
   */
  async fetchNewAuthToken(): Promise<string> {
    const signingPayload = {
      email: 'admin@sun-asterisk.com',
      positionId: Position.ADMIN,
      role: Role.HR_ADMIN,
    };

    const signingOptions = { issuer: 'sun-hris' };

    const authToken = await this.jwtService.signAsync(
      signingPayload,
      signingOptions,
    );

    this.setCachedToken(authToken);

    return authToken;
  }

  /**
   * Retrieves the authentication token from the cache. If the token is not found in the cache,
   * it fetches a new token by signing a payload with the JWT service.
   *
   * @return {Promise<string>} A promise that resolves to the authentication token.
   */
  async getAuthToken(): Promise<string> {
    const authToken = (await this.cacheManager.get('authToken')) as
      | string
      | undefined;

    return authToken ?? (await this.fetchNewAuthToken());
  }
}
