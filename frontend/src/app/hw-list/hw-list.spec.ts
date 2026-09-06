import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HwList } from './hw-list';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Hw } from '../models/hw.model';
import { HwService } from '../services/hw.service';

describe('HwList', () => {
  let component: HwList;
  let fixture: ComponentFixture<HwList>;
  let hwServiceMock: jasmine.SpyObj<HwService>;
  let router: Router;

  beforeEach(async () => {
    // 1. Create mock objects for dependencies
    hwServiceMock = jasmine.createSpyObj('HwService', ['getHws', 'deleteHw']);

    // 2. IMPORTANT: Set default return value so ngOnInit doesn't crash on undefined.subscribe()
    hwServiceMock.getHws.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [HwList], // Standalone component
      providers: [
        { provide: HwService, useValue: hwServiceMock }, // Injects the mock service
        // 3. provideRouter([]) provides a real, working Router & ActivatedRoute internally!
        // This fixes the "createUrlTree is not a function" error from routerLink in the HTML.
        provideRouter([]) 
      ]
    }).compileComponents();

    // 3. Now it's safe to create the component (ngOnInit will run safely)
    fixture = TestBed.createComponent(HwList);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getHws on initialization', () => {
    // ngOnInit is automatically called by createComponent, so we just verify it happened
    expect(hwServiceMock.getHws).toHaveBeenCalled();
  });

  it('should populate hws and filteredHws on successful getHws', () => {
    const mockData: Hw[] = [
      { _id: '1', date: new Date('2023-10-01'), subject: 'Math', task_type: 'Exercise', notes: 'Page 10' }
    ];
    // Override default for this specific test
    hwServiceMock.getHws.and.returnValue(of(mockData));

    component.getHws();

    expect(component.hws).toEqual(mockData);
    expect(component.filteredHws).toEqual(mockData);
  });

  it('should log error on failed getHws', () => {
    spyOn(console, 'error'); // Spy on console to prevent actual error logging in test output
    hwServiceMock.getHws.and.returnValue(throwError(() => new Error('Network error')));

    component.getHws();

    expect(console.error).toHaveBeenCalled();
  });

  it('should delete hw and refresh list when confirmed', () => {
    // Mock window.confirm to return true (user clicks "OK")
    spyOn(window, 'confirm').and.returnValue(true);
    hwServiceMock.deleteHw.and.returnValue(of({}));
    
    // Spy on getHws and showDeleteToast to verify they are called
    spyOn(component, 'getHws');
    spyOn(component, 'showDeleteToast');

    component.deleteHw('1');

    expect(window.confirm).toHaveBeenCalled();
    expect(hwServiceMock.deleteHw).toHaveBeenCalledWith('1');
    expect(component.getHws).toHaveBeenCalled();
    expect(component.showDeleteToast).toHaveBeenCalled();
  });

  it('should NOT delete hw when confirmation is cancelled', () => {
    // Mock window.confirm to return false (user clicks "Cancel")
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteHw('1');

    expect(window.confirm).toHaveBeenCalled();
    expect(hwServiceMock.deleteHw).not.toHaveBeenCalled();
  });

  it('should filter hws by subject', () => {
    component.hws = [
      { _id: '1', date: new Date(), subject: 'Math', task_type: 'HW', notes: 'p1' },
      { _id: '2', date: new Date(), subject: 'German', task_type: 'HW', notes: 'p1' }
    ];

    component.filterHw('math');

    expect(component.filteredHws.length).toBe(1);
    expect(component.filteredHws[0].subject).toBe('Math');
  });

  it('should filter hws by date string', () => {
    const testDate = new Date('2023-10-31');
    component.hws = [
      { _id: '1', date: testDate, subject: 'Math', task_type: 'HW', notes: 'p1' }
    ];

    // The component formats the date using toLocaleDateString(), so we search for a part of it
    component.filterHw('2023');

    expect(component.filteredHws.length).toBe(1);
  });

  it('should toggle sort direction and sort filteredHws descending', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-12-31');
    
    component.hws = [
      { _id: '1', date: date1, subject: 'Math', task_type: 'HW', notes: 'p1' },
      { _id: '2', date: date2, subject: 'German', task_type: 'HW', notes: 'p1' }
    ];
    component.filteredHws = [...component.hws];
    component.sortDirection = 'asc';

    component.toggleSort(); // Changes to 'desc'
    component.sortHws();

    expect(component.sortDirection).toBe('desc');
    // In descending order, date2 (Dec 31) should come first
    expect(component.filteredHws[0]._id).toBe('2');
  });

  it('should navigate to home', () => {
    // Spy on the real router's navigate method
    spyOn(router, 'navigate');
    
    component.goHome();
    
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should prevent default event behavior', () => {
    // Create a mock Event object with a spy on preventDefault
    const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;
    
    component.preventSubmit(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should show delete toast if element exists', () => {
    // Mock the global bootstrap object
    const mockToastInstance = { show: jasmine.createSpy('show') };
    (window as any).bootstrap = {
      Toast: jasmine.createSpy('Toast').and.returnValue(mockToastInstance)
    };
    
    // Mock document.getElementById to return a dummy element
    spyOn(document, 'getElementById').and.returnValue({} as any);

    component.showDeleteToast();

    expect(document.getElementById).toHaveBeenCalledWith('deleteToast');
    expect((window as any).bootstrap.Toast).toHaveBeenCalled();
    expect(mockToastInstance.show).toHaveBeenCalled();
  });
});
