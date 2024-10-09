import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Grade} from './grade.model';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private apiUrl = 'http://localhost:8000/api/grade';

  constructor(private http: HttpClient) {
  }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl);
  }

  addGrade(grade: Partial<Grade>): Observable<Grade> {
    return this.http.post<Grade>(this.apiUrl, grade);
  }

  updateGrade(id: number, grade: Partial<Grade>): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/${id}`, grade);
  }

  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
