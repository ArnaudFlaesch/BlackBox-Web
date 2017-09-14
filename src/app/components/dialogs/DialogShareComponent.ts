import {AfterViewChecked, ChangeDetectorRef, Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {FileService} from "../../services/file.service";
import {UserService} from "../../services/user.service";

@Component({
    selector: "share",
    templateUrl: "share.html",
})
export class DialogShareComponent  implements AfterViewChecked {

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogShareComponent>,
                @Inject(MD_DIALOG_DATA) public data: any,
                private fileService: FileService, private userService: UserService) {
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
