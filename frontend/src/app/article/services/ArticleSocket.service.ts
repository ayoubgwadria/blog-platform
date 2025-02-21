import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';

interface ArticleData {
  title: string;
  content: string;
  authorId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:5000/articles');
  }

  fetchArticles(page: number, limit: number): void {
    this.socket.emit('article:get', { page, limit });
  }

  onArticlesReceived(callback: (response: any) => void): void {
    this.socket.on('article:get', callback);
  }

  onError(callback: (error: any) => void): void {
    this.socket.on('article:error', callback);
  }

  createArticle(articleData: ArticleData): void {
    this.socket.emit('article:create', articleData);
  }

  onArticleCreated(callback: (article: any) => void): void {
    this.socket.on('article:create', callback);
  }

  updateArticle(articleId: string, articleData: Partial<ArticleData>): void {
    const data = { id: articleId, article: articleData };
    this.socket.emit('article:update', data);
  }

  onArticleUpdated(callback: (article: any) => void): void {
    this.socket.on('article:update', callback);
  }

  deleteArticle(articleId: string): void {
    this.socket.emit('article:delete', articleId);
  }

  onArticleDeleted(callback: (message: string) => void): void {
    this.socket.on('article:delete', callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
