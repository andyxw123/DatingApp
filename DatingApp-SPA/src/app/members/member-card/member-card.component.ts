import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserUtilityService } from 'src/app/_services/user.utility.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(private userUtility: UserUtilityService ) {}

  ngOnInit() {}

  sendLike() {
    this.userUtility.sendLike(this.user);
  }
}
