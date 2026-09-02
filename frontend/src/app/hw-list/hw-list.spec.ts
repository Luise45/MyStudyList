import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HwList } from './hw-list';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

describe('HwList', () => {
  let component: HwList;
  let fixture: ComponentFixture<HwList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HwList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { // Mock for ActivatedRoute
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { 
              paramMap: { 
                get: () => null  // Returns no parameters
              }
            } 
          } 
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HwList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
