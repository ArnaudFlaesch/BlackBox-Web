import {Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
    selector: "newFile",
    templateUrl: "newFile.html",
})
export class DialogNewFileComponent {

    constructor(
        public dialogRef: MdDialogRef<DialogNewFileComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: "newFolder",
    templateUrl: "newFolder.html",
})
export class DialogNewFolderComponent {

    constructor(
        public dialogRef: MdDialogRef<DialogNewFileComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: "userInfo",
    templateUrl: "userInfo.html",
})
export class DialogUserInfoComponent {

    constructor(
        public dialogRef: MdDialogRef<DialogUserInfoComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
