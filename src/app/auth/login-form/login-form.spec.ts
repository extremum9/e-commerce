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

  it('should display form to log in', async () => {
    const {
      getEmailInputHarness,
      getPasswordInputHarness,
      getRememberMeCheckboxHarness,
      getResetPasswordButtonHarness,
      getSubmitButtonHarness
    } = setup();

    const emailInputHarness = await getEmailInputHarness();
    expect(await emailInputHarness.getType())
      .withContext('Email input type')
      .toBe('email');
    expect(await emailInputHarness.getPlaceholder())
      .withContext('Email input placeholder')
      .toContain('Enter your email');

    const passwordInputHarness = await getPasswordInputHarness();
    expect(await passwordInputHarness.getType())
      .withContext('Password input type')
      .toBe('password');
    expect(await passwordInputHarness.getPlaceholder())
      .withContext('Password input placeholder')
      .toContain('Enter your password');

    const rememberMeCheckboxHarness = await getRememberMeCheckboxHarness();
    expect(await rememberMeCheckboxHarness.getLabelText())
      .withContext('Remember-me checkbox text')
      .toContain('Remember me');
    expect(await rememberMeCheckboxHarness.isChecked())
      .withContext('Remember-me checkbox checked state')
      .toBe(false);

    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    expect(await resetPasswordButtonHarness.getText())
      .withContext('Reset-password button text')
      .toContain('Forgot password?');

    const submitButtonHarness = await getSubmitButtonHarness();
    expect(await submitButtonHarness.getType())
      .withContext('Submit button type')
      .toBe('submit');
    expect(await submitButtonHarness.isDisabled()).withContext('Submit button disabled state');
    expect(await submitButtonHarness.getText())
      .withContext('Submit button text')
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
    expect(emailErrorMessages.length).withContext('Email error messages').toBe(1);
    expect(emailErrorMessages[0]).toContain('Email is required');

    await emailInputHarness.setValue('test');

    emailErrorMessages = await emailFieldHarness.getTextErrors();
    expect(emailErrorMessages.length).withContext('Email error messages').toBe(1);
    expect(emailErrorMessages[0]).toContain('Email is invalid');

    const passwordFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid=login-form-password-field]' })
    );
    const passwordInputHarness = await getPasswordInputHarness();

    await passwordInputHarness.setValue('');
    await passwordInputHarness.blur();

    let passwordErrorMessages = await passwordFieldHarness.getTextErrors();
    expect(passwordErrorMessages.length).withContext('Password error messages').toBe(1);
    expect(passwordErrorMessages[0]).toContain('Password is required');

    await passwordInputHarness.setValue('1234');

    passwordErrorMessages = await passwordFieldHarness.getTextErrors();
    expect(passwordErrorMessages.length).withContext('Password error messages').toBe(1);
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
      .withContext('Toggle button aria-label')
      .toBe('Toggle password visibility');
    expect(await button.getAttribute('aria-pressed'))
      .withContext('Toggle button aria-pressed')
      .toBe('false');

    const buttonIconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await buttonIconHarness.getName())
      .withContext('Toggle button default icon')
      .toBe('visibility_off');

    await buttonHarness.click();

    expect(await passwordInputHarness.getType())
      .withContext('Password input type after 1st toggle')
      .toBe('text');
    expect(await button.getAttribute('aria-pressed'))
      .withContext('Toggle button aria-pressed after 1st toggle')
      .toBe('true');
    expect(await buttonIconHarness.getName())
      .withContext('Toggle button icon after 1st toggle')
      .toBe('visibility');

    await buttonHarness.click();

    expect(await passwordInputHarness.getType())
      .withContext('Password input type after 2nd toggle')
      .toBe('password');
    expect(await button.getAttribute('aria-pressed'))
      .withContext('Toggle button aria-pressed after 2nd toggle')
      .toBe('false');
    expect(await buttonIconHarness.getName())
      .withContext('Toggle button icon after 2nd toggle')
      .toBe('visibility_off');
  });

  it('should NOT call AuthApiClient.resetPassword if email is missing', async () => {
    const { getResetPasswordButtonHarness, authApiClientSpy, snackbarSpy } = setup();
    const resetPasswordButtonHarness = await getResetPasswordButtonHarness();
    await resetPasswordButtonHarness.click();

    expect(snackbarSpy.showError).toHaveBeenCalledWith('Please enter your email address');
    expect(authApiClientSpy.resetPassword).not.toHaveBeenCalled();
  });

  it('should call AuthApiClient.resetPassword and display default snackbar on success', async () => {
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
    expect(spinner).withContext('Reset password spinner visibility after click').toBe(true);

    expect(authApiClientSpy.resetPassword).toHaveBeenCalledOnceWith(email);

    resetPassword$.next();
    resetPassword$.complete();

    spinner = await loader.hasHarness(
      MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-reset-password-spinner]' })
    );
    expect(spinner).withContext('Reset password spinner visibility after success').toBe(false);

    expect(snackbarSpy.showDefault).toHaveBeenCalledOnceWith(
      `A password reset link has been sent to ${email}`
    );
  });

  it('should call AuthApiClient.resetPassword and display error snackbar on failure', async () => {
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
    expect(spinner).withContext('Reset password spinner visibility after click').toBe(true);

    expect(authApiClientSpy.resetPassword).toHaveBeenCalledOnceWith(email);

    resetPassword$.error(new Error());

    spinner = await loader.hasHarness(
      MatProgressSpinnerHarness.with({ selector: '[data-testid=loading-reset-password-spinner]' })
    );
    expect(spinner).withContext('Reset password spinner visibility after error').toBe(false);

    expect(snackbarSpy.showError).toHaveBeenCalledOnceWith('Could not send reset email');
  });

  it('should NOT call AuthApiClient.login if form is invalid', async () => {
    const { getSubmitButtonHarness, authApiClientSpy } = setup();
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
      .withContext('Submit button disabled state after click')
      .toBe(true);
    expect(await submitButtonHarness.getText())
      .withContext('Submit button text after click')
      .toContain('Signing In...');

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
      .withContext('Submit button disabled state after error')
      .toBe(false);
    expect(await submitButtonHarness.getText())
      .withContext('Submit button text after error')
      .toContain('Sign In');

    expect(dialogClosedSpy).not.toHaveBeenCalled();
    expect(snackbarSpy.showError).toHaveBeenCalledOnceWith('The email or password is incorrect');
  });
});
