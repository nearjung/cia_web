import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigServerService {
  constructor() { }
  public getDomain(postFix: string, module = 'web'): string {
    if (module === 'web') {
      return environment.webDomain + postFix;
    }
  }

  public getAPI(postFix: string, module = 'web'): string {
    if (module === 'web') {
      return environment.endPointWeb + postFix;
    }
  }

  public getAPINode(postFix: string, module = 'web'): string {
    if (module === 'web') {
      return environment.endPointNode + postFix;
    }
  }
}

export const configService = new ConfigServerService();
