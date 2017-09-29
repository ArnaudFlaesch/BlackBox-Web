import { Component } from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class BlackBoxComponent {

    public constructor(private router: Router) {}

    public goToHome() {
        this.router.navigate(["/home"])
            .then()
            .catch();
    }
}
