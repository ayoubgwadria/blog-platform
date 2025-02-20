import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { UpdateArticleComponent } from './components/update-article/update-article.component';
import { FormsModule } from '@angular/forms';
import { ArticleListComponent } from './components/article-list/article-list.component';


@NgModule({
  declarations: [
    ArticleComponent,
    ArticleListComponent,
    CreateArticleComponent,
    UpdateArticleComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    FormsModule
  ]
})
export class ArticleModule { }
