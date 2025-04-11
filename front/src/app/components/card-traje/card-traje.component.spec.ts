import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTrajeComponent } from './card-traje.component';

describe('CardTrajeComponent', () => {
  let component: CardTrajeComponent;
  let fixture: ComponentFixture<CardTrajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTrajeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardTrajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
