import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'password', // Asegúrate que sea la misma que en el microservicio
    });
  }

  async validate(payload: any) {
    // Lo que retornes aquí se inyecta en req.user
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}