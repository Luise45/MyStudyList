import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HwList } from './hw-list';

describe('HwList', () => {
  let component: HwList;
  let fixture: ComponentFixture<HwList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HwList]
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
