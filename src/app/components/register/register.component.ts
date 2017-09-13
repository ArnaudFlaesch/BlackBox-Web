import { Component } from "@angular/core";
import {User} from "../../model/user";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {

    registeredUser: User;
    private userService: UserService;
    public emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    constructor(private _userService: UserService, private router: Router) {
        this.userService = _userService;
        this.registeredUser = new User();
    }

    public registerUser() {
        this.userService.create(this.registeredUser)
            .then(user => {
                this.userService.login(this.registeredUser)
                    .then(() => {
                        this.router.navigate(["/home"]);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }
}
