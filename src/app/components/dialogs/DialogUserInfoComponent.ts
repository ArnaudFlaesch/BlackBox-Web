import {AfterViewChecked, ChangeDetectorRef, Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {User} from "../../model/user";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
    selector: "userInfo",
    templateUrl: "userInfo.html",
})
export class DialogUserInfoComponent implements AfterViewChecked {

    private _newUserInfos: User = new User();
    private _oldPassword =  "";
    private _newPassword =  "";
    private _password =  "";
    public error: Error;

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
            .catch(error => this.error = JSON.parse(error._body).error);
    }

    public changePassword() {
        const userId = this.userService.getUserDataFromSession()._id;
        this.userService.updateUserPassword(userId, this._oldPassword, this._newPassword)
            .then(user => this.userService.storeTokenInSession(user))
            .catch(error => this.error = JSON.parse(error._body).error);
    }

    public deleteAccount() {
        const userId = this.userService.getUserDataFromSession()._id;
        this.userService.deleteAccount(userId, this._password)
            .then(() => {
                this.userService.destroySession();
                this.dialogRef.close();
                this.router.navigate(["/login"]);
            })
            .catch(error => this.error = JSON.parse(error._body).error);
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
