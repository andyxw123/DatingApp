import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AlertifyService } from './alertify.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserUtilityService {

  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService) {}

  sendLike(recipientUser: User) {
    const userId = this.authService.decodedToken.nameid;

    this.userService.sendLike(userId, recipientUser.id).subscribe(() => {
      this.alertify.success('You liked ' + recipientUser.knownAs);
    }, error => {
      this.alertify.error(error);
    });
  }

}
