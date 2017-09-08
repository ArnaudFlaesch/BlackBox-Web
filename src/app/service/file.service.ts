import { Injectable } from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";

import "rxjs/add/operator/toPromise";
import {Observable} from "rxjs/Observable";


@Injectable()
export class FileService {

    private headers = new Headers();
    private tokenKey = "USER_ID";
    private SERVICES_URL = "http://localhost:3000/file";

    public constructor(private http: Http) {
        this.headers.append("Content-Type", "multipart/form-data");
        this.headers.append("Accept", "application/json");
    }

    public uploadFiles(files: File[]) {
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let formData: FormData = new FormData();
                formData.append("uploadFile", file, file.name);
                let headers = new Headers();
                let options = new RequestOptions({headers: headers});
                this.http.post(this.SERVICES_URL, formData, options)
                    .toPromise()
                    .then(res => res.json())
                    .catch(error => Observable.throw(error));
            }
        }
    }
}
