import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTypeComponent } from './client-type.component';

describe('ClientTypeComponent', () => {
  let component: ClientTypeComponent;
  let fixture: ComponentFixture<ClientTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ClientTypeComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
