import {Component, OnInit, ViewChild} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {FileService} from "../../services/file.service";
import * as fileSaver from "file-saver";

import {MdDialog} from "@angular/material";
import {NavElement} from "../../model/navElement";
import {DialogNewFileComponent} from "../dialogs/DialogNewFileComponent";
import {DialogNewFolderComponent} from "../dialogs/DialogNewFolderComponent";
import {DialogUserInfoComponent} from "../dialogs/DialogUserInfoComponent";
import {DialogStockageComponent} from "../dialogs/DialogStockageComponent";
import {ContextMenuComponent} from "ngx-contextmenu";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    providers: [UserService],
    styleUrls: ["./home.component.css"]
})

export class HomeComponent implements OnInit {
    private pageTitle = "";
    private _currentPath = "";
    private _currentFolder = "";
    private _userData: User = new User();
    private _elementList: String[] = [];
    private _searchList: String[] = [];
    private _search = "";
    private navigationBar: NavElement[] = [];
    private canShareElements: Boolean = false;
    public emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

    constructor(public dialog: MdDialog, private userService: UserService, private fileService: FileService, private router: Router) {}

    ngOnInit(): void {
        if (this.userService.getUserDataFromSession() == null) {
            this.router.navigate(["/login"]);
        } else {
            this._userData = this.userService.getUserDataFromSession();
            this.displayPersonnalFolder();
        }
    }

    public displayPersonnalFolder() {
        this.pageTitle = "Dossier personnel";
        this.canShareElements = false;
        this.currentPath = "";
        this.currentFolder = this._userData._id.toString();
        this.displayFolderContents(this.currentFolder, this.currentPath);
    }

    public displaySharedFolders() {
        this.pageTitle = "Dossiers partagés";
        this.canShareElements = true;
        this.currentFolder = "";
        this.currentPath = "";
        this.fileService.getSharedFolders(this._userData._id)
            .then(elementList => {
                this.elementList = elementList;
                this.searchList = elementList;
                this.createSharedNavigationTab();
            })
            .catch(error => console.log(error));
    }

    public displayFolderContents(elementName: string, path: string) {
        this.fileService.getContentFromFolder(this._userData._id, elementName, path)
            .then(elementList => {
                this.currentFolder = elementName;
                this.currentPath = path;
                this.elementList = elementList;
                this.searchList = elementList;
                (this.canShareElements) ? this.createSharedNavigationTab() : this.createNavigationTab();
            })
            .catch(error => {
                console.log(error);
            });
    }

    public navigateToFolder(elementName: string) {
        const path = (this.currentPath === "" && this.currentFolder === "") ? "" : this.currentPath += "/" + this.currentFolder;
        this.displayFolderContents(elementName, path);
    }

    public createNavigationTab() {
        this.navigationBar = [];
        if (this.currentPath !== "") {
            let folders = (this.currentPath + "/" + this.currentFolder).split("/").filter(Boolean);
            for (let ind = 0; ind < folders.length; ind++) {
                this.navigationBar.push(new NavElement(folders[ind]));
            }
            this.navigationBar[0].title = "Mon dossier";
            this.navigationBar[0].path = "";
            for (let ind = 1; ind < folders.length; ind++) {
                this.navigationBar[ind].path = (this.navigationBar[ind - 1].path !== "" ?  "/" + this.navigationBar[ind - 1].path +  "/" + folders[ind] : "/" + folders[ind - 1]);
                this.navigationBar[ind].title = this.navigationBar[ind].folder;
            }
        } else {
            this.navigationBar.push(new NavElement(""));
            this.navigationBar[0].title = "Mon dossier";
            this.navigationBar[0].path = "";
        }
    }

    public createSharedNavigationTab() {
        this.navigationBar = [];
        let folders = (this.currentPath + "/" + this.currentFolder).split("/").filter(Boolean);
        this.navigationBar.push(new NavElement(""));
        this.navigationBar[0].title = "Dossiers partagés";
        this.navigationBar[0].folder = "";
        this.navigationBar[0].path = "";
        for (let ind = 0; ind < folders.length; ind++) {
            this.navigationBar.push(new NavElement(folders[ind]));
        }
        let folderIndex = 1;
        for (let ind = 0; ind < folders.length; ind++) {
            this.navigationBar[folderIndex].path = (this.navigationBar[folderIndex - 1].path !== "" ? this.navigationBar[folderIndex - 1].path : "");
            this.navigationBar[folderIndex].title = this.navigationBar[folderIndex].folder;
            folderIndex++;
        }
    }

    public filterList() {
        this._searchList = this.elementList.filter(
            element => element.indexOf(this._search) !== -1
        );
    }

    public getElement(elementName: string) {
        if (this.isFile(elementName)) {
            const path = (this.currentPath === "" && this.currentFolder === "") ? "" : this.currentPath + "/" + this.currentFolder;
            this.fileService.downloadFile(this._userData._id, elementName, path)
                .then(res => fileSaver.saveAs(res, elementName))
                .catch(error => console.log(error));
        } else {
            this.navigateToFolder(elementName);
        }
    }

    public isFile(elementName: string) {
        if (elementName[elementName.length - 4] === ".") {
            return(false);
        } else {
            return(true);
        }
    }

    public getBreadCrumbClasses(elementName: string) {
        if (elementName === this.currentFolder) {
            return("breadcrumb-item active success");
        } else {
            return("breadcrumb-item");
        }
    }

    openDialogNewFile(): void {
        const dialogRef = this.dialog.open(DialogNewFileComponent, {
            width: "33%"
        });
        dialogRef.componentInstance.currentPath = this.currentPath;
        dialogRef.componentInstance.currentFolder = this.currentFolder;
        dialogRef.afterClosed().subscribe(() => {
            if (this.currentFolder === "" && this.currentPath === "") {
                this.displaySharedFolders();
            } else {
                this.displayFolderContents(this.currentFolder, this.currentPath);
            }
        });
    }

    openDialogNewFolder(): void {
        const dialogRef = this.dialog.open(DialogNewFolderComponent, {
            width: "33%"
        });
        dialogRef.componentInstance.currentPath = this.currentPath;
        dialogRef.componentInstance.currentFolder = this.currentFolder;
        dialogRef.afterClosed().subscribe(() => {
            if (this.currentFolder === "" && this.currentPath === "") {
                this.displaySharedFolders();
            } else {
                this.displayFolderContents(this.currentFolder, this.currentPath);
            }
        });
    }

    openDialogUserInfo(): void {
        const dialogRef = this.dialog.open(DialogUserInfoComponent, {
            width: "40%"
        });
    }

    openDialogStockage(): void {
        const dialogRef = this.dialog.open(DialogStockageComponent, {
            width: "40%"
        });
        dialogRef.componentInstance.isPremiumUser = this.userData.isPremiumUser;
        dialogRef.componentInstance.premiumDateOfExpiration = this.userData.premiumDateOfExpiration;
    }

    openDialogShare(): void {
        const dialogRef = this.dialog.open(DialogStockageComponent, {
            width: "40%"
        });
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
