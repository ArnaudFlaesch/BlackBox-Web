import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {FileService} from "../../services/file.service";
import {UserService} from "../../services/user.service";
import {FileUtils} from "../../utils/FileUtils";
import {Element} from "../../model/element";

@Component({
    selector: "move",
    templateUrl: "move.html",
})
export class DialogMoveComponent  implements AfterViewChecked, OnInit {

    private _elementToMove: string;
    private _originFolder: string;
    private _originPath: string;
    private _destinationPath: string;
    private _destinationFolder: string;
    private _navigationBar: Element[] = [];
    private _isSharedFolderPage: Boolean;
    private _error: Error;
    private _fileUtils: FileUtils = new FileUtils();

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

    ngOnInit(): void {
        this.displayFolderContents(this._originFolder, this.originPath);
    }

    public moveElement(moveOrCopy: Boolean) {
        this.fileService.moveElement(this.userService.getUserDataFromSession()._id, moveOrCopy, this.elementToMove,
                                    this.originFolder, this.originPath, this.destinationFolder, this.destinationPath)
            .catch(error => this._error = JSON.parse(error._body).error);
        this.dialogRef.close();
    }

    public displayFolderContents(elementName: string, path: string) {
        this.fileService.getContentFromFolder(this.userService.getUserDataFromSession()._id, elementName, path)
            .then(elementList => {
                this.destinationFolder = elementName;
                this.destinationPath = path;
                this.fileUtils.elementList = elementList;
                this.fileUtils.filterList();
                this.navigationBar = (this.isSharedFolderPage)
                    ? this.fileUtils.createSharedNavigationTab(this.destinationPath, this.destinationFolder)
                    : this.fileUtils.createNavigationTab(this.destinationPath, this.destinationFolder);
            })
            .catch(error => this._error = error);
    }

    public getElement(elementName: string, isFolder: Boolean) {
        if (!isFolder) {
            this.navigateToFolder(elementName);
        }
    }

    public navigateToFolder(elementName: string) {
        const path = (this.destinationPath === "" && this._destinationFolder === "") ? "" : this.destinationPath += "/" + this.destinationFolder;
        this.displayFolderContents(elementName, path);
    }

    get originFolder(): string {
        return this._originFolder;
    }

    set originFolder(value: string) {
        this._originFolder = value;
    }

    get elementToMove(): string {
        return this._elementToMove;
    }

    set elementToMove(value: string) {
        this._elementToMove = value;
    }

    get originPath(): string {
        return this._originPath;
    }

    set originPath(value: string) {
        this._originPath = value;
    }

    get destinationPath(): string {
        return this._destinationPath;
    }

    set destinationPath(value: string) {
        this._destinationPath = value;
    }

    get navigationBar(): Element[] {
        return this._navigationBar;
    }

    set navigationBar(value: Element[]) {
        this._navigationBar = value;
    }

    get isSharedFolderPage(): Boolean {
        return this._isSharedFolderPage;
    }

    set isSharedFolderPage(value: Boolean) {
        this._isSharedFolderPage = value;
    }

    get destinationFolder(): string {
        return this._destinationFolder;
    }

    set destinationFolder(value: string) {
        this._destinationFolder = value;
    }

    get error(): Error {
        return this._error;
    }

    set error(value: Error) {
        this._error = value;
    }

    get fileUtils(): FileUtils {
        return this._fileUtils;
    }

    set fileUtils(value: FileUtils) {
        this._fileUtils = value;
    }
}
