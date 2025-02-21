import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000/comments', {
      auth: { token: localStorage.getItem('accessToken') },
    });
  }

  sendComment(commentData: any): void {
    this.socket.emit('comment:create', commentData);
  }

  sendReply(replyData: any): void {
    this.socket.emit('comment:nested', replyData);
  }

  onNewComment(articleId: string, callback: (comment: any) => void): void {
    this.socket.on(`article:${articleId}:comment`, callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}