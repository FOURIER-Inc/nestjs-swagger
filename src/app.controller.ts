import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOAuth2, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { AmazonCognitoGuard } from './guards/amazon-cognito.guard';
import { LineLoginGuard } from './guards/line-login.guard';

class MessageContainer {
  @ApiProperty()
  message: string;
}

@Controller()
export class AppController {
  @Get('/cognito')
  @ApiOkResponse({ type: MessageContainer })
  @UseGuards(AmazonCognitoGuard)
  @ApiOAuth2(['openid'], 'Amazon Cognito')
  getCognitoHello(): MessageContainer {
    return {
      message: 'Authorized by Cognito!',
    };
  }

  @Get('/line')
  @ApiOkResponse({ type: MessageContainer })
  @UseGuards(LineLoginGuard)
  @ApiOAuth2(['openid'], 'LINE Login')
  getLineHello(): MessageContainer {
    return {
      message: 'Authorized by LINE!',
    };
  }
}
