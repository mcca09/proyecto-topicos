import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'CLAVE_SECRETA_FERIA_2024',
    });
  }

  async validate(payload: any) {
    // Retorna los datos del usuario extraídos del token
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
