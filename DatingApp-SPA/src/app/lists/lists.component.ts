import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((r) => {
      this.users = r.data.result;
      this.pagination = r.data.pagination;
    });
    this.likesParam = 'Likers';
  }

  pageChanged(e: any) {
    this.pagination.currentPage = e.page;
    this.loadUsers();
  }

  loadUsers() {
    const userParams = {
      likers: this.likesParam === 'Likers' ? true : false,
      likees: this.likesParam === 'Likees' ? true : false,
    };

    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, userParams)
      .subscribe((r: PaginatedResult<User[]>) => {
        this.users = r.result;
        this.pagination = r.pagination;
      });
  }
}
