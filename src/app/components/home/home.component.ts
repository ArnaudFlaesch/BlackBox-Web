import {Component} from "@angular/core";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {FileService} from "../../service/file.service";
import * as fileSaver from "file-saver";

import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from "@angular/material";
import {DialogNewFileComponent} from "../dialogs/DialogManager";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    providers: [UserService],
    styleUrls: ["./home.component.css"]
})

export class HomeComponent {
    private _currentPath = "";
    private _currentFolder = "";
    private _userData: User = new User();
    private _elementList: String[] = [];
    private _searchList: String[] = [];
    private _search = "";

    constructor(public dialog: MdDialog, private userService: UserService, private fileService: FileService, private router: Router) {
        if (userService.getUserDataFromSession() == null) {
            this.router.navigate(["/login"]);
        } else {
            this._userData = userService.getUserDataFromSession();
            this.displayPersonnalFolder();
        }
    }

    public displayPersonnalFolder() {
        this.currentPath = "";
        this.currentFolder = this._userData._id.toString();
        this.displayFolderContents(this.currentFolder);
    }

    public displayFolderContents(elementName: string) {
        this.fileService.getContentFromFolder(this._userData._id, elementName, this.currentPath)
            .then(elementList => {
                this.currentPath = (this.currentPath !== "") ? this.currentPath += "/" + this.currentFolder : "";
                this.currentFolder = elementName;
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

    public getElement(elementName: string) {
        if (elementName[elementName.length - 4] === ".") {
            this.fileService.downloadFile(this._userData._id, elementName, "/" + this._currentPath)
                .then(res => fileSaver.saveAs(res, elementName))
                .catch(error => console.log(error));
        } else {
            this.displayFolderContents(elementName);
        }
    }

    openDialog(): void {
        let dialogRef = this.dialog.open(DialogNewFileComponent, {
            width: "250px"
            //data: { name: this.name, animal: this.animal }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log("The dialog was closed");
        });
    }

    public newFolder() {

    }

    public getIcon(elementName: String): String {
        if (elementName[elementName.length - 4] === ".") {
            return("file");
        } else {
            return ("folder");
        }
    }

    public logout() {
        this.userService.destroySession();
        this.router.navigate(["/login"]);
    }

    get currentFolder(): string {
        return this._currentFolder;
    }

    set currentFolder(value: string) {
        this._currentFolder = value;
    }

    get currentPath(): string {
        return this._currentPath;
    }

    set currentPath(value: string) {
        this._currentPath = value;
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
