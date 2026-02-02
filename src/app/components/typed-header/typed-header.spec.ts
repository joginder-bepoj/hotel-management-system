import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypedHeader } from './typed-header';

describe('TypedHeader', () => {
  let component: TypedHeader;
  let fixture: ComponentFixture<TypedHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypedHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypedHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
