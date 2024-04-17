import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataElementComponent } from './data-element.component';

describe('DataElementsComponent', () => {
  let component: DataElementComponent;
  let fixture: ComponentFixture<DataElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
