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

  credentials: User;

  constructor(private userService: UserService, private router: Router) {
      this.credentials = new User;
  }

  public logUser() {
      this.userService.login(this.credentials)
          .then(() => {
              this.router.navigate(["/home"]);
          })
          .catch(error => {
              console.log(error);
          });
  }
}
