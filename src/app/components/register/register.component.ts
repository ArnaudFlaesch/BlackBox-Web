import { Component } from "@angular/core";
import {User} from "../../model/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {

    registeredUser: User;
    private userService: UserService;

    constructor(private _userService: UserService) {
        this.userService = _userService;
        this.registeredUser = new User();
    }

    public registerUser() {
        this.userService.create(this.registeredUser)
            .then(user => {
                console.log(user);
            })
            .catch(error => {
                console.log(error);
            });
    }
}
