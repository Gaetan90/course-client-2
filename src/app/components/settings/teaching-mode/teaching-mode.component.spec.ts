import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingModeComponent } from './teaching-mode.component';

describe('TeachingModeComponent', () => {
  let component: TeachingModeComponent;
  let fixture: ComponentFixture<TeachingModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [TeachingModeComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
