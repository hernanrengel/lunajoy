import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  ExtractJwt,
  type StrategyOptions,
  type JwtFromRequestFunction,
} from 'passport-jwt';

interface JwtPayload {
  uid: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtExtractor: JwtFromRequestFunction =
      ExtractJwt.fromAuthHeaderAsBearerToken();

    const options: StrategyOptions = {
      secretOrKey: process.env.JWT_SECRET as string,
      jwtFromRequest: jwtExtractor,
      ignoreExpiration: false,
    };

    super(options);
  }

  validate(payload: JwtPayload) {
    return { uid: payload.uid, email: payload.email };
  }
}
