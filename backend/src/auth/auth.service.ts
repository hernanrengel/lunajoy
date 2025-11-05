import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  private google = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async loginWithGoogle(idToken: string) {
    const ticket = await this.google.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const { sub, email, name, picture } = payload;

    let user = await this.prisma.user.findUnique({ where: { googleSub: sub } });
    if (!user) {
      user = await this.prisma.user.upsert({
        where: { email },
        update: {
          googleSub: sub,
          name: name ?? undefined,
          pictureUrl: picture ?? undefined,
        },
        create: {
          email,
          googleSub: sub,
          name: name ?? null,
          pictureUrl: picture ?? null,
        },
      });
    }

    const token = await this.jwt.signAsync(
      { uid: user.id, email: user.email },
      { expiresIn: '7d' },
    );
    return { token, user };
  }
}
