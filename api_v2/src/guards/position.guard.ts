import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PositionEnum } from '@/enums/position.enum';
import { JwtService } from '@nestjs/jwt';
import { MiddlewareErrorMessageEnum } from '@/enums/middleware-error-message.enum';

@Injectable()
export class PositionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPositions = this.reflector.getAllAndOverride<PositionEnum[]>(
      'position',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPositions) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const token = req.headers.authorization;

    const decodedToken = await this.jwtService.verifyAsync(token);

    const allRequiredPosition = new Set(requiredPositions.flat());

    const accessGranted = allRequiredPosition.has(decodedToken.position);
    if (accessGranted) {
      return true;
    } else {
      if (allRequiredPosition.has(PositionEnum.MANAGER)) {
        throw new ForbiddenException(
          MiddlewareErrorMessageEnum.NOT_MANAGER_USER,
        );
      } else if (allRequiredPosition.has(PositionEnum.ASSISTANT_MANAGER)) {
        throw new ForbiddenException(
          MiddlewareErrorMessageEnum.NOT_MANAGER_USER,
        );
      } else if (
        allRequiredPosition.has(PositionEnum.ADMIN) ||
        allRequiredPosition.has(PositionEnum.WEB_DEVELOPER_TRAINER) ||
        allRequiredPosition.has(PositionEnum.WEB_DEVELOPER_TEAM_LEADER)
      ) {
        throw new ForbiddenException(
          MiddlewareErrorMessageEnum.NOT_LEADER_USER,
        );
      } else if (allRequiredPosition.has(PositionEnum.ADMIN)) {
        throw new ForbiddenException(MiddlewareErrorMessageEnum.NOT_ADMIN_USER);
      } else if (allRequiredPosition.has(PositionEnum.ESL_TEACHER)) {
        throw new ForbiddenException(MiddlewareErrorMessageEnum.NOT_ESL_USER);
      } else {
        throw new ForbiddenException(
          MiddlewareErrorMessageEnum.UNAUTHENTICATED_USER,
        );
      }
    }
  }
}
