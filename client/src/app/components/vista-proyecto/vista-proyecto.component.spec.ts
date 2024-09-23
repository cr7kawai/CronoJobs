import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaProyectoComponent } from './vista-proyecto.component';

describe('VistaProyectoComponent', () => {
  let component: VistaProyectoComponent;
  let fixture: ComponentFixture<VistaProyectoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaProyectoComponent]
    });
    fixture = TestBed.createComponent(VistaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
