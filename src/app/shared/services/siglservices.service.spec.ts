import { TestBed, inject } from '@angular/core/testing';

import { SiglService } from './siglservices.service';

describe('SiglservicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SiglService]
    });
  });

  it('should ...', inject([SiglService], (service: SiglService) => {
    expect(service).toBeTruthy();
  }));
});
