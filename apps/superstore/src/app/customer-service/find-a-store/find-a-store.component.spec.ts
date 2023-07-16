import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindAStoreComponent } from './find-a-store.component';

describe('FindAStoreComponent', () => {
  let component: FindAStoreComponent;
  let fixture: ComponentFixture<FindAStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindAStoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FindAStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
