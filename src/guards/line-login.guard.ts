import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import http from 'http';
import axios from 'axios';

@Injectable()
export class LineLoginGuard implements CanActivate {
  async canActivate(_: ExecutionContext): Promise<boolean> {
    const request = _.switchToHttp().getRequest() as http.IncomingMessage;
    const authorization = request.headers['authorization'];
    if (!authorization) return false;
    const token = authorization.replace('Bearer ', '');

    const data = await this.verify(token);

    if (
      data.expires_in < 1 ||
      data.client_id !== 'LINE_LOGIN_CHANNEL_ID' // Replace with your LINE Login channel id
    ) {
      return false;
    }

    return data.scope.includes('openid');
  }

  async verify(token: string): Promise<{
    client_id: string;
    expires_in: number;
    scope: string;
  }> {
    const response = await axios.get<{
      client_id: string;
      expires_in: number;
      scope: string;
    }>('/verify', {
      baseURL: 'https://api.line.me/oauth2/v2.1',
      params: {
        access_token: token,
      },
    });

    return response.data;
  }
}
