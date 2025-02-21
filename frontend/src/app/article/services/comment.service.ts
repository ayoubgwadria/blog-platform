import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CommentData {
  articleId?: string;
  content: string;
  authorId: string;
  parentCommentId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:5000/api/comment';

  constructor(private http: HttpClient) {}

  addComment(commentData: CommentData): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/add`, commentData,{headers});
  }

  replyToComment(replyData: CommentData): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/reply`, replyData,{headers});
  }
}
