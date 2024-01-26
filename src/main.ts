import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  buildOpenApiDocument(app);

  await app.listen(3000);
}

bootstrap().then();

function buildOpenApiDocument(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Nestjs Swagger')
    .addOAuth2(
      {
        type: 'oauth2',
        description: 'Amazon Cognito user pool authentication',
        flows: {
          authorizationCode: {
            authorizationUrl: 'AWS_COGNITO_DOMAIN/oauth2/authorize',
            tokenUrl: 'AWS_COGNITO_DOMAIN/oauth2/token',
            scopes: {
              openid: 'openid token',
            },
          },
        },
      },
      'Amazon Cognito',
    )
    .addOAuth2(
      {
        type: 'oauth2',
        description: 'LINE Login authentication',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://access.line.me/oauth2/v2.1/authorize',
            tokenUrl: 'https://api.line.me/oauth2/v2.1/token',
            scopes: {
              profile: 'user profile',
              'profile openid': 'user profile and openid',
              'profile openid email': 'user profile, openid and email',
              openid: 'openid',
              'openid email': 'openid token and email',
            },
          },
        },
      },
      'LINE Login',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:3000/doc/oauth2-redirect.html',
    },
  });
}
