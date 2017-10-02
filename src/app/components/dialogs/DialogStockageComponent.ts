import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {FileService} from "../../services/file.service";
import {UserService} from "../../services/user.service";

@Component({
    selector: "stockage",
    templateUrl: "stockage.html",
})
export class DialogStockageComponent implements AfterViewChecked, OnInit {

    private _userId: string;
    private _isPremiumUser: Boolean;
    private _premiumDateOfExpiration: Date;
    private _storageSpace: number;
    private _maxStorageSpace: number;
    private _percentageSize = 0;
    private _premiumUrl: string;
    public error: Error;

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogStockageComponent>,
                private fileService: FileService, private userService: UserService,
                @Inject(MD_DIALOG_DATA) public data: any) {
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this._userId = this.userService.getUserDataFromSession()._id.toString();
        this._premiumUrl = "http://localhost:3000/user/premium?userId=" + this.userId;
        this.fileService.getUserSpace(this.userService.getUserDataFromSession()._id)
            .then(res => {
                this.storageSpace = JSON.parse(res.message);
                this.percentageSize = ((this.storageSpace / 1024 / 1024) / (this.maxStorageSpace / 1024 / 1024)) * 100;
            })
            .catch(error => this.error = JSON.parse(error._body).error);
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get premiumUrl(): string {
        return this._premiumUrl;
    }

    set premiumUrl(value: string) {
        this._premiumUrl = value;
    }

    get isPremiumUser(): Boolean {
        return this._isPremiumUser;
    }

    set isPremiumUser(value: Boolean) {
        this._isPremiumUser = value;
    }

    get premiumDateOfExpiration(): Date {
        return this._premiumDateOfExpiration;
    }

    set premiumDateOfExpiration(value: Date) {
        this._premiumDateOfExpiration = value;
    }

    get storageSpace(): number {
        return this._storageSpace;
    }

    set storageSpace(value: number) {
        this._storageSpace = value;
    }
    get maxStorageSpace(): number {
        return this._maxStorageSpace;
    }

    set maxStorageSpace(value: number) {
        this._maxStorageSpace = value;
    }

    get percentageSize(): number {
        return this._percentageSize;
    }

    set percentageSize(value: number) {
        this._percentageSize = value;
    }
}
