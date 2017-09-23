import { Injectable } from "@angular/core";
import {Headers, Http, ResponseContentType} from "@angular/http";
import "rxjs/Rx";

@Injectable()
export class FileService {

    private headers = new Headers();
    private SERVICES_URL = "http://localhost:3000/element";

    public constructor(private http: Http) {
        this.headers.append("Accept", "*");
        this.headers.append("Access-Control-Allow-Origin" , "*");
    }

    public getContentFromFolder(userId: Number, elementName: string, path: string): Promise<string[]> {
        return this.http
            .get(this.SERVICES_URL + "/directory", {headers: this.headers, params: {userId : userId, elementName : elementName, path: path}})
            .toPromise()
            .then(res => res.json() as string[])
            .catch(this.handleError);
    }

    public getSharedFolders(userId: Number) {
        return this.http
            .get(this.SERVICES_URL + "/sharedFolders", {headers: this.headers, params: {userId : userId }})
            .toPromise()
            .then(folderList => folderList.json())
            .catch(this.handleError);
    }

    public uploadFiles(files: File[], path, userId: Number) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData: FormData = new FormData();
                formData.append("documents", file);
                this.http.post(this.SERVICES_URL + "/upload", formData, {headers: this.headers, params: {path: path, userId: userId}})
                    .toPromise()
                    .then(res => res.json())
                    .catch(this.handleError);
            }
        }
    }

    public downloadFile(userId: Number, fileName: string, currentPath: string) {
        return this.http.get(this.SERVICES_URL + "/download", {headers: this.headers, params: {userId : userId, elementName : fileName, path: currentPath}, responseType: ResponseContentType.Blob})
            .toPromise()
            .then(response => response.blob())
            .catch(this.handleError);
    }

    public createNewFile(userId: Number, fileName: string, folderTo: string, currentPath: string) {
        return this.http.post(this.SERVICES_URL + "/newFile", {userId : userId, elementName : fileName, folderTo: folderTo, path: currentPath}, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public createNewFolder(userId: Number, folderName: string, folderTo: string, currentPath: string) {
        return this.http.post(this.SERVICES_URL + "/newFolder",  {userId : userId, elementName : folderName, folderTo: folderTo, path: currentPath}, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
        console.error("An error occurred", error);
        return Promise.reject(error.message || error);
    }
}
