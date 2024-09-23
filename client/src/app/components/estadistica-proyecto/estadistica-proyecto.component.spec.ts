import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaProyectoComponent } from './estadistica-proyecto.component';

describe('EstadisticaProyectoComponent', () => {
  let component: EstadisticaProyectoComponent;
  let fixture: ComponentFixture<EstadisticaProyectoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadisticaProyectoComponent]
    });
    fixture = TestBed.createComponent(EstadisticaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
