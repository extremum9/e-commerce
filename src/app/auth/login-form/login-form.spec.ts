import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideZonelessChangeDetection } from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';

import { Snackbar } from '../../snackbar';
import { AuthApiClient } from '../auth-api-client';

import { LoginForm } from './login-form';

describe(LoginForm.name, () => {
  const setup = () => {
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
    fixture.detectChanges();

    const dialogClosedSpy = spyOn(component.dialogClosed, 'emit');

    const getEmailInputHarness = () =>
      loader.getHarness(MatInputHarness.with({ selector: '[data-testid=login-form-email-input]' }));
    const getPasswordInputHarness = () =>
      loader.getHarness(
        MatInputHarness.with({ selector: '[data-testid=login-form-password-input]' })
      );
    const getRememberMeCheckboxHarness = () =>
      loader.getHarness(
        MatCheckboxHarness.with({ selector: '[data-testid=login-form-remember-me-checkbox]' })
      );
    const getResetPasswordButtonHarness = () =>
      loader.getHarness(MatButtonHarness.with({ selector: '[data-testid=reset-password-button]' }));
    const getSubmitButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({
          selector: '[data-testid=login-form-submit-button]',
          appearance: 'filled'
        })
      );

    return {
      fixture,
      component,
      loader,
      getEmailInputHarness,
      getPasswordInputHarness,
      getRememberMeCheckboxHarness,
      getResetPasswordButtonHarness,
      getSubmitButtonHarness,
      mockCredentials,
      login$,
      resetPassword$,
      dialogClosedSpy,
      authApiClientSpy,
      snackbarSpy
    };
  };

  it('should display a form to sign in', async () => {
    const {
      getEmailInputHarness,
      getPasswordInputHarness,
      getRememberMeCheckboxHarness,
      getResetPasswordButtonHarness,
      getSubmitButtonHarness
    } = setup();

    const emailInputHarness = await getEmailInputHarness();
    expect(await emailInputHarness.getType())
      .withContext('The type of the email input is incorrect')
      .toBe('email');
    expect(await emailInputHarness.getPlaceholder())
      .withContext('The placeholder of the email input is incorrect')
      .toContain('Enter your email');

    const passwordInputHarness = await getPasswordInputHarness();
    expect(await passwordInputHarness.getType())
      .withContext('The type of the password input is incorrect')
      .toBe('password');
    expect(await passwordInputHarness.getPlaceholder())
      .withContext('The placeholder of the email input is incorrect')
      .toContain('Enter your password');

    const rememberMeCheckboxHarness = await getRememberMeCheckboxHarness();
    expect(await rememberMeCheckboxHarness.getLabelText())
      .withContext('The remember-me checkbox should have text')
      .toContain('Remember me');
    expect(await rememberMeCheckboxHarness.isChecked())
      .withContext('The remember-me checkbox should be unchecked by default')
      .toBe(false);

    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    expect(await resetPasswordButtonHarness.getText())
      .withContext('The reset-password button should have text')
      .toContain('Forgot password?');

    const submitButtonHarness = await getSubmitButtonHarness();
    expect(await submitButtonHarness.getType())
      .withContext('The type of the submit button is incorrect')
      .toBe('submit');
    expect(await submitButtonHarness.isDisabled()).withContext(
      'The submit button should NOT be disabled when the status is NOT submitting'
    );
    expect(await submitButtonHarness.getText())
      .withContext('The submit button should have text')
      .toContain('Sign In');
  });

  it('should display validation error messages if fields are invalid', async () => {
    const { loader, getEmailInputHarness, getPasswordInputHarness } = setup();

    const emailFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid=login-form-email-field]' })
    );
    const emailInputHarness = await getEmailInputHarness();

    await emailInputHarness.setValue('');
    await emailInputHarness.blur();

    let emailErrorMessages = await emailFieldHarness.getTextErrors();
    expect(emailErrorMessages.length)
      .withContext('You should have an error message if the email field is required')
      .toBe(1);
    expect(emailErrorMessages[0]).toContain('Email is required');

    await emailInputHarness.setValue('test');

    emailErrorMessages = await emailFieldHarness.getTextErrors();
    expect(emailErrorMessages.length)
      .withContext('You should have an error message if the email field is invalid')
      .toBe(1);
    expect(emailErrorMessages[0]).toContain('Email is invalid');

    const passwordFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid=login-form-password-field]' })
    );
    const passwordInputHarness = await getPasswordInputHarness();

    await passwordInputHarness.setValue('');
    await passwordInputHarness.blur();

    let passwordErrorMessages = await passwordFieldHarness.getTextErrors();
    expect(passwordErrorMessages.length)
      .withContext('You should have an error message if the password field is required')
      .toBe(1);
    expect(passwordErrorMessages[0]).toContain('Password is required');

    await passwordInputHarness.setValue('1234');

    passwordErrorMessages = await passwordFieldHarness.getTextErrors();
    expect(passwordErrorMessages.length)
      .withContext('You should have an error message if the password field is too short')
      .toBe(1);
    expect(passwordErrorMessages[0]).toContain('Password must be at least 6 characters long');
  });

  it('should toggle password visibility', async () => {
    const { loader, getPasswordInputHarness } = setup();

    const passwordInputHarness = await getPasswordInputHarness();

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid=password-visibility-toggle-button]' })
    );
    const button = await buttonHarness.host();
    expect(await button.getAttribute('aria-label'))
      .withContext(
        'The `aria-label` attribute of the password-visibility-toggle button is incorrect'
      )
      .toBe('Toggle password visibility');
    expect(await button.getAttribute('aria-pressed'))
      .withContext(
        'The `aria-pressed` attribute of the password-visibility-toggle button should be `false` by default'
      )
      .toBe('false');

    const buttonIconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await buttonIconHarness.getName())
      .withContext(
        'The icon of the password-visibility-toggle button should be `visibility_off` by default'
      )
      .toBe('visibility_off');

    await buttonHarness.click();

    expect(await passwordInputHarness.getType())
      .withContext('The type of the password input should be `text` when toggled once')
      .toBe('text');
    expect(await button.getAttribute('aria-pressed'))
      .withContext(
        'The `aria-pressed` attribute of the password-visibility-toggle button should be `true` when toggled once'
      )
      .toBe('true');
    expect(await buttonIconHarness.getName())
      .withContext(
        'The icon of the password-visibility-toggle button should be `visibility` when toggled once'
      )
      .toBe('visibility');

    await buttonHarness.click();

    expect(await passwordInputHarness.getType())
      .withContext('The type of the password input should be `password` when toggled twice')
      .toBe('password');
    expect(await button.getAttribute('aria-pressed'))
      .withContext(
        'The `aria-pressed` attribute of the password-visibility-toggle button should be `false` when toggled twice'
      )
      .toBe('false');
    expect(await buttonIconHarness.getName())
      .withContext(
        'The icon of the password-visibility-toggle button should be `visibility_off` when toggled twice'
      )
      .toBe('visibility_off');
  });

  it('should NOT call the `AuthApiClient` service to reset the password if the email is missing', async () => {
    const { getResetPasswordButtonHarness, authApiClientSpy, snackbarSpy } = setup();
    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    await resetPasswordButtonHarness.click();

    expect(snackbarSpy.showError).toHaveBeenCalledWith('Please enter your email address');
    expect(authApiClientSpy.resetPassword).not.toHaveBeenCalled();
  });

  it('should call the `AuthApiClient` service to reset the password and display a default snackbar on success', async () => {
    const {
      loader,
      getEmailInputHarness,
      getResetPasswordButtonHarness,
      mockCredentials,
      resetPassword$,
      authApiClientSpy,
      snackbarSpy
    } = setup();
    const { email } = mockCredentials;

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(email);

    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    await resetPasswordButtonHarness.click();

    let spinner = await loader.hasHarness(
      MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-reset-password-spinner]' })
    );
    expect(spinner).toBe(true);

    expect(authApiClientSpy.resetPassword).toHaveBeenCalledOnceWith(email);

    resetPassword$.next();
    resetPassword$.complete();

    spinner = await loader.hasHarness(
      MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-reset-password-spinner]' })
    );
    expect(spinner).toBe(false);

    expect(snackbarSpy.showDefault).toHaveBeenCalledOnceWith(
      `A password reset link has been sent to ${email}`
    );
  });

  it('should call the `AuthApiClient` service to reset the password and display an error snackbar on failure', async () => {
    const {
      loader,
      getEmailInputHarness,
      getResetPasswordButtonHarness,
      mockCredentials,
      resetPassword$,
      authApiClientSpy,
      snackbarSpy
    } = setup();
    const { email } = mockCredentials;

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(email);

    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    await resetPasswordButtonHarness.click();

    let spinner = await loader.hasHarness(
      MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-reset-password-spinner]' })
    );
    expect(spinner).toBe(true);

    expect(authApiClientSpy.resetPassword).toHaveBeenCalledOnceWith(email);

    resetPassword$.error(new Error());

    spinner = await loader.hasHarness(
      MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-reset-password-spinner]' })
    );
    expect(spinner).toBe(false);

    expect(snackbarSpy.showError).toHaveBeenCalledOnceWith('Could not send reset email');
  });

  it('should NOT call the `AuthApiClient` service to sign in if the form is invalid', async () => {
    const { getSubmitButtonHarness, authApiClientSpy } = setup();
    const submitButtonHarness = await getSubmitButtonHarness();

    await submitButtonHarness.click();

    expect(authApiClientSpy.login).not.toHaveBeenCalled();
  });

  it('should call the `AuthApiClient` service to sign in and close the dialog on success', async () => {
    const {
      getEmailInputHarness,
      getPasswordInputHarness,
      getRememberMeCheckboxHarness,
      getSubmitButtonHarness,
      mockCredentials,
      login$,
      dialogClosedSpy,
      authApiClientSpy
    } = setup();

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(mockCredentials.email);

    const rememberMeCheckboxHarness = await getRememberMeCheckboxHarness();
    await rememberMeCheckboxHarness.check();

    const passwordInputHarness = await getPasswordInputHarness();
    await passwordInputHarness.setValue(mockCredentials.password);

    const submitButtonHarness = await getSubmitButtonHarness();
    await submitButtonHarness.click();

    expect(await submitButtonHarness.isDisabled())
      .withContext('The submit button should be disabled when the status is submitting')
      .toBe(true);
    expect(await submitButtonHarness.getText())
      .withContext('The submit button should have a different text when the status is submitting')
      .toContain('Signing In...');

    expect(authApiClientSpy.login).toHaveBeenCalledOnceWith(mockCredentials);

    login$.next();

    expect(dialogClosedSpy).toHaveBeenCalled();
  });

  it('should call the `AuthApiClient` service to sign in and display an error snackbar on failure', async () => {
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
    } = setup();

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

    expect(await submitButtonHarness.isDisabled())
      .withContext('The submit button should NOT be disabled when the status is NOT submitting')
      .toBe(false);
    expect(await submitButtonHarness.getText())
      .withContext('The submit button should have a default text when the status is NOT submitting')
      .toContain('Sign In');

    expect(dialogClosedSpy).not.toHaveBeenCalled();
    expect(snackbarSpy.showError).toHaveBeenCalledOnceWith('The email or password is incorrect');
  });
});
