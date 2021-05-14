import { TestBed } from '@angular/core/testing';

import { GetStuffService } from './get-stuff.service';

describe('GetStuffService', () => {
  let service: GetStuffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetStuffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
