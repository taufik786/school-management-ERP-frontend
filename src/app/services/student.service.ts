import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
const apiUrl = "http://127.0.0.1:5000/api/v1";

@Injectable()

export class StudentServices {
    constructor(private http: HttpClient) { }

    allSchoolLists() {
        return this.http.get(apiUrl+ '/students');
    }

    addStudent(studentData: any) {
        return this.http.post(apiUrl+'/register-student', studentData);
    }

    editStudent(studentData: any) {
        return this.http.put(apiUrl+'/register-student', studentData);
    }

    deleteSchool(id: any) {
        let url = apiUrl + `/${id}`;
        return this.http.delete(url);
    }
}