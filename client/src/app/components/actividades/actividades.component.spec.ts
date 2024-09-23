import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesComponent } from './actividades.component';

describe('ActividadComponent', () => {
  let component: ActividadComponent;
  let fixture: ComponentFixture<ActividadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActividadesComponent]
    });
    fixture = TestBed.createComponent(ActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
