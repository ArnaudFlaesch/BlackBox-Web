import { Component } from "@angular/core";

import { User } from "../../model/user";
import { UserService } from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: [ "./login.component.css" ],
  providers: [UserService]
})
export class LoginComponent  {

    private _credentials: User;
    public emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    constructor(private userService: UserService, private router: Router) {
        this._credentials = new User;
    }

    public logUser() {
        this.userService.login(this._credentials)
            .then(() => {
                this.router.navigate(["/home"]);
            })
            .catch(error => {
                console.log(error);
            });
    }

    get credentials(): User {
        return this._credentials;
    }

    set credentials(value: User) {
        this._credentials = value;
    }
}
