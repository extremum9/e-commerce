import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideZonelessChangeDetection } from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';

import { Snackbar } from '../../snackbar/snackbar';
import { AuthApiClient } from '../auth-api-client';

import { LoginForm } from './login-form';

describe(LoginForm.name, () => {
  const setup = async () => {
    const mockCredentials = {
      email: 'test@mail.com',
      password: '123456',
      rememberMe: true
    };

    const login$ = new Subject<void>();
    const resetPassword$ = new Subject<void>();
    const authApiClientSpy = jasmine.createSpyObj<AuthApiClient>('AuthApiClient', [
      'login',
      'resetPassword'
    ]);
    authApiClientSpy.login.and.returnValue(login$);
    authApiClientSpy.resetPassword.and.returnValue(resetPassword$);

    const snackbarSpy = jasmine.createSpyObj<Snackbar>('Snackbar', [
      'showDefault',
      'showError',
      'dismiss'
    ]);

    TestBed.configureTestingModule({
      imports: [MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        },
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
    const fixture = TestBed.createComponent(LoginForm);
    const component = fixture.componentInstance;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const dialogClosedSpy = spyOn(component.dialogClosed, 'emit');

    const getEmailInputHarness = () =>
      loader.getHarness(MatInputHarness.with({ selector: '[data-testid=login-email-input]' }));
    const getPasswordInputHarness = () =>
      loader.getHarness(MatInputHarness.with({ selector: '[data-testid=login-password-input]' }));
    const getRememberMeCheckboxHarness = () =>
      loader.getHarness(
        MatCheckboxHarness.with({ selector: '[data-testid=login-remember-me-checkbox]' })
      );
    const getSubmitButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({
          selector: '[data-testid=login-submit-button]',
          appearance: 'filled'
        })
      );

    const hasResetPasswordSpinnerHarness = () =>
      loader.hasHarness(
        MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-reset-password-spinner]' })
      );
    const getResetPasswordButtonHarness = () =>
      loader.getHarness(MatButtonHarness.with({ selector: '[data-testid=reset-password-button]' }));

    return {
      component,
      loader,
      getEmailInputHarness,
      getPasswordInputHarness,
      getRememberMeCheckboxHarness,
      getSubmitButtonHarness,
      hasResetPasswordSpinnerHarness,
      getResetPasswordButtonHarness,
      mockCredentials,
      login$,
      resetPassword$,
      dialogClosedSpy,
      authApiClientSpy,
      snackbarSpy
    };
  };

  it('should display form to log in', async () => {
    const {
      getEmailInputHarness,
      getPasswordInputHarness,
      getRememberMeCheckboxHarness,
      getResetPasswordButtonHarness,
      getSubmitButtonHarness
    } = await setup();

    const emailInputHarness = await getEmailInputHarness();
    expect(await emailInputHarness.getType()).toBe('email');
    expect(await emailInputHarness.getPlaceholder()).toContain('Enter your email');

    const passwordInputHarness = await getPasswordInputHarness();
    expect(await passwordInputHarness.getType()).toBe('password');
    expect(await passwordInputHarness.getPlaceholder()).toContain('Enter your password');

    const rememberMeCheckboxHarness = await getRememberMeCheckboxHarness();
    expect(await rememberMeCheckboxHarness.getLabelText()).toContain('Remember me');
    expect(await rememberMeCheckboxHarness.isChecked()).toBe(false);

    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    expect(await resetPasswordButtonHarness.getText()).toContain('Forgot password?');

    const submitButtonHarness = await getSubmitButtonHarness();
    expect(await submitButtonHarness.getType()).toBe('submit');
    expect(await submitButtonHarness.isDisabled()).toBe(false);
    expect(await submitButtonHarness.getText()).toContain('Sign In');
  });

  it('should display validation error messages if fields are invalid', async () => {
    const { loader, getEmailInputHarness, getPasswordInputHarness } = await setup();

    const emailFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid=login-email-field]' })
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
      MatFormFieldHarness.with({ selector: '[data-testid=login-password-field]' })
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
      MatButtonHarness.with({ selector: '[data-testid=login-password-toggle-button]' })
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

  it('should NOT call AuthApiClient.resetPassword if email is missing', async () => {
    const { getResetPasswordButtonHarness, authApiClientSpy, snackbarSpy } = await setup();
    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    await resetPasswordButtonHarness.click();

    expect(snackbarSpy.showError).toHaveBeenCalledWith('Please enter your email address');
    expect(authApiClientSpy.resetPassword).not.toHaveBeenCalled();
  });

  it('should call AuthApiClient.resetPassword and display default snackbar on success', async () => {
    const {
      getEmailInputHarness,
      hasResetPasswordSpinnerHarness,
      getResetPasswordButtonHarness,
      mockCredentials,
      resetPassword$,
      authApiClientSpy,
      snackbarSpy
    } = await setup();
    const { email } = mockCredentials;

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(email);

    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    await resetPasswordButtonHarness.click();

    expect(await hasResetPasswordSpinnerHarness()).toBe(true);
    expect(authApiClientSpy.resetPassword).toHaveBeenCalledOnceWith(email);

    resetPassword$.next();
    resetPassword$.complete();

    expect(await hasResetPasswordSpinnerHarness()).toBe(false);
    expect(snackbarSpy.showDefault).toHaveBeenCalledOnceWith(
      `A password reset link has been sent to ${email}`
    );
  });

  it('should call AuthApiClient.resetPassword and display error snackbar on failure', async () => {
    const {
      getEmailInputHarness,
      hasResetPasswordSpinnerHarness,
      getResetPasswordButtonHarness,
      mockCredentials,
      resetPassword$,
      authApiClientSpy,
      snackbarSpy
    } = await setup();
    const { email } = mockCredentials;

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(email);

    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    await resetPasswordButtonHarness.click();

    expect(await hasResetPasswordSpinnerHarness()).toBe(true);
    expect(authApiClientSpy.resetPassword).toHaveBeenCalledOnceWith(email);

    resetPassword$.error(new Error());

    expect(await hasResetPasswordSpinnerHarness()).toBe(false);
    expect(snackbarSpy.showError).toHaveBeenCalledOnceWith('Could not send reset email');
  });

  it('should NOT call AuthApiClient.login if form is invalid', async () => {
    const { getSubmitButtonHarness, authApiClientSpy } = await setup();
    const submitButtonHarness = await getSubmitButtonHarness();

    await submitButtonHarness.click();

    expect(authApiClientSpy.login).not.toHaveBeenCalled();
  });

  it('should call AuthApiClient.login and close dialog on success', async () => {
    const {
      getEmailInputHarness,
      getPasswordInputHarness,
      getRememberMeCheckboxHarness,
      getSubmitButtonHarness,
      mockCredentials,
      login$,
      dialogClosedSpy,
      authApiClientSpy
    } = await setup();

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(mockCredentials.email);

    const rememberMeCheckboxHarness = await getRememberMeCheckboxHarness();
    await rememberMeCheckboxHarness.check();

    const passwordInputHarness = await getPasswordInputHarness();
    await passwordInputHarness.setValue(mockCredentials.password);

    const submitButtonHarness = await getSubmitButtonHarness();
    await submitButtonHarness.click();

    expect(await submitButtonHarness.isDisabled()).toBe(true);
    expect(await submitButtonHarness.getText()).toContain('Signing In...');
    expect(authApiClientSpy.login).toHaveBeenCalledOnceWith(mockCredentials);

    login$.next();

    expect(dialogClosedSpy).toHaveBeenCalled();
  });

  it('should call AuthApiClient.login and display error snackbar on failure', async () => {
    const {
      getEmailInputHarness,
      getPasswordInputHarness,
      getRememberMeCheckboxHarness,
      getSubmitButtonHarness,
      mockCredentials,
      login$,
      dialogClosedSpy,
      authApiClientSpy,
      snackbarSpy
    } = await setup();

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(mockCredentials.email);

    const passwordInputHarness = await getPasswordInputHarness();
    await passwordInputHarness.setValue(mockCredentials.password);

    const rememberMeCheckboxHarness = await getRememberMeCheckboxHarness();
    await rememberMeCheckboxHarness.check();

    const submitButtonHarness = await getSubmitButtonHarness();
    await submitButtonHarness.click();

    expect(authApiClientSpy.login).toHaveBeenCalledOnceWith(mockCredentials);

    login$.error(new Error());

    expect(await submitButtonHarness.isDisabled()).toBe(false);
    expect(await submitButtonHarness.getText()).toContain('Sign In');

    expect(dialogClosedSpy).not.toHaveBeenCalled();
    expect(snackbarSpy.showError).toHaveBeenCalledOnceWith('The email or password is incorrect');
  });
});
