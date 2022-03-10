import { Controller, Get } from '@nestjs/common';
// import { AxiosResponse } from 'axios';
import { AppService } from './app.service';

@Controller('lol')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    const response = await this.appService.getHello();
    return response.data;
  }

  // @Get('reset')
  // getReset() {
  //   this.appService.getReset();
  //   return;
  // }
}
