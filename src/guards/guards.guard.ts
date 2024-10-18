import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthGuard implements CanActivate {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {

    const request: Request = context.switchToHttp().getRequest()
    const authorizationHeader = request.headers['authorization']

    if (authorizationHeader) {
      try {
        const token = authorizationHeader.split(' ')[1]
        const user = jwt.verify(token, this.JWT_SECRET);
        request.user = user; 
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }


    }

    throw new UnauthorizedException('Invalid token');
  }
}
