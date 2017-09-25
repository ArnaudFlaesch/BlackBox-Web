import {Component, OnInit, ViewChild} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {FileService} from "../../services/file.service";
import {MdDialog} from "@angular/material";
import {NavElement} from "../../model/navElement";
import {DialogNewFileComponent} from "../dialogs/DialogNewFileComponent";
import {DialogNewFolderComponent} from "../dialogs/DialogNewFolderComponent";
import {DialogUserInfoComponent} from "../dialogs/DialogUserInfoComponent";
import {DialogStockageComponent} from "../dialogs/DialogStockageComponent";
import {ContextMenuComponent} from "ngx-contextmenu";
import {FileUtils} from "../../utils/FileUtils";
import {DialogShareComponent} from "../dialogs/DialogShareComponent";

import * as fileSaver from "file-saver";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    providers: [UserService],
    styleUrls: ["./home.component.css"]
})

export class HomeComponent implements OnInit {
    private _pageTitle = "";
    private _currentPath = "";
    private _currentFolder = "";
    private _userData: User = new User();
    private _navigationBar: NavElement[] = [];
    private isSharedFolderPage: Boolean = false;
    public fileNamePattern = /[^\\]*\.[a-zA-Z]{3}$/;
    public emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    private _newElementName = "";
    private _error: Error;
    private _fileUtils: FileUtils = new FileUtils();

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
        this._pageTitle = "Dossier personnel";
        this.isSharedFolderPage = false;
        this.currentPath = "";
        this.currentFolder = this._userData._id.toString();
        this.displayFolderContents(this.currentFolder, this.currentPath);
    }

    public displaySharedFolders() {
        this._pageTitle = "Dossiers partagés";
        this.isSharedFolderPage = true;
        this.currentFolder = "";
        this.currentPath = "";
        this.fileService.getSharedFolders(this._userData._id)
            .then(elementList => {
                this._fileUtils.elementList = elementList;
                this._fileUtils.filterList();
                this.createSharedNavigationTab();
            })
            .catch(error => this._error = error);
    }

    public displayFolderContents(elementName: string, path: string) {
        this.fileService.getContentFromFolder(this._userData._id, elementName, path)
            .then(elementList => {
                this.currentFolder = elementName;
                this.currentPath = path;
                this._fileUtils.elementList = elementList;
                this._fileUtils.filterList();
                (this.isSharedFolderPage) ? this.createSharedNavigationTab() : this.createNavigationTab();
            })
            .catch(error => this._error = error);
    }

    public navigateToFolder(elementName: string) {
        const path = (this.currentPath === "" && this.currentFolder === "") ? "" : this.currentPath += "/" + this.currentFolder;
        this.displayFolderContents(elementName, path);
    }

    public createNavigationTab() {
        this._navigationBar = [];
        if (this.currentPath !== "") {
            const folders = (this.currentPath + "/" + this.currentFolder).split("/").filter(Boolean);
            for (let ind = 0; ind < folders.length; ind++) {
                this._navigationBar.push(new NavElement(folders[ind]));
            }
            this._navigationBar[0].title = "Mon dossier";
            this._navigationBar[0].path = "";
            for (let ind = 1; ind < folders.length; ind++) {
                if (this._navigationBar[ind - 1].path !== "") {
                    this._navigationBar[ind].path = "/" + this._navigationBar[ind - 1].path +  "/" + folders[ind];
                } else {
                    this._navigationBar[ind].path =  "/" + folders[ind - 1];
                }
                this._navigationBar[ind].title = this._navigationBar[ind].folder;
            }
        } else {
            this._navigationBar.push(new NavElement(""));
            this._navigationBar[0].title = "Mon dossier";
            this._navigationBar[0].path = "";
        }
    }

    public createSharedNavigationTab() {
        this._navigationBar = [];
        const folders = (this.currentPath + "/" + this.currentFolder).split("/").filter(Boolean);
        this._navigationBar.push(new NavElement(""));
        this._navigationBar[0].title = "Dossiers partagés";
        this._navigationBar[0].folder = "";
        this._navigationBar[0].path = "";
        for (let ind = 0; ind < folders.length; ind++) {
            this._navigationBar.push(new NavElement(folders[ind]));
        }
        let folderIndex = 1;
        for (let ind = 0; ind < folders.length; ind++) {
            if (this._navigationBar[folderIndex - 1].path !== "") {
                this._navigationBar[folderIndex].path = this._navigationBar[folderIndex - 1].path;
            } else {
                this._navigationBar[folderIndex].path = "";
            }
            this._navigationBar[folderIndex].title = this._navigationBar[folderIndex].folder;
            folderIndex++;
        }
    }

    public getElement(elementName: string) {
        if (this._fileUtils.isFile(elementName)) {
            const path = (this.currentPath === "" && this.currentFolder === "") ? "" : this.currentPath + "/" + this.currentFolder;
            this.fileService.downloadFile(this._userData._id, elementName, path)
                .then(res => fileSaver.saveAs(res, elementName))
                .catch(error => this._error = JSON.parse(error._body).error);
        } else {
            this.navigateToFolder(elementName);
        }
    }

    public renameElement(elementName: string) {
        const path = (this.currentPath === "" && this.currentFolder === "") ? "" : this.currentPath + "/" + this.currentFolder;
        this.fileService.renameElement(this.userData._id, elementName, this._newElementName, path)
            .then(() => this.displayFolderContents(this.currentFolder, this.currentPath))
            .catch(error => this._error = JSON.parse(error._body).error);
    }

    public deleteElement(elementName: string) {
        const path = (this.currentPath === "" && this.currentFolder === "") ? "" : this.currentPath + "/" + this.currentFolder;
        this.fileService.deleteElement(this.userData._id, elementName, path)
            .then(() => this.displayFolderContents(this.currentFolder, this.currentPath))
            .catch(error => this._error = JSON.parse(error._body).error);
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
        this.dialog.open(DialogUserInfoComponent, { width: "40%" });
    }

    public openDialogStockage(): void {
        const dialogRef = this.dialog.open(DialogStockageComponent, {
            width: "40%"
        });
        dialogRef.componentInstance.isPremiumUser = this.userData.isPremiumUser;
        dialogRef.componentInstance.premiumDateOfExpiration = this.userData.premiumDateOfExpiration;
    }

    public openDialogShare(elementName: string): void {
        const dialogRef = this.dialog.open(DialogShareComponent, {
            width: "40%"
        });
        dialogRef.componentInstance.elementName = elementName;
        dialogRef.componentInstance.currentPath = this.currentPath;
    }

    public logout() {
        this.userService.destroySession();
        this.router.navigate(["/login"]);
    }

    get pageTitle(): string {
        return this._pageTitle;
    }

    set pageTitle(value: string) {
        this._pageTitle = value;
    }

    get error(): Error {
        return this._error;
    }

    set error(value: Error) {
        this._error = value;
    }

    get newElementName(): string {
        return this._newElementName;
    }

    set newElementName(value: string) {
        this._newElementName = value;
    }

    get fileUtils(): FileUtils {
        return this._fileUtils;
    }

    set fileUtils(value: FileUtils) {
        this._fileUtils = value;
    }

    get currentFolder(): string {
        return this._currentFolder;
    }

    set currentFolder(value: string) {
        this._currentFolder = value;
    }

    get navigationBar(): NavElement[] {
        return this._navigationBar;
    }

    set navigationBar(value: NavElement[]) {
        this._navigationBar = value;
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
