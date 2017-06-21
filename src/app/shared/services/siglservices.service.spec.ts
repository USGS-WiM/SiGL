import { TestBed, inject } from '@angular/core/testing';

import { SiglservicesService } from './siglservices.service';

describe('SiglservicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SiglservicesService]
    });
  });

  it('should ...', inject([SiglservicesService], (service: SiglservicesService) => {
    expect(service).toBeTruthy();
  }));
});
