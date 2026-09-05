import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HwService } from './hw.service';
import { Hw } from '../models/hw.model';

describe('HwService', () => {
  let service: HwService;
  let httpMock: HttpTestingController;

  // This block runs before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HwService,
        provideHttpClient(),              // Real HttpClient
        provideHttpClientTesting()        // Mock for HTTP calls
      ]
    });
    
    // Get service and HTTP mock from the TestBed
    service = TestBed.inject(HwService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // This block runs after each test (cleanup)
  afterEach(() => {
    httpMock.verify(); // Checks that no unexpected HTTP calls remain
  });

  // TEST 1: testing getHws()
  it('should fetch all homeworks via GET', () => {
    // Mock data that the server should "return" (matching the Hw interface)
    const mockHws: Hw[] = [
      { _id: '1', date: new Date(), subject: 'Math', task_type: 'Exercise', notes: 'Page 10' },
      { _id: '2', date: new Date(), subject: 'German', task_type: 'Essay', notes: 'None' }
    ];

    // Call service method
    service.getHws().subscribe(hws => {
      expect(hws.length).toBe(2);
      expect(hws[0].subject).toBe('Math');
    });

    // Catch expected HTTP call (using endsWith to avoid private property access)
    const req = httpMock.expectOne(req => req.url.endsWith('/hws'));
    expect(req.request.method).toBe('GET');

    // Send mock response
    req.flush(mockHws);
  });

  // TEST 2: testing getHwById()
  it('should fetch a single homework by ID', () => {
    // Mock data for a single homework
    const mockHw: Hw = { _id: '1', date: new Date(), subject: 'Math', task_type: 'Exercise', notes: 'Page 10' };

    // Call service method with ID '1'
    service.getHwById('1').subscribe(hw => {
      expect(hw._id).toBe('1');
      expect(hw.subject).toBe('Math');
    });

    // Catch expected HTTP call for specific ID
    const req = httpMock.expectOne(req => req.url.endsWith('/hws/1'));
    expect(req.request.method).toBe('GET');

    // Send mock response
    req.flush(mockHw);
  });

  // TEST 3: testing deleteHw()
  it('should delete a homework', () => {
    // Call service method to delete ID '1'
    service.deleteHw('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    // Catch expected HTTP call
    const req = httpMock.expectOne(req => req.url.endsWith('/hws/1'));
    expect(req.request.method).toBe('DELETE');

    // Send mock response
    req.flush({ success: true });
  });

  // TEST 4: testing createHw()
  it('should create a new homework', () => {
    // Create mock form data
    const formData = new FormData();
    formData.append('subject', 'Physics');

    // Call service method to create
    service.createHw(formData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    // Catch expected HTTP call
    const req = httpMock.expectOne(req => req.url.endsWith('/hws'));
    expect(req.request.method).toBe('POST');

    // Send mock response
    req.flush({ _id: '3', subject: 'Physics' });
  });
});