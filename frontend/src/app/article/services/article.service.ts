import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000/articles', {
      auth: { token: localStorage.getItem('accessToken') },
    });
  }

  fetchArticlesRealTime(page: number = 1, limit: number = 10): void {
    this.socket.emit('article:get', { page, limit });
  }

  onArticlesReceived(callback: (response: any) => void): void {
    this.socket.on('article:get', callback);
  }

  onError(callback: (error: any) => void): void {
    this.socket.on('article:error', callback);
  }

  createArticle(article: any): void {
    this.socket.emit('article:create', article);
  }

  onArticleCreated(callback: (article: any) => void): void {
    this.socket.on('article:create', callback);
  }

  updateArticle(id: string, article: any): void {
    this.socket.emit('article:update', { id, article });
  }

  onArticleUpdated(callback: (article: any) => void): void {
    this.socket.on('article:update', callback);
  }

  deleteArticle(id: string): void {
    this.socket.emit('article:delete', id);
  }

  onArticleDeleted(callback: (id: string) => void): void {
    this.socket.on('article:delete', callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}