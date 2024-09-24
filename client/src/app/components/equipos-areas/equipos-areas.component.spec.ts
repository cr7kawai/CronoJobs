import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposAreasComponent } from './equipos-areas.component';

describe('EquiposAreasComponent', () => {
  let component: EquiposAreasComponent;
  let fixture: ComponentFixture<EquiposAreasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquiposAreasComponent]
    });
    fixture = TestBed.createComponent(EquiposAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
