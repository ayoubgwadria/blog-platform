import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { CreateArticleComponent } from './article/components/create-article/create-article.component';
import { UpdateArticleComponent } from './article/components/update-article/update-article.component';
import { ArticleListComponent } from './article/components/article-list/article-list.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create', component: CreateArticleComponent },
  { path: 'update/:id', component: UpdateArticleComponent },
  { path: 'articlelist', component: ArticleListComponent },
  { path: 'article', loadChildren: () => import('./article/article.module').then(m => m.ArticleModule) }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
