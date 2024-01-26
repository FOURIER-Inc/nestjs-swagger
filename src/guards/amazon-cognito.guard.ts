import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';
import { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';

@Injectable()
export class AmazonCognitoGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (!authorization) return false;

    const result = await this.getToken(authorization);
    return result !== undefined && result.scope.includes('openid');
  }

  async getToken(
    authorization: string,
  ): Promise<CognitoAccessTokenPayload | undefined> {
    const token = authorization.replace('Bearer ', '');

    try {
      return await this.makeVerifier().verify(token);
    } catch (e) {
      return undefined;
    }
  }

  makeVerifier(): CognitoJwtVerifierSingleUserPool<{
    userPoolId: string;
    tokenUse: 'access';
    clientId: string | string[] | null;
  }> {
    return CognitoJwtVerifier.create({
      userPoolId: 'AWS_COGNITO_USER_POOL_ID', // Replace with your user pool id
      tokenUse: 'access',
      clientId: 'AWS_COGNITO_USER_POOL_CLIENT_ID', // Replace with your user pool client id
    });
  }
}
