import {AfterViewChecked, ChangeDetectorRef, Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {FileService} from "../../services/file.service";
import {UserService} from "../../services/user.service";

@Component({
    selector: "newFolder",
    templateUrl: "newFolder.html",
})
export class DialogNewFolderComponent implements AfterViewChecked {

    private _folderName = "";
    private _currentPath = "";
    private _currentFolder = "";

    constructor(private cdRef: ChangeDetectorRef, public dialogRef: MdDialogRef<DialogNewFolderComponent>,
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
