import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrae el token del encabezado "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'password', // DEBE ser igual a la del Microservicio
    });
  }

  async validate(payload: any) {
    // Lo que retornes aquí se guardará en req.user
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}