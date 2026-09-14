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

    // --- HTTP REQUEST TESTS (login & register) ---

  describe('login()', () => {
        it('should clear message before making login request', () => {
      // Arrange
      component.message = 'Old error message';
      component.email = 'test@example.com';
      component.password = 'password123';
      
      // Act
      component.login();
      
      // Assert: Message should be cleared immediately
      expect(component.message).toBe('');
      
      // Cleanup: Mock the HTTP response to prevent "open request" error in afterEach
      const req = httpMock.expectOne(`${component['apiUrl']}/api/auth/login`);
      req.flush({ token: 'mock-token' });
    });

    it('should send POST request to login endpoint with credentials', () => {
      // Arrange: Set test data
      component.email = 'test@example.com';
      component.password = 'password123';
      
      // Act: Call login method
      component.login();

      // Assert: Expect and verify HTTP request
      const req = httpMock.expectOne(`${component['apiUrl']}/api/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Send mock response (to "complete" the request)
      req.flush({ token: 'fake-jwt-token' });
    });

    it('should store token and navigate on successful login', () => {
      // Spy on localStorage.setItem to check if it is called
      spyOn(localStorage, 'setItem');
      
      component.email = 'test@example.com';
      component.password = 'password123';
      component.login();

      // Simulate mock response from server
      const req = httpMock.expectOne(`${component['apiUrl']}/api/auth/login`);
      req.flush({ token: 'mock-token-123' });

      // Assert: Token was stored
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token-123');
      // Assert: Navigation to /hws was triggered
      expect(router.navigate).toHaveBeenCalledWith(['hws']);
    });

    it('should set error message when login fails', () => {
      component.email = 'test@example.com';
      component.password = 'wrongpassword';
      component.login();

      // Mock error response from server (401 Unauthorized)
      const req = httpMock.expectOne(`${component['apiUrl']}/api/auth/login`);
      req.flush(
        { message: 'Invalid credentials' },
        { status: 401, statusText: 'Unauthorized' }
      );

      // Assert: Error message was set
      expect(component.message).toBe('Invalid credentials');
      // Assert: No navigation on error
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should set default error message when login fails without message', () => {
      component.email = 'test@example.com';
      component.password = 'wrongpassword';
      component.login();

      // Mock error without specific message
      const req = httpMock.expectOne(`${component['apiUrl']}/api/auth/login`);
      req.flush(
        {},
        { status: 500, statusText: 'Internal Server Error' }
      );

      // Assert: Default error message was set
      expect(component.message).toBe('Login failed');
    });
  });

  describe('register()', () => {
        it('should clear message before making register request', () => {
      // Arrange
      component.message = 'Old error message';
      component.email = 'new@example.com';
      component.password = 'password123';
      
      // Act
      component.register();
      
      // Assert: Message should be cleared immediately
      expect(component.message).toBe('');
      
      // Cleanup: Mock the HTTP response to prevent "open request" error in afterEach
      const req = httpMock.expectOne(`${component['apiUrl']}/api/auth/register`);
      req.flush({});
    });

    it('should send POST request to register endpoint', () => {
      component.email = 'new@example.com';
      component.password = 'password123';
      component.register();

      const req = httpMock.expectOne(`${component['apiUrl']}/api/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'new@example.com',
        password: 'password123'
      });
      
      req.flush({});
    });

    it('should show success message and reset form on successful registration', () => {
      component.isRegistering = true;
      component.email = 'new@example.com';
      component.password = 'password123';
      component.register();

      const req = httpMock.expectOne(`${component['apiUrl']}/api/auth/register`);
      req.flush({});

      // Assert: Success message was displayed
      expect(component.message).toBe('Account created!');
      // Assert: Mode was reset (back to login)
      expect(component.isRegistering).toBeFalse();
      // Assert: Password field was cleared
      expect(component.password).toBe('');
    });

    it('should set error message when registration fails', () => {
      component.email = 'existing@example.com';
      component.password = 'password123';
      component.register();

      // Mock error: Email already exists (409 Conflict)
      const req = httpMock.expectOne(`${component['apiUrl']}/api/auth/register`);
      req.flush(
        { message: 'Email already exists' },
        { status: 409, statusText: 'Conflict' }
      );

      expect(component.message).toBe('Email already exists');
    });
  });

  describe('submit()', () => {
    it('should call login() when isRegistering is false', () => {
      // Spy on the login method
      spyOn(component, 'login');
      
      component.isRegistering = false;
      component.submit();
      
      expect(component.login).toHaveBeenCalled();
    });

    it('should call register() when isRegistering is true', () => {
      // Spy on the register method
      spyOn(component, 'register');
      
      component.isRegistering = true;
      component.submit();
      
      expect(component.register).toHaveBeenCalled();
    });
  });
});