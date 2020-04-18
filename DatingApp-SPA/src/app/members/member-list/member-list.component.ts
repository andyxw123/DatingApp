import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_models/pagination';
import { PaginatedResult } from 'src/app/_models/paginatedresult';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' }
  ];
  userParams: any = {};
  pagination: Pagination;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((r) => {
      this.users = r.data.result; // Must match the resolver field name in routes.ts
      this.pagination = r.data.pagination;
    });

    this.resetFilters();
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }

  pageChanged(e: any) {
    // if (this.pagination.currentPage !== e.page) {
    //   this.router.navigate(['/members'], {
    //     queryParams: { page: e.page },
    //     replaceUrl: true,
    //   });
    // }
    this.pagination.currentPage = e.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((r: PaginatedResult<User[]>) => {
        this.users = r.result;
        this.pagination = r.pagination;
      });
  }
}
