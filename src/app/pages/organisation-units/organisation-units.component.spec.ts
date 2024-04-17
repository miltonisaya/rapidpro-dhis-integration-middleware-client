import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationUnitsComponent } from './organisation-units.component';

describe('OrganisationUnitsComponent', () => {
  let component: OrganisationUnitsComponent;
  let fixture: ComponentFixture<OrganisationUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganisationUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganisationUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
