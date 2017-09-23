import {AfterViewChecked, ChangeDetectorRef, Component} from "@angular/core";

import { User } from "../../model/user";
import { UserService } from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: [ "./login.component.css" ],
  providers: [UserService]
})
export class LoginComponent implements AfterViewChecked {

    private _credentials: User;
    public emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    public error: Error;

    constructor(private cdRef: ChangeDetectorRef, private userService: UserService, private router: Router) {
        this._credentials = new User;
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    public logUser() {
        this.userService.login(this._credentials)
            .then(() => {
                this.router.navigate(["/home"]);
            })
            .catch(error => {
                this.error = JSON.parse(error._body).error;
            });
    }

    get credentials(): User {
        return this._credentials;
    }

    set credentials(value: User) {
        this._credentials = value;
    }
}
