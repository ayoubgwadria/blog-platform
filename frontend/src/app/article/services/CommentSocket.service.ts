import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000/comments'); 
  }

  sendComment(articleId: string, content: string, authorId: string) {
    this.socket.emit('comment:create', { articleId, content, authorId });
  }

  onCommentReceived(callback: (comment: any) => void) {
    this.socket.on('comment:created', callback);
  }
}
