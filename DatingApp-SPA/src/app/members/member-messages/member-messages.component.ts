import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any;

  constructor(private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessageThread();
    this.setNewMessage();
  }

  setNewMessage() {
    this.newMessage = {
      recipientId: this.recipientId,
      content: ''
    };
  }

  loadMessageThread() {
    const userId = +this.authService.decodedToken.nameid;  /// Preceding + forces nameid to be a number (rather than a string)
    this.userService.getMessageThread(userId, this.recipientId)
    .pipe(
      tap(messages => {
        messages.forEach(m => {
          if (m.recipientId === userId && !m.dateRead) {
             this.userService.markMessageAsRead(userId, m.id);
          }
        });
      })
    )
    .subscribe(data => {
      this.messages = data;
    }, error => {
      this.alertify.error(error);
    });
  }

  sendMessage() {
    this.userService.sendMessage(this.authService.currentUser.id, this.newMessage).subscribe(message => {
      this.messages.unshift(message);
      this.alertify.success('Message sent to ' + message.recipientKnownAs);
      this.setNewMessage();
    }, error => {
      this.alertify.error(error);
    });
  }
}
