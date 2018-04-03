import { TestBed, async, inject } from '@angular/core/testing';

import { AuthUserGuard, AuthGmGuard } from './auth.guard';

describe('AuthUserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthUserGuard]
    });
  });

  it('should ...', inject([AuthUserGuard], (guard: AuthUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
