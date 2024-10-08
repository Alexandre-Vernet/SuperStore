import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAddressComponent } from './create-address.component';

describe('AddressComponent', () => {
  let component: CreateAddressComponent;
  let fixture: ComponentFixture<CreateAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAddressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
