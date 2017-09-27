import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {FileService} from "../../services/file.service";
import {UserService} from "../../services/user.service";
import {User} from "../../model/user";

@Component({
    selector: "share",
    templateUrl: "share.html",
})
export class DialogShareComponent  implements AfterViewChecked, OnInit {

    private _elementName: string;
    private _currentPath: string;
    private _listUsers: User[] = [];
    public emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    private _newSharedUserEmail: string;
    public error: Error;

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogShareComponent>,
                @Inject(MD_DIALOG_DATA) public data: any,
                private userService: UserService, private fileService: FileService) {
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngOnInit() {
        this.getUsersListFromServer();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public getUsersListFromServer() {
        this.fileService.getUsersWhoShareElement(this.userService.getUserDataFromSession()._id, this.elementName, this.currentPath)
            .then(userList => this.listUsers = userList)
            .catch(error => this.error = JSON.parse(error._body).error);
    }

    public addUserToShareList() {
        this.fileService.saveUserToSharedElement(this.userService.getUserDataFromSession()._id,
            this.elementName, this.currentPath, this.newSharedUserEmail)
            .then(() => this.getUsersListFromServer())
            .catch(error => this.error = JSON.parse(error._body).error);
    }

    public deleteAccess(sharedUserId: Number) {
        this.fileService.removeAccessForUser(this.userService.getUserDataFromSession()._id, sharedUserId, this.elementName, this.currentPath)
            .then(message => {
                this.error = message.message;
                this.getUsersListFromServer();
            })
            .catch(error => this.error = JSON.parse(error._body).error);
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

    get listUsers(): User[] {
        return this._listUsers;
    }

    set listUsers(value: User[]) {
        this._listUsers = value;
    }

    get currentPath(): string {
        return this._currentPath;
    }

    set currentPath(value: string) {
        this._currentPath = value;
    }
}
