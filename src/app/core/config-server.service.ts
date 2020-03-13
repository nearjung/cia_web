import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigServerService {
  constructor() { }
  public getAPI(postFix: string, module = 'web'): string {
    if (module === 'web') {
      return environment.endPointWeb + postFix;
    } else if (module === 'socket') {
      return environment.endPointSocket;
    }
  }
}

export const configService = new ConfigServerService();
