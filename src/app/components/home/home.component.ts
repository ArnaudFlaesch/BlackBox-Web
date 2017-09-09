import {Component} from "@angular/core";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {FileService} from "../../service/file.service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    providers: [UserService],
    styleUrls: ["./home.component.css"]
})
export class HomeComponent {
    private currentPath: String = "";
    private _userData: User = new User();
    private _elementList: String[] = [];
    private _searchList: String[] = [];
    private _search = "";

    constructor(private userService: UserService, private fileService: FileService, private router: Router) {
        if (userService.getUserDataFromSession() == null) {
            this.router.navigate(["/login"]);
        } else {
            this._userData = userService.getUserDataFromSession();
            this.displayPersonnalFolder();
        }
    }

    private displayPersonnalFolder() {
        this.currentPath = this.userService.getUserDataFromSession()._id.toString();
        this.fileService.getContentFromFolder(this._userData._id, this._userData._id.toString(), "")
            .then(elementList => {
                this.elementList = elementList;
                this.searchList = elementList;
            })
            .catch(error => {
                console.log(error);
            });
    }

    public filterList() {
        this._searchList = this.elementList.filter(
            element => element.indexOf(this._search) !== -1
        );
    }

    public logout() {
        this.userService.destroySession();
        this.router.navigate(["/login"]);
    }

    get elementList(): String[] {
        return this._elementList;
    }

    set elementList(elementList: String[]) {
        this._elementList = elementList;
    }

    get userData(): User {
        return this._userData;
    }

    get searchList(): String[] {
        return this._searchList;
    }

    set searchList(value: String[]) {
        this._searchList = value;
    }

    get search(): string {
        return this._search;
    }

    set search(value: string) {
        this._search = value;
    }
}
