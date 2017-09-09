import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { User } from "../model/user";

@Injectable()
export class UserService {

    private headers = new Headers();
    private tokenKey = "USER_ID";
    private SERVICES_URL = "http://localhost:3000/user";

    constructor(private http: Http) {
        this.headers.append("Access-Control-Allow-Origin" , "*");
        this.headers.append("Access-Control-Allow-Headers" , "Origin, X-Requested-With, Content-Type, Accept");
        this.headers.append("Content-Type" , "application/json");
    }

    public getUserData(): User {
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
            .post(this.SERVICES_URL + "/login", credentials, {headers: this.headers})
            .toPromise()
            .then(res => this.storeTokenInSession(res.json() as User))
            .catch(this.handleError);
    }

    public create(user: User): Promise<User> {
        return this.http
            .post(this.SERVICES_URL + "/register", user, {headers: this.headers})
            .toPromise()
            .then(res => res.json().data as User)
            .catch(this.handleError);
    }

    public getUser(id: number): Promise<User> {
        const url = this.SERVICES_URL + "/info/" + id;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json() as User)
            .catch(this.handleError);
    }

    delete(id: number): Promise<void> {
        const url = this.SERVICES_URL + id;
        return this.http.delete(url, {headers: this.headers})
          .toPromise()
          .then(() => null)
          .catch(this.handleError);
    }

    update(user: User): Promise<User> {
        const url = this.SERVICES_URL + user._id;
        return this.http
            .put(url, JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then(() => user)
            .catch(this.handleError);
      }

    private handleError(error: any): Promise<any> {
        console.error("An error occurred", error);
        return Promise.reject(error.message || error);
    }
}
