import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSettingsComponent } from './popup-settings.component';

describe('PopupSettingsComponent', () => {
  let component: PopupSettingsComponent;
  let fixture: ComponentFixture<PopupSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
