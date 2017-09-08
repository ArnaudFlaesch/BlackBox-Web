import {Component} from "@angular/core";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {User} from "../../model/user";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    providers: [UserService],
    styleUrls: ["./home.component.css"]
})
export class HomeComponent {
    private _userData: User = new User;

    constructor(private userService: UserService, private router: Router) {
        if (userService.getUserData() == null) {
            this.router.navigate(["/login"]);
        } else {
            userService.getUser(userService.getUserData()._id)
                .then(res => this._userData = res)
                .catch(error => Promise.reject(error.message || error));
        }
    }

    public logout() {
        this.userService.destroySession();
        this.router.navigate(["/login"]);
    }

    get userData(): User {
        return this._userData;
    }
}
