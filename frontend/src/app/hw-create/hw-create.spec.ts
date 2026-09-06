import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HwCreate } from './hw-create';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { HwService } from '../services/hw.service';

describe('HwCreate', () => {
  let component: HwCreate;
  let fixture: ComponentFixture<HwCreate>;
  let hwServiceMock: jasmine.SpyObj<HwService>;
  let router: Router;

  beforeEach(async () => {
    // Create mock for the service
    hwServiceMock = jasmine.createSpyObj('HwService', ['createHw']);

    await TestBed.configureTestingModule({
      imports: [HwCreate, ReactiveFormsModule],
      providers: [
        { provide: HwService, useValue: hwServiceMock },
        provideRouter([]) // Provides a working router for navigation
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HwCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.hwForm).toBeDefined();
    // An empty form should be invalid because of the required validators
    expect(component.hwForm.invalid).toBeTrue(); 
  });

  it('should not call service if form is invalid', () => {
    // Form is empty, so it's invalid
    component.createHw();
    expect(hwServiceMock.createHw).not.toHaveBeenCalled();
  });

  it('should call service and navigate on valid form submission', () => {
    // Populate the form with valid data
    component.hwForm.setValue({
      date: '2023-10-01',
      subject: 'Math',
      task_type: 'Exercise',
      notes: 'Page 10'
    });

    // Mock the service call
    hwServiceMock.createHw.and.returnValue(of({}));

    // Mock the router navigation
    spyOn(router, 'navigate');

    component.createHw();

    expect(hwServiceMock.createHw).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/hws']);
  });

  it('should navigate to home', () => {
    spyOn(router, 'navigate');
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should toggle emoji picker visibility', () => {
    expect(component.showEmojiPicker).toBeFalse();
    component.toggleEmojiPicker();
    expect(component.showEmojiPicker).toBeTrue();
    component.toggleEmojiPicker();
    expect(component.showEmojiPicker).toBeFalse();
  });

  it('should add emoji to subject and hide picker', () => {
    component.addEmojiToSubject('📚');
    expect(component.hwForm.get('subject')?.value).toContain('📚');
    expect(component.showEmojiPicker).toBeFalse();
  });

    it('should not duplicate emoji if already present', () => {
    component.hwForm.get('subject')?.setValue('Math📚');
    component.addEmojiToSubject('📚');
    
    // The value remains unchanged, it will not be shortened to 'Math'!
    expect(component.hwForm.get('subject')?.value).toBe('Math📚');
    expect(component.showEmojiPicker).toBeFalse();
  });
});
