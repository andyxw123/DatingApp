/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserUtilityService } from './user.utility.service';

describe('Service: User.utility', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserUtilityService]
    });
  });

  it('should ...', inject([UserUtilityService], (service: UserUtilityService) => {
    expect(service).toBeTruthy();
  }));
});
