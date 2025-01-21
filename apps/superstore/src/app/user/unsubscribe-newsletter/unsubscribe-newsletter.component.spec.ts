import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsubscribeNewsletterComponent } from './unsubscribe-newsletter.component';

describe('UnsubscribeNewsletterComponent', () => {
  let component: UnsubscribeNewsletterComponent;
  let fixture: ComponentFixture<UnsubscribeNewsletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnsubscribeNewsletterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnsubscribeNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
