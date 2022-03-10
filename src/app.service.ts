import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}
  getHello(): Promise<AxiosResponse<unknown>> {
    try {
      const response = this.httpService.get(
        'https://api.github.com/search/repositories',
        {
          headers: {
            Authorization: 'token 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',
          },
          params: {
            q: 'language:javascript',
            sort: 'stars',
            order: 'desc',
            per_page: 1,
            page: 1,
          },
        },
      );
      response.subscribe((res) => {
        console.log(res.data);
      });
      return firstValueFrom(response);
    } catch (err) {
      console.log('something went wrong');
      return;
    }
  }

  // getReset(): void {
  //   clearInterval(theInterval);
  //   theInterval = setInterval(syncGithub, 10000);
  //   console.log(`resetted timer to 10 sec`);
  //   return;
  // }
}

// let hz = 1;

// const syncGithub = async () => {
//   const theService = new AppService(new HttpService());
//   await theService.getHello();
//   console.log(`zatralen ${hz}`);
//   hz++;
// };

// let theInterval = setInterval(syncGithub, 20000);
