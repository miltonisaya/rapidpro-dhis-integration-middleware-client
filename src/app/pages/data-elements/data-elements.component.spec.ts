import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataElementsComponent } from './data-elements.component';

describe('DataElementsComponent', () => {
  let component: DataElementsComponent;
  let fixture: ComponentFixture<DataElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataElementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
