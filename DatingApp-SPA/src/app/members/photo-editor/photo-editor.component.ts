import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;

  @Input() photos: Photo[];
  @Output() mainChanged = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.initUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authService.decodedToken.nameid +
        '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    // To fix 'Access-Control-Allow-Origin' header error when uploading file
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        this.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo) {
    const userId = this.authService.decodedToken.nameid;

    this.userService.setMainPhoto(userId, photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter((p) => p.isMain)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        this.mainChanged.emit(photo.url);
        this.authService.changeMemberPhoto(photo.url);
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem(
          'user',
          JSON.stringify(this.authService.currentUser)
        );
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  deletePhoto(photo: Photo) {
    this.alertify.confirm('Delete this photo?', () => {
      const userId = this.authService.decodedToken.nameid;

      this.userService.deletePhoto(userId, photo.id).subscribe(
        () => {
          this.photos.splice(this.photos.indexOf(photo), 1);
          this.alertify.success('Photo deleted');
        },
        (error) => {
          this.alertify.error(error);
        }
      );
    });
  }
}
