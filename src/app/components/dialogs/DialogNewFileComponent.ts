import {AfterViewChecked, ChangeDetectorRef, Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {FileService} from "../../services/file.service";
import {UserService} from "../../services/user.service";

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
