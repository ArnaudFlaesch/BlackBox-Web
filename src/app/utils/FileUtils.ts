export class FileUtils {

    private _search = "";
    private _elementList: string[] = [];
    private _searchList: string[] = [];

    public constructor() {}

    public filterList() {
        this.searchList = this.elementList.filter(element => element.indexOf(this._search) !== -1);
    }

    public isFile(elementName: string) {
        if (elementName[elementName.length - 4] === "." || elementName[elementName.length - 5] === ".") {
            return(true);
        } else {
            return(false);
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

    get searchList(): string[] {
        return this._searchList;
    }

    set searchList(value: string[]) {
        this._searchList = value;
    }
}
