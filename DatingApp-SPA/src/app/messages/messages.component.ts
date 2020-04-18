import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { Pagination } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((r) => {
      this.messages = r.data.result;
      this.pagination = r.data.pagination;
    });
  }

  loadMessages() {
    const userId = this.authService.decodedToken.nameid;
    this.userService
      .getMessages(
        userId,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (r) => {
          this.messages = r.result;
          this.pagination = r.pagination;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  pageChanged(e: any) {
    this.pagination.currentPage = e.page;
    this.loadMessages();
  }

  deleteMessage(id: number) {
    this.alertify.confirm(
      'Delete this message?',
      () => {
        this.userService
          .deleteMessage(this.authService.currentUser.id, id)
          .subscribe(
            () => {
              this.messages.splice(this.messages.findIndex(x => x.id === id), 1);
              this.alertify.success('Message deleted');
            },
            (error) => {
              this.alertify.error(error);
            }
          );
      }
    );
  }
}
