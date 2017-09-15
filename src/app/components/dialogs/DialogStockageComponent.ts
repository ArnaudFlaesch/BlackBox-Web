import {AfterViewChecked, ChangeDetectorRef, Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
    selector: "stockage",
    templateUrl: "stockage.html",
})
export class DialogStockageComponent implements AfterViewChecked {

    private _isPremiumUser: Boolean;
    private _premiumDateOfExpiration: Date;

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogStockageComponent>,
                @Inject(MD_DIALOG_DATA) public data: any) {
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    onNoClick(): void {
        this.dialogRef.close();
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
}
