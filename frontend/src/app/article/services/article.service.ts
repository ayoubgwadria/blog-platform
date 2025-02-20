import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:5000/api/article';

  constructor(private http: HttpClient) {}

  getArticles(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  createArticle(article: any): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/create`, article, { headers });
  }

  updateArticle(id: string, article: any): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/update/${id}`, article, { headers });
  }

  deleteArticle(id: string): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers });
  }
}