import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaActividadComponent } from './vista-actividad.component';

describe('VistaActividadComponent', () => {
  let component: VistaActividadComponent;
  let fixture: ComponentFixture<VistaActividadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaActividadComponent]
    });
    fixture = TestBed.createComponent(VistaActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
