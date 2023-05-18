import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmOrderComponent } from "./confirm-order.component";

describe('CartComponent', () => {
  let component: ConfirmOrderComponent;
  let fixture: ComponentFixture<ConfirmOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
