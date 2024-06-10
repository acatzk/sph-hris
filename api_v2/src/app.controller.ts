import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthTokenService } from './auth-token/auth-token.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authTokenService: AuthTokenService) {}

  @Get()
  async getHello() {
    console.log(await this.authTokenService.getAuthToken());
    return this.appService.getHello();
  }
}
