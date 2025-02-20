import { Component } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent {
  title: string = '';
  content: string = '';

  constructor(private articleService: ArticleService, private router: Router) {}

  createArticle() {
    const article = { title: this.title, content: this.content };
    this.articleService.createArticle(article).subscribe({
      next: (response) => {
        console.log('Article created', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error creating article', err);
      }
    });
  }
}
