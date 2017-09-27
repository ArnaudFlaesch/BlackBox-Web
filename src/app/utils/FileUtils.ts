import {Element} from "../model/element";

export class FileUtils {

    private _search = "";
    private _elementList: string[] = [];
    private _searchList: Element[] = [];

    public constructor() {}

    public createNavigationTab(currentPath: string, currentFolder: string): Element[] {
        let navigationBar = [];
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
        let navigationBar = [];
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
        this.searchList = this.elementList
            .filter(element => element.indexOf(this._search) !== -1)
            .map(element => new Element(element));
    }

    public isFile(elementName: string) {
        if (elementName[elementName.length - 4] === "." || elementName[elementName.length - 5] === ".") {
            return(true);
        } else {
            return(false);
        }
    }

    public getBreadCrumbClasses(currentIndex: number, length: number) {
        if (currentIndex === length - 1) {
            return("breadcrumb-item active success");
        } else {
            return("breadcrumb-item");
        }
    }

    public getIcon(elementName: string): string {
        if (this.isFile(elementName)) {
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

    get search(): string {
        return this._search;
    }

    set search(value: string) {
        this._search = value;
    }

    get elementList(): string[] {
        return this._elementList;
    }

    set elementList(value: string[]) {
        this._elementList = value;
    }

    get searchList(): Element[] {
        return this._searchList;
    }

    set searchList(value: Element[]) {
        this._searchList = value;
    }
}
