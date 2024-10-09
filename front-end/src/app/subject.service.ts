import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Subject} from './subject.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = 'http://localhost:8000/api/subject';

  constructor(private http: HttpClient) {
  }

  getSubjects(): Observable<Subject[]> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    });

    return this.http.get<Subject[]>(this.apiUrl, {headers});
  }
}
