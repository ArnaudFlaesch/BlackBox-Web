import { Injectable } from "@angular/core";
import {Headers, Http, ResponseContentType} from "@angular/http";
import "rxjs/Rx";
import {environment} from "../../environments/environment";

@Injectable()
export class FileService {

    private headers = new Headers();
    private SERVICE_ENDPOINT = environment.SERVICES_URL + "/element";

    public constructor(private http: Http) {
        this.headers.append("Accept", "*");
    }

    public getContentFromFolder(userId: Number, elementName: string, path: string): Promise<string[]> {
        return this.http
            .get(this.SERVICE_ENDPOINT + "/directory",
                {headers: this.headers, params: {userId : userId, elementName : elementName, path: path}})
            .toPromise()
            .then(res => res.json() as string[])
            .catch(this.handleError);
    }

    public getSharedFolders(userId: Number): Promise<any> {
        return this.http
            .get(this.SERVICE_ENDPOINT + "/sharedFolders", {headers: this.headers, params: {userId : userId }})
            .toPromise()
            .then(folderList => folderList.json())
            .catch(this.handleError);
    }

    public uploadFiles(files: File[], path, userId: Number): Promise<any> {
            const formData: FormData = new FormData();
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                formData.append("documents", file);
            }
            return this.http.post(this.SERVICE_ENDPOINT + "/upload", formData,
                {headers: this.headers, params: {path: path, userId: userId}})
                .toPromise()
                .then(res => res.json())
                .catch(this.handleError);
    }

    public downloadFile(userId: Number, fileName: string, currentPath: string): Promise<any> {
        return this.http.get(this.SERVICE_ENDPOINT + "/download",
            {headers: this.headers,
                params: {userId : userId, elementName : fileName, path: currentPath}, responseType: ResponseContentType.Blob})
            .toPromise()
            .then(response => response.blob())
            .catch(this.handleError);
    }

    public createNewFile(userId: Number, fileName: string, folderTo: string, currentPath: string): Promise<any> {
        return this.http.post(this.SERVICE_ENDPOINT + "/newFile",
            {userId : userId, elementName : fileName, folderTo: folderTo, path: currentPath},
            {headers: this.headers})
            .toPromise()
            .then(() => Promise.resolve())
            .catch(this.handleError);
    }

    public createNewFolder(userId: Number, folderName: string, folderTo: string, currentPath: string): Promise<any> {
        return this.http.post(this.SERVICE_ENDPOINT + "/newFolder",
            {userId : userId, elementName : folderName, folderTo: folderTo, path: currentPath},
            {headers: this.headers})
            .toPromise()
            .then(() => Promise.resolve())
            .catch(this.handleError);
    }

    public renameElement(userId: Number, elementName: string, newElementName: string, currentPath: string): Promise<any> {
        return this.http.post(this.SERVICE_ENDPOINT + "/renameElement",
            {userId : userId, elementName: elementName, newElementName: newElementName, path: currentPath},
            {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public deleteElement(userId: Number, elementName: string, currentPath: string): Promise<any> {
        return this.http.delete(this.SERVICE_ENDPOINT + "/deleteElement",
            {headers: this.headers, params: {userId : userId, elementName : elementName, path: currentPath}})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
