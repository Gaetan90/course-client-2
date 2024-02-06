import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClientTypeComponent } from './update-client-type.component';

describe('UpdateClientTypeComponent', () => {
  let component: UpdateClientTypeComponent;
  let fixture: ComponentFixture<UpdateClientTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [UpdateClientTypeComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateClientTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
