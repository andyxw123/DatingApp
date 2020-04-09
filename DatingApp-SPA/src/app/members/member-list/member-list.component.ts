import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      this.users = data['users'];  // Must match the resolver field name in routes.ts
    });
  }

  ngOnInit() {

  }
}
