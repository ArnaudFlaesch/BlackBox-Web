import {Element} from "../model/element";
import {FileService} from "../services/file.service";
import {UserService} from "../services/user.service";

export class FileUtils {

    private _isSharedFolderPage: Boolean;
    private _search = "";
    private _currentFolderOnly: Boolean = true;
    private _lastModificationDateStart: Date = new Date();
    private _lastModificationDateEnd: Date = new Date();
    private _elementList: Element[] = [];
    private _searchList: Element[] = [];

    public constructor(private fileService: FileService, private userService: UserService) {}

    public createNavigationTab(currentPath: string, currentFolder: string): Element[] {
        const navigationBar = [];
        if (currentPath !== "") {
            const folders = (currentPath + "/" + currentFolder).split("/").filter(Boolean);
            for (let ind = 0; ind < folders.length; ind++) {
                navigationBar.push(new Element(folders[ind]));
            }
            navigationBar[0].title = "Mon dossier";
            navigationBar[0].path = "";
            for (let ind = 1; ind < folders.length; ind++) {
                if (navigationBar[ind - 1].path !== "") {
                    navigationBar[ind].path = "/" + navigationBar[ind - 1].path +  "/" + folders[ind];
                } else {
                    navigationBar[ind].path =  "/" + folders[ind - 1];
                }
                navigationBar[ind].title = navigationBar[ind].name;
            }
        } else {
            navigationBar.push(new Element(""));
            navigationBar[0].title = "Mon dossier";
            navigationBar[0].path = "";
        }
        return (navigationBar);
    }

    public createSharedNavigationTab(currentPath: string, currentFolder: string): Element[] {
        const navigationBar = [];
        const folders = (currentPath + "/" + currentFolder).split("/").filter(Boolean);
        navigationBar.push(new Element(""));
        navigationBar[0].title = "Dossiers partagés";
        navigationBar[0].name = "";
        navigationBar[0].path = "";
        for (let ind = 0; ind < folders.length; ind++) {
            navigationBar.push(new Element(folders[ind]));
        }
        let folderIndex = 1;
        for (let ind = 0; ind < folders.length; ind++) {
            if (navigationBar[folderIndex - 1].path !== "") {
                navigationBar[folderIndex].path = navigationBar[folderIndex - 1].path;
            } else {
                navigationBar[folderIndex].path = "";
            }
            navigationBar[folderIndex].title = navigationBar[folderIndex].name;
            folderIndex++;
        }
        return (navigationBar);
    }

    public filterList() {
        let elementsToFilter;
        const path = (this.isSharedFolderPage) ? "" : "/" + this.userService.getUserDataFromSession()._id.toString();
        if (this.currentFolderOnly) {
            elementsToFilter = this.elementList;
            this.filterOptions(elementsToFilter);
        } else {
            this.fileService.searchElements(this.userService.getUserDataFromSession()._id, this._search, path)
                .then(res => {
                    this.filterOptions(res);
                })
                .catch(error => console.log(error));
        }
    }

    public filterOptions(elementsToFilter: Element[]) {
        this.searchList = elementsToFilter
            .filter(element => element.name.indexOf(this._search) !== -1);
    }

    public getBreadCrumbClasses(currentIndex: number, length: number) {
        if (currentIndex === length - 1) {
            return("breadcrumb-item active success");
        } else {
            return("breadcrumb-item");
        }
    }

    public getIcon(elementName: string, isFolder: Boolean): string {
        if (!isFolder) {
            const index = (elementName[elementName.length - 4] === ".") ? 3 : 4;
            switch (elementName.substring(elementName.length, elementName.length - index)) {
                case ("png"):
                case ("jpg"):
                    return ("img");
                case ("txt"):
                case ("doc"):
                case ("docx"):
                    return ("file");
                case ("mp4"):
                case ("avi"):
                case ("mkv"):
                case ("mov"):
                    return ("video");
                case ("pdf"):
                    return ("pdf");
                default :
                    return ("file");
            }
        } else {
            return ("folder");
        }
    }

    get currentFolderOnly(): Boolean {
        return this._currentFolderOnly;
    }

    set currentFolderOnly(value: Boolean) {
        this._currentFolderOnly = value;
    }

    get lastModificationDateStart(): Date {
        return this._lastModificationDateStart;
    }

    set lastModificationDateStart(value: Date) {
        this._lastModificationDateStart = value;
    }

    get lastModificationDateEnd(): Date {
        return this._lastModificationDateEnd;
    }

    set lastModificationDateEnd(value: Date) {
        this._lastModificationDateEnd = value;
    }

    get search(): string {
        return this._search;
    }

    set search(value: string) {
        this._search = value;
    }

    get elementList(): Element[] {
        return this._elementList;
    }

    set elementList(value: Element[]) {
        this._elementList = value;
    }

    get searchList(): Element[] {
        return this._searchList;
    }

    set searchList(value: Element[]) {
        this._searchList = value;
    }

    get isSharedFolderPage(): Boolean {
        return this._isSharedFolderPage;
    }

    set isSharedFolderPage(value: Boolean) {
        this._isSharedFolderPage = value;
    }
}
