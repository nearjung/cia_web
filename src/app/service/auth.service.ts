import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { tap, mapTo, catchError, map } from 'rxjs/operators';
import { Tokens } from '../models/tokens';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    _apiCojUserServer: string;
    header: HttpHeaders
    option: any = {}
    private readonly JWT_TOKEN = 'JWT_TOKEN';
    // private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
    private loggedUser: string;

    constructor(private httpClient: HttpClient, private configService: ConfigServerService) {
        this.header = new HttpHeaders().set("Content-Type", "application/json; charset=UTF-8");
        this.option.headers = this.header;
    }

    login(email: string, password: string) {
        let params = '?email=' + email + '&password=' + password;
        return this.httpClient.get<any>(this.configService.getAPI('api/user/userLogin.php') + params, { observe: 'response' }).pipe(
            map(response => {
                if (response.body.value) {
                    let token: string[] = response.headers.get("Authorization").split(" ");
                    if (token.length > 1) {
                        this.doLoginUser(email, {
                            jwt: token[1], refreshToken: ""
                        });
                    }
                }
                return {
                    serviceResult: response.body
                }
            })
        );
    }

    logout() {
        this.doLogoutUser();
    }

    private doLoginUser(username: string, tokens: Tokens) {
        this.loggedUser = username;
        this.storeTokens(tokens);
    }

    private storeTokens(tokens: Tokens) {
        localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    }

    isLoggedIn() {
        return !!this.getJwtToken();
    }

    getJwtToken() {
        return localStorage.getItem(this.JWT_TOKEN);
    }

    private doLogoutUser() {
        this.loggedUser = null;
        this.removeTokens();
    }

    private removeTokens() {
        localStorage.removeItem(this.JWT_TOKEN);
    }
}
