import { Injectable } from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";

import "rxjs/add/operator/toPromise";
import {Observable} from "rxjs/Observable";


@Injectable()
export class FileService {

    private headers = new Headers();
    private SERVICES_URL = "http://localhost:3000/file";

    public constructor(private http: Http) {
        this.headers.append("Accept", "application/json");
    }

    public uploadFiles(files: File[]) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let formData: FormData = new FormData();
                formData.append("documents", file);
                this.http.post(this.SERVICES_URL + "/upload", formData, {headers: this.headers})
                    .toPromise()
                    .then(res => res.json())
                    .catch(this.handleError);
            }
        }
    }

    private handleError(error: any): Promise<any> {
        console.error("An error occurred", error);
        return Promise.reject(error.message || error);
    }
}
