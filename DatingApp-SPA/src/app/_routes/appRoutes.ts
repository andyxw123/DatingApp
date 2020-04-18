import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MemberListComponent } from '../members/member-list/member-list.component';
import { MessagesComponent } from '../messages/messages.component';
import { ListsComponent } from '../lists/lists.component';
import { AuthGuard } from '../_guards/auth.guard';
import { MemberDetailComponent } from '../members/member-detail/member-detail.component';
import { MemberDetailResolver } from '../_resolvers/member-detail.resolver';
import { MemberListResolver } from '../_resolvers/member-list.resolver';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { MemberEditResolver } from '../_resolvers/member-edit.resolver';
import { MemberEditUnsavedChangesGuard } from '../_guards/member-edit-unsaved-changes.guard';
import { ListsResolver } from '../_resolvers/lists.resolver';
import { MessagesResolver } from '../_resolvers/messages.resolver';

// appRoutes is imported by app.module.ts and passed to the RouterModule

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'members',
        component: MemberListComponent,
        resolve: { data: MemberListResolver },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: 'members/:id',
        component: MemberDetailComponent,
        resolve: { data: MemberDetailResolver },
      },
      {
        path: 'member/edit',
        component: MemberEditComponent,
        resolve: { data: MemberEditResolver },
        canDeactivate: [MemberEditUnsavedChangesGuard],
      },
      {
        path: 'lists',
        component: ListsComponent,
        resolve: { data: ListsResolver },
      },
      { 
        path: 'messages',
        component: MessagesComponent,
        resolve: { data: MessagesResolver },
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
