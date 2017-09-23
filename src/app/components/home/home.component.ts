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
import {FileUtils} from "../../utils/FileUtils";

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
    private navigationBar: NavElement[] = [];
    private isSharedFolderPage: Boolean = false;
    public fileNamePattern = /[^\\]*\.[a-zA-Z]{3}$/;
    public emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    private fileUtils: FileUtils = new FileUtils();

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
        this.isSharedFolderPage = false;
        this.currentPath = "";
        this.currentFolder = this._userData._id.toString();
        this.displayFolderContents(this.currentFolder, this.currentPath);
    }

    public displaySharedFolders() {
        this.pageTitle = "Dossiers partagés";
        this.isSharedFolderPage = true;
        this.currentFolder = "";
        this.currentPath = "";
        this.fileService.getSharedFolders(this._userData._id)
            .then(elementList => {
                this.fileUtils.elementList = elementList;
                this.fileUtils.filterList();
                this.createSharedNavigationTab();
            })
            .catch(error => console.log(error));
    }

    public displayFolderContents(elementName: string, path: string) {
        this.fileService.getContentFromFolder(this._userData._id, elementName, path)
            .then(elementList => {
                this.currentFolder = elementName;
                this.currentPath = path;
                this.fileUtils.elementList = elementList;
                this.fileUtils.filterList();
                (this.isSharedFolderPage) ? this.createSharedNavigationTab() : this.createNavigationTab();
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
            const folders = (this.currentPath + "/" + this.currentFolder).split("/").filter(Boolean);
            for (let ind = 0; ind < folders.length; ind++) {
                this.navigationBar.push(new NavElement(folders[ind]));
            }
            this.navigationBar[0].title = "Mon dossier";
            this.navigationBar[0].path = "";
            for (let ind = 1; ind < folders.length; ind++) {
                if (this.navigationBar[ind - 1].path !== "") {
                    this.navigationBar[ind].path = "/" + this.navigationBar[ind - 1].path +  "/" + folders[ind];
                } else {
                    this.navigationBar[ind].path =  "/" + folders[ind - 1];
                }
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
        const folders = (this.currentPath + "/" + this.currentFolder).split("/").filter(Boolean);
        this.navigationBar.push(new NavElement(""));
        this.navigationBar[0].title = "Dossiers partagés";
        this.navigationBar[0].folder = "";
        this.navigationBar[0].path = "";
        for (let ind = 0; ind < folders.length; ind++) {
            this.navigationBar.push(new NavElement(folders[ind]));
        }
        let folderIndex = 1;
        for (let ind = 0; ind < folders.length; ind++) {
            if (this.navigationBar[folderIndex - 1].path !== "") {
                this.navigationBar[folderIndex].path = this.navigationBar[folderIndex - 1].path;
            } else {
                this.navigationBar[folderIndex].path = "";
            }
            this.navigationBar[folderIndex].title = this.navigationBar[folderIndex].folder;
            folderIndex++;
        }
    }

    public getElement(elementName: string) {
        if (this.fileUtils.isFile(elementName)) {
            const path = (this.currentPath === "" && this.currentFolder === "") ? "" : this.currentPath + "/" + this.currentFolder;
            this.fileService.downloadFile(this._userData._id, elementName, path)
                .then(res => fileSaver.saveAs(res, elementName))
                .catch(error => console.log(error));
        } else {
            this.navigateToFolder(elementName);
        }
    }

    public getBreadCrumbClasses(elementName: string) {
        if (elementName === this.currentFolder) {
            return("breadcrumb-item active success");
        } else {
            return("breadcrumb-item");
        }
    }

    public openDialogNewFile(): void {
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

    public openDialogNewFolder(): void {
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

    public openDialogUserInfo(): void {
        const dialogRef = this.dialog.open(DialogUserInfoComponent, {
            width: "40%"
        });
    }

    public openDialogStockage(): void {
        const dialogRef = this.dialog.open(DialogStockageComponent, {
            width: "40%"
        });
        dialogRef.componentInstance.isPremiumUser = this.userData.isPremiumUser;
        dialogRef.componentInstance.premiumDateOfExpiration = this.userData.premiumDateOfExpiration;
    }

    public openDialogShare(): void {
        const dialogRef = this.dialog.open(DialogStockageComponent, {
            width: "40%"
        });
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

    get userData(): User {
        return this._userData;
    }
}
