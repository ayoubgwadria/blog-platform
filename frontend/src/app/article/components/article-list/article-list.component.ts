import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
  articles: any[] = [];
  currentPage: number = 1;
  limit: number = 10;
  isCreateArticleModalOpen: boolean = false;
  isEditArticleModalOpen: boolean = false;
  newArticle = { title: '', content: '' };
  editArticle = { _id: '', title: '', content: '' };
  errorMessage: string | null = null;
  isLoading: boolean = false;
  newComment = { articleId: '', content: '', authorId: '' };
  replyComment = { parentCommentId: '', content: '', authorId: '' };
  articleComments: { [key: string]: string } = {};
  commentReplies: { [key: string]: string } = {};
  isCommentLoading = false;
  isReplyLoading = false;


  constructor(private articleService: ArticleService,private commentService:CommentService, private authService:AuthService) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.isLoading = true;
    this.articleService.getArticles(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.articles = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error loading articles. Please try again.';
        console.error('Error fetching articles', err);
      }
    });
  }

  deleteArticle(id: string): void {
    if (confirm('Are you sure you want to delete this article?')) {
      this.isLoading = true;
      this.articleService.deleteArticle(id).subscribe({
        next: () => {
          this.fetchArticles();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error deleting article. Please try again.';
          console.error('Error deleting article', err);
        }
      });
    }
  }

  openCreateArticleModal(): void {
    this.isCreateArticleModalOpen = true;
  }

  closeCreateArticleModal(): void {
    this.isCreateArticleModalOpen = false;
    this.newArticle = { title: '', content: '' };
  }

  openEditArticleModal(article: any): void {
    this.editArticle = { 
      _id: article._id, 
      title: article.title, 
      content: article.content 
    };
    this.isEditArticleModalOpen = true;
  }

  closeEditArticleModal(): void {
    this.isEditArticleModalOpen = false;
    this.editArticle = { _id: '', title: '', content: '' };
  }

  submitCreateArticle(): void {
    if (this.newArticle.title && this.newArticle.content) {
      this.isLoading = true;
      this.articleService.createArticle(this.newArticle).subscribe({
        next: (article) => {
          this.articles.unshift(article);
          this.closeCreateArticleModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error creating article. Please try again.';
          console.error('Error creating article', err);
        }
      });
    }
  }

  submitEditArticle(): void {
    if (this.editArticle.title && this.editArticle.content) {
      this.isLoading = true;
      this.articleService.updateArticle(this.editArticle._id, this.editArticle).subscribe({
        next: (updatedArticle) => {
          const index = this.articles.findIndex(a => a._id === updatedArticle._id);
          if (index !== -1) this.articles[index] = updatedArticle;
          this.closeEditArticleModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error updating article. Please try again.';
          console.error('Error updating article', err);
        }
      });
    }
  }

  changePage(direction: 'previous' | 'next'): void {
    direction === 'previous' ? this.currentPage-- : this.currentPage++;
    this.fetchArticles();
  }

  addComment(articleId: string): void {
    const content = this.articleComments[articleId]?.trim();
    if (!content) return;

    this.authService.getCurrentUser().subscribe(user => {
      if (!user) {
        alert('Please login to comment');
        return;
      }
      const authorId = user._id;
      this.isCommentLoading = true;
      this.commentService.addComment({
        articleId,
        content,
        authorId
      }).subscribe({
        next: () => {
          this.fetchArticles();
          this.articleComments[articleId] = '';
        },
        error: (err) => {
          console.error('Error adding comment:', err);
        },
        complete: () => {
          this.isCommentLoading = false;
        }
      });
    });
  }

  addReply(commentId: string, articleId: string): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found');
      return;
    }

   
    this.authService.getCurrentUser().subscribe(user => {
      if (!user) {
        alert('Please login to reply');
        return;
      }
      const authorId = user._id;
      const content = this.commentReplies[commentId]?.trim();
      if (!content) return;

      this.isReplyLoading = true;
      this.commentService.replyToComment({
        parentCommentId: commentId,
        content,
        authorId
      }).subscribe({
        next: () => {
          this.fetchArticles();
          this.commentReplies[commentId] = '';
        },
        error: (err) => {
          console.error('Error adding reply:', err);
        },
        complete: () => {
          this.isReplyLoading = false;
        }
      });
    });
  }


}