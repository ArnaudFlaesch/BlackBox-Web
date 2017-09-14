import {AfterViewChecked, ChangeDetectorRef, Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {FileService} from "../../services/file.service";
import {UserService} from "../../services/user.service";

@Component({
    selector: "move",
    templateUrl: "move.html",
})
export class DialogMoveComponent  implements AfterViewChecked {

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogMoveComponent>,
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
