import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: process.env.JWT_SECRET || 'MY_DEFAULT_SECRET', // Secret key used to sign the token
    });
  }

  // Validate and decode the JWT payload
  async validate(payload: any) {
    return { userId: payload.userId, email: payload.email, role: payload.role }; // Decoded payload
  }
}
