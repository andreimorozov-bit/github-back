import { Controller } from '@nestjs/common';
// import { AxiosResponse } from 'axios';
import { AppService } from './app.service';

@Controller('lol')
export class AppController {
  constructor(private readonly appService: AppService) {}
}
