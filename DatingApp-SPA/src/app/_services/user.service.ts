import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/paginatedresult';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) {}

  getUsers(
    page?,
    itemsPerPage?,
    userParams?
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams) {
      Object.keys(userParams).forEach((key) => {
        params = params.append(key, userParams[key]);
      });
    }

    return this.http
      .get<User[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;

          const paginationHeader = response.headers.get('Pagination');
          if (paginationHeader) {
            paginatedResult.pagination = JSON.parse(paginationHeader);
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + id, user);
  }

  setMainPhoto(userId: number, photoId: number) {
    return this.http.post(
      this.baseUrl + userId + '/photos/' + photoId + '/setMain',
      {}
    );
  }

  deletePhoto(userId: number, photoId: number) {
    return this.http.delete(this.baseUrl + userId + '/photos/' + photoId, {});
  }

  sendLike(userId: number, recipientId: number) {
    return this.http.post(this.baseUrl + userId + '/like/' + recipientId, {});
  }

  getMessages(
    userId: number,
    page?,
    itemsPerPage?,
    messageContainer?
  ) {
    const paginatedResult = new PaginatedResult<Message[]>();
    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (messageContainer) {
      params = params.append('messageContainer', messageContainer);
    }

    return this.http
      .get<Message[]>(this.baseUrl + userId + '/messages', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;

          const paginationHeader = response.headers.get('Pagination');
          if (paginationHeader) {
            paginatedResult.pagination = JSON.parse(paginationHeader);
          }
          return paginatedResult;
        })
      );
  }

  getMessageThread(userId: number, recipientId: number)
  {
    return this.http.get<Message[]>(this.baseUrl + userId + '/messages/thread/' + recipientId);
  }

  sendMessage(userId: number, message: Message) {
    return this.http.post<Message>(this.baseUrl + userId + '/messages', message);
  }

  deleteMessage(userId: number, id: number) {
    return this.http.post(this.baseUrl + userId + '/messages/' + id, {});
  }

  markMessageAsRead(userId: number, id: number) {
    return this.http.post(this.baseUrl + userId + '/messages/' + id + '/read', {}).subscribe();
  }
}
