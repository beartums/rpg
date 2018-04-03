import { TestBed, inject } from '@angular/core/testing';

import { GmDataService } from './gm-data.service';

describe('GmDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GmDataService]
    });
  });

  it('should be created', inject([GmDataService], (service: GmDataService) => {
    expect(service).toBeTruthy();
  }));
});
