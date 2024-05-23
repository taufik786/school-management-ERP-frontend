import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
const apiUrl = "http://127.0.0.1:5000/api/v1/school";

@Injectable()

export class SchoolServices {
    constructor(private http: HttpClient) { }

    allSchoolLists() {
        return this.http.get(apiUrl);
    }

    addSchool(schoolData: any) {
        return this.http.post(apiUrl, schoolData);
    }

    deleteSchool(id: any) {
        let url = apiUrl + `/${id}`;
        return this.http.delete(url);
    }
}