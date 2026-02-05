import { Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';

import { AuthApiClient } from '../auth-api-client';
import { Snackbar } from '../../snackbar/snackbar';
import { provideDisabledAnimations } from '../../testing-utils';

import { RegisterForm } from './register-form';

describe(RegisterForm.name, () => {
  const setup = async () => {
    const mockCredentials = {
      name: 'Test',
      email: 'test@mail.com',
      password: '123456'
    };

    const register$ = new Subject<void>();
    const authApiClientSpy = jasmine.createSpyObj<AuthApiClient>('AuthApiClient', ['register']);
    authApiClientSpy.register.and.returnValue(register$);

    const snackbarSpy = jasmine.createSpyObj<Snackbar>('Snackbar', ['showError', 'dismiss']);

    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        provideDisabledAnimations(),
        {
          provide: AuthApiClient,
          useValue: authApiClientSpy
        },
        {
          provide: Snackbar,
          useValue: snackbarSpy
        }
      ]
    });
    const fixture = TestBed.createComponent(RegisterForm);
    const component = fixture.componentInstance;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const dialogClosedSpy = spyOn(component.dialogClosed, 'emit');

    const getNameInputHarness = () =>
      loader.getHarness(MatInputHarness.with({ selector: '[data-testid=register-name-input]' }));
    const getEmailInputHarness = () =>
      loader.getHarness(MatInputHarness.with({ selector: '[data-testid=register-email-input]' }));
    const getPasswordInputHarness = () =>
      loader.getHarness(
        MatInputHarness.with({ selector: '[data-testid=register-password-input]' })
      );
    const getSubmitButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({
          selector: '[data-testid=register-submit-button]',
          appearance: 'filled'
        })
      );

    return {
      component,
      loader,
      getNameInputHarness,
      getEmailInputHarness,
      getPasswordInputHarness,
      getSubmitButtonHarness,
      mockCredentials,
      register$,
      dialogClosedSpy,
      authApiClientSpy,
      snackbarSpy
    };
  };

  it('should display form to register', async () => {
    const {
      getNameInputHarness,
      getEmailInputHarness,
      getPasswordInputHarness,
      getSubmitButtonHarness
    } = await setup();

    const nameInputHarness = await getNameInputHarness();
    expect(await nameInputHarness.getType()).toBe('text');
    expect(await nameInputHarness.getPlaceholder()).toContain('Enter your name');

    const emailInputHarness = await getEmailInputHarness();
    expect(await emailInputHarness.getType()).toBe('email');
    expect(await emailInputHarness.getPlaceholder()).toContain('Enter your email');

    const passwordInputHarness = await getPasswordInputHarness();
    expect(await passwordInputHarness.getType()).toBe('password');
    expect(await passwordInputHarness.getPlaceholder()).toContain('Enter your password');

    const submitButtonHarness = await getSubmitButtonHarness();
    expect(await submitButtonHarness.getType()).toBe('submit');
    expect(await submitButtonHarness.isDisabled()).toBe(false);
    expect(await submitButtonHarness.getText()).toContain('Sign Up');
  });

  it('should display validation error messages if fields are invalid', async () => {
    const { loader, getNameInputHarness, getEmailInputHarness, getPasswordInputHarness } =
      await setup();

    const nameFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid=register-name-field]' })
    );
    const nameInputHarness = await getNameInputHarness();

    await nameInputHarness.setValue('');
    await nameInputHarness.blur();

    const nameErrorMessages = await nameFieldHarness.getTextErrors();
    expect(nameErrorMessages.length).toBe(1);
    expect(nameErrorMessages[0]).toContain('Name is required');

    const emailFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid=register-email-field]' })
    );
    const emailInputHarness = await getEmailInputHarness();

    await emailInputHarness.setValue('');
    await emailInputHarness.blur();

    let emailErrorMessages = await emailFieldHarness.getTextErrors();
    expect(emailErrorMessages.length).toBe(1);
    expect(emailErrorMessages[0]).toContain('Email is required');

    await emailInputHarness.setValue('test');

    emailErrorMessages = await emailFieldHarness.getTextErrors();
    expect(emailErrorMessages.length).toBe(1);
    expect(emailErrorMessages[0]).toContain('Email is invalid');

    const passwordFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid=register-password-field]' })
    );
    const passwordInputHarness = await getPasswordInputHarness();

    await passwordInputHarness.setValue('');
    await passwordInputHarness.blur();

    let passwordErrorMessages = await passwordFieldHarness.getTextErrors();
    expect(passwordErrorMessages.length).toBe(1);
    expect(passwordErrorMessages[0]).toContain('Password is required');

    await passwordInputHarness.setValue('1234');

    passwordErrorMessages = await passwordFieldHarness.getTextErrors();
    expect(passwordErrorMessages.length).toBe(1);
    expect(passwordErrorMessages[0]).toContain('Password must be at least 6 characters long');
  });

  it('should toggle password visibility', async () => {
    const { loader, getPasswordInputHarness } = await setup();

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({
        selector: '[data-testid=register-password-toggle-button]'
      })
    );
    const buttonHost = await buttonHarness.host();
    expect(await buttonHost.getAttribute('aria-label')).toBe('Toggle password visibility');
    expect(await buttonHost.getAttribute('aria-pressed')).toBe('false');

    const buttonIconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await buttonIconHarness.getName()).toBe('visibility_off');

    await buttonHarness.click();

    const passwordInputHarness = await getPasswordInputHarness();
    expect(await passwordInputHarness.getType()).toBe('text');
    expect(await buttonHost.getAttribute('aria-pressed')).toBe('true');
    expect(await buttonIconHarness.getName()).toBe('visibility');

    await buttonHarness.click();

    expect(await passwordInputHarness.getType()).toBe('password');
    expect(await buttonHost.getAttribute('aria-pressed')).toBe('false');
    expect(await buttonIconHarness.getName()).toBe('visibility_off');
  });

  it('should NOT call AuthApiClient.register if form is invalid', async () => {
    const { getSubmitButtonHarness, authApiClientSpy } = await setup();
    const submitButtonHarness = await getSubmitButtonHarness();

    await submitButtonHarness.click();

    expect(authApiClientSpy.register).not.toHaveBeenCalled();
  });

  it('should call AuthApiClient.register and close dialog on success', async () => {
    const {
      getNameInputHarness,
      getEmailInputHarness,
      getPasswordInputHarness,
      getSubmitButtonHarness,
      mockCredentials,
      register$,
      dialogClosedSpy,
      authApiClientSpy
    } = await setup();

    const nameInputHarness = await getNameInputHarness();
    await nameInputHarness.setValue(mockCredentials.name);

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(mockCredentials.email);

    const passwordInputHarness = await getPasswordInputHarness();
    await passwordInputHarness.setValue(mockCredentials.password);

    const submitButtonHarness = await getSubmitButtonHarness();
    await submitButtonHarness.click();

    expect(await submitButtonHarness.isDisabled()).toBe(true);
    expect(await submitButtonHarness.getText()).toContain('Signing Up...');
    expect(authApiClientSpy.register).toHaveBeenCalledOnceWith(mockCredentials);

    register$.next();

    expect(dialogClosedSpy).toHaveBeenCalled();
  });

  it('should call AuthApiClient.register and display error snackbar on failure', async () => {
    const {
      getNameInputHarness,
      getEmailInputHarness,
      getPasswordInputHarness,
      getSubmitButtonHarness,
      mockCredentials,
      register$,
      dialogClosedSpy,
      authApiClientSpy,
      snackbarSpy
    } = await setup();

    const nameInputHarness = await getNameInputHarness();
    await nameInputHarness.setValue(mockCredentials.name);

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(mockCredentials.email);

    const passwordInputHarness = await getPasswordInputHarness();
    await passwordInputHarness.setValue(mockCredentials.password);

    const submitButtonHarness = await getSubmitButtonHarness();
    await submitButtonHarness.click();

    expect(authApiClientSpy.register).toHaveBeenCalledOnceWith(mockCredentials);

    register$.error(new Error());

    expect(await submitButtonHarness.isDisabled()).toBe(false);
    expect(await submitButtonHarness.getText()).toContain('Sign Up');
    expect(dialogClosedSpy).not.toHaveBeenCalled();
    expect(snackbarSpy.showError).toHaveBeenCalledOnceWith('Try again with another email');
  });
});
