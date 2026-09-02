import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HwCreate } from './hw-create';

describe('HwCreate', () => {
  let component: HwCreate;
  let fixture: ComponentFixture<HwCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HwCreate],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HwCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
