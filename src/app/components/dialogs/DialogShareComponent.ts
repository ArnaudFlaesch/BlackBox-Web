import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {FileService} from "../../services/file.service";
import {UserService} from "../../services/user.service";
import {UserFolderPermission} from "../../model/UserFolderPermission";

@Component({
    selector: "share",
    templateUrl: "share.html",
})
export class DialogShareComponent  implements AfterViewChecked, OnInit {

    private _elementName: string;
    private _currentPath: string;
    private _listUsers: UserFolderPermission[] = [];
    public emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    private _newSharedUserEmail: string;
    private _checkCanUpload: Boolean = false;
    private _checkCanDownload: Boolean = false;
    public error: Error;

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogShareComponent>,
                @Inject(MD_DIALOG_DATA) public data: any,
                private userService: UserService, private fileService: FileService) {
    }

    public addUserToShareList() {
        this.fileService.saveUserToSharedElement(this.userService.getUserDataFromSession()._id, this.elementName, this.currentPath,
            this.newSharedUserEmail, null, this._checkCanDownload, this._checkCanUpload)
            .then(() => this.getUsersListFromServer())
            .catch(error => this.error = error);
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngOnInit() {
        this.getUsersListFromServer();
    }

    getUsersListFromServer() {
        this.fileService.getUsersWhoShareElement(this.userService.getUserDataFromSession()._id, this.elementName, this.currentPath)
            .then(userList => this.listUsers = userList)
            .catch(error => this.error = error);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    get checkCanUpload(): Boolean {
        return this._checkCanUpload;
    }

    set checkCanUpload(value: Boolean) {
        this._checkCanUpload = value;
    }

    get checkCanDownload(): Boolean {
        return this._checkCanDownload;
    }

    set checkCanDownload(value: Boolean) {
        this._checkCanDownload = value;
    }

    get newSharedUserEmail(): string {
        return this._newSharedUserEmail;
    }

    set newSharedUserEmail(value: string) {
        this._newSharedUserEmail = value;
    }

    get elementName(): string {
        return this._elementName;
    }

    set elementName(value: string) {
        this._elementName = value;
    }

    get listUsers(): UserFolderPermission[] {
        return this._listUsers;
    }

    set listUsers(value: UserFolderPermission[]) {
        this._listUsers = value;
    }

    get currentPath(): string {
        return this._currentPath;
    }

    set currentPath(value: string) {
        this._currentPath = value;
    }
}
