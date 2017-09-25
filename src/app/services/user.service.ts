import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { User } from "../model/user";
import {environment} from "../../environments/environment";

@Injectable()
export class UserService {

    private headers = new Headers();
    private tokenKey = "USER_ID";
    private SERVICE_ENDPOINT = environment.SERVICES_URL + "/user";

    constructor(private http: Http) {
        this.headers.append("Access-Control-Allow-Headers" , "Origin, X-Requested-With, Content-Type, Accept");
        this.headers.append("Content-Type" , "application/json");
    }

    public getUserDataFromSession(): User {
        return (JSON.parse(localStorage.getItem(this.tokenKey)));
    }

    public storeTokenInSession(userData: User): User {
        localStorage.setItem(this.tokenKey, JSON.stringify(userData));
        return (userData);
    }

    public destroySession(): void {
        localStorage.setItem(this.tokenKey, null);
    }

    public login(credentials: User): Promise<User> {
        return this.http
            .post(this.SERVICE_ENDPOINT + "/login", credentials, {headers: this.headers})
            .toPromise()
            .then(res => this.storeTokenInSession(res.json() as User))
            .catch(this.handleError);
    }

    public create(user: User): Promise<User> {
        return this.http
            .post(this.SERVICE_ENDPOINT + "/register", user, {headers: this.headers})
            .toPromise()
            .then(res => res.json().data as User)
            .catch(this.handleError);
    }

    public update(user: User): Promise<User> {
        return this.http
            .post(this.SERVICE_ENDPOINT + "/update", user, {headers: this.headers})
            .toPromise()
            .then(() => user)
            .catch(this.handleError);
    }

    public updateUserPassword(userId: Number, oldPassword: string, newPassword: string): Promise<User> {
        return this.http
            .post(this.SERVICE_ENDPOINT + "/updateUserPassword",
                {"userId": userId, "oldPassword": oldPassword, "newPassword": newPassword},
                {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    public deleteAccount(userId: Number, password: string): Promise<User> {
        return this.http
            .delete(this.SERVICE_ENDPOINT + "/delete", {headers: this.headers, params: {"userId": userId, "password": password}})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
