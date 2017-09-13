import {AfterViewChecked, ChangeDetectorRef, Component} from "@angular/core";
import {User} from "../../model/user";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements AfterViewChecked {

    private _registeredUser: User;
    public emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    constructor(private cdRef: ChangeDetectorRef, private userService: UserService, private router: Router) {
        this.registeredUser = new User();
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
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

    get registeredUser(): User {
        return this._registeredUser;
    }

    set registeredUser(value: User) {
        this._registeredUser = value;
    }
}
