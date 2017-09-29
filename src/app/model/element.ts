export class Element {

    private _name: string;
    private _path: string;
    private _title: string;
    private _isFolder: Boolean;

    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get path(): string {
        return this._path;
    }

    set path(value: string) {
        this._path = value;
    }

    get isFolder(): Boolean {
        return this._isFolder;
    }

    set isFolder(value: Boolean) {
        this._isFolder = value;
    }
}
