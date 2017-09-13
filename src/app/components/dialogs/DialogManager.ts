import {AfterViewChecked, ChangeDetectorRef, Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {User} from "../../model/user";
import {UserService} from "../../services/user.service";
import {FileService} from "../../services/file.service";
import {Router} from "@angular/router";

@Component({
    selector: "newFile",
    templateUrl: "newFile.html",
})
export class DialogNewFileComponent  implements AfterViewChecked {

    private _fileName = "";
    private _currentPath = "";
    private _currentFolder = "";
    public fileNamePattern = /[^\\]*\.[a-zA-Z]{3}$/;

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogNewFileComponent>,
                @Inject(MD_DIALOG_DATA) public data: any,
                private fileService: FileService, private userService: UserService) {
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    createNewFile() {
        let userId = this.userService.getUserDataFromSession()._id;
        this.fileService.createNewFile(userId, this.fileName, this.currentFolder, this.currentPath);
        this.dialogRef.close();
    }

    get fileName(): string {
        return this._fileName;
    }

    set fileName(value: string) {
        this._fileName = value;
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
}

@Component({
    selector: "newFolder",
    templateUrl: "newFolder.html",
})
export class DialogNewFolderComponent implements AfterViewChecked {

    private _folderName = "";
    private _currentPath = "";
    private _currentFolder = "";

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogNewFileComponent>,
                @Inject(MD_DIALOG_DATA) public data: any,
                private fileService: FileService, private userService: UserService) {
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    createNewFolder() {
        let userId = this.userService.getUserDataFromSession()._id;
        this.fileService.createNewFolder(userId, this.folderName, this.currentFolder, this.currentPath);
        this.dialogRef.close();
    }

    get folderName(): string {
        return this._folderName;
    }

    set folderName(value: string) {
        this._folderName = value;
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
}

@Component({
    selector: "userInfo",
    templateUrl: "userInfo.html",
})
export class DialogUserInfoComponent implements AfterViewChecked {

    private _newUserInfos: User = new User();
    private _oldPassword =  "";
    private _newPassword =  "";
    private _password =  "";

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogUserInfoComponent>, private router: Router,
                @Inject(MD_DIALOG_DATA) public data: any, private userService: UserService) { }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public sendModifications() {
        this._newUserInfos._id = this.userService.getUserDataFromSession()._id;
        this.userService.update(this._newUserInfos)
            .then(user => this.userService.storeTokenInSession(user))
            .catch(error => console.log(error));
    }

    public changePassword() {
        let userId = this.userService.getUserDataFromSession()._id;
        this.userService.updateUserPassword(userId, this._oldPassword, this._newPassword)
            .then(user => this.userService.storeTokenInSession(user))
            .catch(error => console.log(error));
    }

    public deleteAccount() {
        let userId = this.userService.getUserDataFromSession()._id;
        this.userService.deleteAccount(userId, this._password)
            .then(res => {
                this.userService.destroySession();
                this.router.navigate(["/login"]);
            })
            .catch(error => console.log(error));
        this.dialogRef.close();
    }

    get newUserInfos(): User {
        return this._newUserInfos;
    }

    set newUserInfos(value: User) {
        this._newUserInfos = value;
    }

    get oldPassword(): string {
        return this._oldPassword;
    }

    set oldPassword(value: string) {
        this._oldPassword = value;
    }

    get newPassword(): string {
        return this._newPassword;
    }

    set newPassword(value: string) {
        this._newPassword = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }
}
