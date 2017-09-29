import {Component, OnInit, ViewChild} from "@angular/core";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Element} from "../../model/element";
import {User} from "../../model/user";
import {FileService} from "../../services/file.service";
import {MdDialog} from "@angular/material";
import {DialogNewFileComponent} from "../dialogs/DialogNewFileComponent";
import {DialogNewFolderComponent} from "../dialogs/DialogNewFolderComponent";
import {DialogUserInfoComponent} from "../dialogs/DialogUserInfoComponent";
import {DialogStockageComponent} from "../dialogs/DialogStockageComponent";
import {ContextMenuComponent} from "ngx-contextmenu";
import {FileUtils} from "../../utils/FileUtils";
import {DialogShareComponent} from "../dialogs/DialogShareComponent";

import * as fileSaver from "file-saver";
import {DialogMoveComponent} from "../dialogs/DialogMoveComponent";

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
    private _navigationBar: Element[] = [];
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
            this.router.navigate(["/login"])
                .then()
                .catch(error => this.error = error);
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
                this.navigationBar = this.fileUtils.createSharedNavigationTab(this.currentPath, this.currentFolder);
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
                this.navigationBar = (this.isSharedFolderPage)
                    ? this.fileUtils.createSharedNavigationTab(this.currentPath, this.currentFolder)
                    : this.fileUtils.createNavigationTab(this.currentPath, this.currentFolder);
            })
            .catch(error => this._error = error);
    }

    public navigateToFolder(elementName: string) {
        const path = (this.currentPath === "" && this.currentFolder === "") ? "" : this.currentPath += "/" + this.currentFolder;
        this.displayFolderContents(elementName, path);
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

    public openDialogMove(elementName: string): void {
        const dialogRef = this.dialog.open(DialogMoveComponent, {
            width: "40%",
            height: "60%"
        });
        dialogRef.componentInstance.elementToMove = elementName;
        dialogRef.componentInstance.originFolder = this.currentFolder;
        dialogRef.componentInstance.originPath = this.currentPath;
        dialogRef.componentInstance.isSharedFolderPage = this.isSharedFolderPage;
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

    get navigationBar(): Element[] {
        return this._navigationBar;
    }

    set navigationBar(value: Element[]) {
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
