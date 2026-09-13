import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home-page';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomePage,
        FormsModule // Is still needed for [(ngModel)] in the template
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    
    // Inject instances of the provider to monitor them (spying)
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Spy on Router.navigate so that no real navigation happens during the test
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  afterEach(() => {
    // Ensure that no unexpected HTTP requests remain open
    httpMock.verify();
  });

  // --- FUNDAMENTAL TESTS ---

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty email and password', () => {
      expect(component.email).toBe('');
      expect(component.password).toBe('');
    });

    it('should initialize with an empty message', () => {
      expect(component.message).toBe('');
    });

    it('should start in login mode (isRegistering = false)', () => {
      expect(component.isRegistering).toBeFalse();
    });
  });

  describe('toggleMode()', () => {
    it('should switch from login to register mode', () => {
      expect(component.isRegistering).toBeFalse(); // Precondition
      component.toggleMode();                      // Action
      expect(component.isRegistering).toBeTrue();  // Expectation
    });

    it('should switch back from register to login mode', () => {
      component.isRegistering = true;              // Precondition
      component.toggleMode();                      // Action
      expect(component.isRegistering).toBeFalse(); // Expectation
    });

    it('should clear the message when toggling mode', () => {
      component.message = 'Ein alter Fehler';      // Precondition
      component.toggleMode();                      // Action
      expect(component.message).toBe('');          // Expectation
    });
  });
});