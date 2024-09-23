import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaEmpleadoComponent } from './estadistica-empleado.component';

describe('EstadisticaEmpleadoComponent', () => {
  let component: EstadisticaEmpleadoComponent;
  let fixture: ComponentFixture<EstadisticaEmpleadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadisticaEmpleadoComponent]
    });
    fixture = TestBed.createComponent(EstadisticaEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
