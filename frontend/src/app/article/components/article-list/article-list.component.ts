import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent implements OnInit, OnDestroy {
  articles: any[] = [];
  currentPage: number = 1;
  limit: number = 10;
  isCreateArticleModalOpen: boolean = false;
  isEditArticleModalOpen: boolean = false;
  newArticle = { title: '', content: '' };
  editArticle = { _id: '', title: '', content: '' };
  errorMessage: string | null = null;
  isLoading: boolean = false;
  articleComments: { [key: string]: string } = {};
  commentReplies: { [key: string]: string } = {};
  isCommentLoading = false;
  isReplyLoading = false;

  constructor(
    private articleService: ArticleService,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.isLoading = true;
    this.articleService.fetchArticlesRealTime(this.currentPage, this.limit);
  
    this.articleService.onArticlesReceived((response) => {
      this.articles = response.data;
      this.setupCommentListeners();
      this.isLoading = false;
    });
  
    this.articleService.onArticleCreated((newArticle) => {
      this.articles.unshift(newArticle);
    });
  
    this.articleService.onError((err) => {
      this.isLoading = false;
      this.errorMessage = 'Error loading articles. Please try again.';
      console.error('Error fetching articles', err);
    });
  }

  setupCommentListeners(): void {
    this.articles.forEach((article) => {
      this.commentService.onNewComment(article._id, (comment) => {
        const articleIndex = this.articles.findIndex((a) => a._id === article._id);
        if (articleIndex === -1) return;

        if (comment.parentCommentId) {
          const parentComment = this.articles[articleIndex].comments.find(
            (c: { _id: any; }) => c._id === comment.parentCommentId
          );

          if (parentComment) {
            this.articles[articleIndex].comments = this.articles[articleIndex].comments.map((c: { _id: any; replies: any; }) => {
              if (c._id === parentComment._id) {
                return { ...c, replies: [...(c.replies || []), comment] };
              }
              return c;
            });
          }
        } else {
          this.articles[articleIndex].comments = [...(this.articles[articleIndex].comments || []), comment];
        }

        this.articles = [...this.articles];
      });
    });
  }

  deleteArticle(id: string): void {
    if (confirm('Are you sure you want to delete this article?')) {
      this.isLoading = true;
      this.articleService.deleteArticle(id);

      this.articleService.onArticleDeleted((deletedId) => {
        this.articles = this.articles.filter((article) => article._id !== deletedId);
        this.isLoading = false;
      });

      this.articleService.onError((err) => {
        this.isLoading = false;
        this.errorMessage = 'Error deleting article. Please try again.';
        console.error('Error deleting article', err);
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
    this.editArticle = { _id: article._id, title: article.title, content: article.content };
    this.isEditArticleModalOpen = true;
  }

  closeEditArticleModal(): void {
    this.isEditArticleModalOpen = false;
    this.editArticle = { _id: '', title: '', content: '' };
  }

  submitCreateArticle(): void {
    if (this.newArticle.title && this.newArticle.content) {
      this.isLoading = true;
      this.articleService.createArticle(this.newArticle);

      this.articleService.onArticleCreated((article) => {
        this.articles.unshift(article);
        this.closeCreateArticleModal();
        this.isLoading = false;
      });

      this.articleService.onError((err) => {
        this.isLoading = false;
        this.errorMessage = 'Error creating article. Please try again.';
        console.error('Error creating article', err);
      });
    }
  }

  submitEditArticle(): void {
    if (this.editArticle.title && this.editArticle.content) {
      this.isLoading = true;
      this.articleService.updateArticle(this.editArticle._id, this.editArticle);

      this.articleService.onArticleUpdated((updatedArticle) => {
        const index = this.articles.findIndex((a) => a._id === updatedArticle._id);
        if (index !== -1) {
          this.articles[index] = updatedArticle;
        }
        this.closeEditArticleModal();
        this.isLoading = false;
      });

      this.articleService.onError((err) => {
        this.isLoading = false;
        this.errorMessage = 'Error updating article. Please try again.';
        console.error('Error updating article', err);
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

    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        alert('Please login to comment');
        return;
      }
      const authorId = user._id;
      this.isCommentLoading = true;

      this.commentService.sendComment({
        articleId,
        content,
        authorId,
      });

      this.articleComments[articleId] = '';
      this.isCommentLoading = false;
    });
  }

  addReply(commentId: string, articleId: string): void {
    const content = this.commentReplies[commentId]?.trim();
    if (!content) return;

    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        alert('Please login to reply');
        return;
      }
      const authorId = user._id;
      this.isReplyLoading = true;

      this.commentService.sendReply({
        parentCommentId: commentId,
        content,
        authorId,
      });

      this.commentReplies[commentId] = '';
      this.isReplyLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.commentService.disconnect();
  }
}