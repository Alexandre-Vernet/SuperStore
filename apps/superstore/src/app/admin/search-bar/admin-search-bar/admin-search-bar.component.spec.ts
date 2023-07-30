import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSearchBarComponent } from './admin-search-bar.component';

describe('AdminSearchBarComponent', () => {
  let component: AdminSearchBarComponent;
  let fixture: ComponentFixture<AdminSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSearchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
