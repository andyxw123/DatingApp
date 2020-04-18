import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from '@kolkov/ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { UserUtilityService } from 'src/app/_services/user.utility.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  tabIndexes: any = {
    about: 0,
    interests: 1,
    photos: 2,
    messages: 3,
  };

  constructor(private route: ActivatedRoute, private userUtility: UserUtilityService) {}

  ngOnInit() {
    this.route.data.subscribe((r) => {
      this.user = r.data; // Must match the resolver field name in routes.ts
      this.galleryImages = this.getImages();
    });

    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      if (tab) {
        this.selectTab(this.tabIndexes[tab.toLowerCase()]);
      }
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
  }

  getImages() {
    const imageUrls = [];

    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        descriptipn: photo.description,
      });
    }
    return imageUrls;
  }

  selectMessagesTab() {
    this.selectTab(this.tabIndexes.messages);
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  sendLike() {
    this.userUtility.sendLike(this.user);
  }
}
