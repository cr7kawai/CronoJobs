import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuaizarSubscripcionComponent } from './actuaizar-subscripcion.component';

describe('ActuaizarSubscripcionComponent', () => {
  let component: ActuaizarSubscripcionComponent;
  let fixture: ComponentFixture<ActuaizarSubscripcionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActuaizarSubscripcionComponent]
    });
    fixture = TestBed.createComponent(ActuaizarSubscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
