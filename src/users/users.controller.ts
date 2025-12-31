import {
  Body,
  Controller,
  HttpException,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { APIError } from 'better-auth';
import {
  BETTER_AUTH_CLIENT,
  type BetterAuthInstance,
} from 'src/authentication/better-auth-client';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  RequestNewPasswordDto,
  ResetPasswordDto,
} from './users.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(BETTER_AUTH_CLIENT) private readonly auth: BetterAuthInstance,
  ) {}

  @AllowAnonymous()
  @Post('get-session')
  async getSession(@Req() req: Request) {
    const res = await this.auth.api.getSession({
      headers: req.headers,
    });

    if (!res?.user) {
      throw new UnauthorizedException('Session expired or not authenticated');
    }

    return { user: { ...res?.user } };
  }

  @AllowAnonymous()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const res = await this.auth.api.signUpEmail({
      body: {
        name: body.name,
        email: body.email,
        password: body.password,
        image: undefined,
        callbackURL: undefined,
        rememberMe: undefined,
        username: body.email?.split('@')?.[0],
      },
      asResponse: true,
    });

    return (await res.json()) as unknown;
  }

  @AllowAnonymous()
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { identifier, password, rememberMe } = body;
    const isEmail = identifier.includes('@');

    // 1. Deklarasikan variable di luar scope if/else
    let response;

    // Konfigurasi umum untuk request ke Auth (Better Auth)
    const authConfig = {
      password: password,
      rememberMe: rememberMe,
      callbackURL: 'http://admin-po.rizaru-desu.my.id:5555/dashboard/',
    };

    if (isEmail) {
      response = await this.auth.api.signInEmail({
        body: {
          email: identifier,
          ...authConfig,
        },
        asResponse: true,
        headers: req.headers,
      });
    } else {
      response = await this.auth.api.signInUsername({
        body: {
          username: identifier,
          ...authConfig,
        },
        asResponse: true,
        headers: req.headers,
      });
    }

    // 2. Handling Cookie
    // Mengambil header 'set-cookie' dari response auth dan meneruskannya ke client
    // Catatan: Jika nodejs versi terbaru, bisa gunakan response.headers.getSetCookie() untuk array
    const setCookie = response.headers.get('set-cookie');

    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }

    // 3. Forward Status Code
    // Penting agar jika login gagal (401), client menerima status 401 juga, bukan 200/201
    res.status(response.status);

    return response.json() as unknown;
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const response = await this.auth.api.signOut({
      headers: req.headers,
      asResponse: true,
    });

    return (await response.json()) as unknown;
  }

  @Post('change-password')
  async changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    const response = await this.auth.api.changePassword({
      body: {
        newPassword: body.newPassword,
        currentPassword: body.currentPassword,
        revokeOtherSessions: true,
      },
      headers: req.headers,
      asResponse: true,
    });

    return (await response.json()) as unknown;
  }

  @Post('request-password-reset')
  async requestNewPassword(
    @Req() req: Request,
    @Body() body: RequestNewPasswordDto,
  ) {
    const response = await this.auth.api.requestPasswordReset({
      body: {
        email: body.email, // required
        redirectTo: 'http://localhost:5432/reset-password/',
      },
      headers: req.headers,
      asResponse: true,
    });

    return (await response.json()) as unknown;
  }

  @Post('reset-password')
  async resetPassword(
    @Req() req: Request,
    @Body() body: ResetPasswordDto,
    @Query('token') token: string,
  ) {
    const response = await this.auth.api.resetPassword({
      body: {
        newPassword: body.newPassword,
        token,
      },
      headers: req.headers,
      asResponse: true,
    });

    return (await response.json()) as unknown;
  }
}
