import { Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

import { AuthApiClient } from '../auth-api-client';
import { Snackbar } from '../../snackbar';

import { RegisterForm } from './register-form';

describe(RegisterForm.name, () => {
  const setup = () => {
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
    const fixture = TestBed.createComponent(RegisterForm);
    const component = fixture.componentInstance;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const dialogClosedSpy = spyOn(component.dialogClosed, 'emit');

    const getNameInputHarness = () =>
      loader.getHarness(
        MatInputHarness.with({ selector: '[data-testid=register-form-name-input]' })
      );
    const getEmailInputHarness = () =>
      loader.getHarness(
        MatInputHarness.with({ selector: '[data-testid=register-form-email-input]' })
      );
    const getPasswordInputHarness = () =>
      loader.getHarness(
        MatInputHarness.with({ selector: '[data-testid=register-form-password-input]' })
      );
    const getSubmitButtonHarness = () =>
      loader.getHarness(
        MatButtonHarness.with({
          selector: '[data-testid=register-form-submit-button]',
          appearance: 'filled'
        })
      );

    return {
      fixture,
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

  it('should display a form with 3 fields and a submit button', async () => {
    const {
      getNameInputHarness,
      getEmailInputHarness,
      getPasswordInputHarness,
      getSubmitButtonHarness
    } = setup();

    const nameInputHarness = await getNameInputHarness();
    expect(await nameInputHarness.getType())
      .withContext('The type of the name input is incorrect')
      .toBe('text');
    expect(await nameInputHarness.getPlaceholder())
      .withContext('The placeholder of the name input is incorrect')
      .toContain('Enter your name');

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

    const submitButtonHarness = await getSubmitButtonHarness();
    expect(await submitButtonHarness.getType())
      .withContext('The type of the submit button is incorrect')
      .toBe('submit');
    expect(await submitButtonHarness.isDisabled()).withContext(
      'The submit button should NOT be disabled when the status is NOT submitting'
    );
    expect(await submitButtonHarness.getText())
      .withContext('The submit button should have a text')
      .toContain('Sign Up');
  });

  it('should display validation error messages if fields are invalid', async () => {
    const { loader, getNameInputHarness, getEmailInputHarness, getPasswordInputHarness } = setup();

    const nameFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid=register-form-name-field]' })
    );
    const nameInputHarness = await getNameInputHarness();

    await nameInputHarness.setValue('');
    await nameInputHarness.blur();

    const nameErrorMessages = await nameFieldHarness.getTextErrors();
    expect(nameErrorMessages.length)
      .withContext('You should have an error message if the name field is required')
      .toBe(1);
    expect(nameErrorMessages[0]).toContain('Name is required');

    const emailFieldHarness = await loader.getHarness(
      MatFormFieldHarness.with({ selector: '[data-testid=register-form-email-field]' })
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
      MatFormFieldHarness.with({ selector: '[data-testid=register-form-password-field]' })
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

  it('should NOT call the `AuthApiClient` service if the form is invalid', async () => {
    const { getSubmitButtonHarness, authApiClientSpy } = setup();
    const submitButtonHarness = await getSubmitButtonHarness();

    await submitButtonHarness.click();

    expect(authApiClientSpy.register).not.toHaveBeenCalled();
  });

  it('should call the `AuthApiClient` service and close the dialog on success', async () => {
    const {
      getNameInputHarness,
      getEmailInputHarness,
      getPasswordInputHarness,
      getSubmitButtonHarness,
      mockCredentials,
      register$,
      dialogClosedSpy,
      authApiClientSpy
    } = setup();

    const nameInputHarness = await getNameInputHarness();
    await nameInputHarness.setValue(mockCredentials.name);

    const emailInputHarness = await getEmailInputHarness();
    await emailInputHarness.setValue(mockCredentials.email);

    const passwordInputHarness = await getPasswordInputHarness();
    await passwordInputHarness.setValue(mockCredentials.password);

    const submitButtonHarness = await getSubmitButtonHarness();
    await submitButtonHarness.click();

    expect(await submitButtonHarness.isDisabled())
      .withContext('The submit button should be disabled when the status is submitting')
      .toBe(true);
    expect(await submitButtonHarness.getText())
      .withContext('The submit button should have a different text when the status is submitting')
      .toContain('Signing Up...');

    expect(authApiClientSpy.register).toHaveBeenCalledOnceWith(mockCredentials);

    register$.next();

    expect(dialogClosedSpy).toHaveBeenCalled();
  });

  it('should call the `AuthApiClient` service and display an error snackbar on failure', async () => {
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
    } = setup();

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

    expect(await submitButtonHarness.isDisabled())
      .withContext('The submit button should NOT be disabled when the status is NOT submitting')
      .toBe(false);
    expect(await submitButtonHarness.getText())
      .withContext('The submit button should have a default text when the status is NOT submitting')
      .toContain('Sign Up');

    expect(dialogClosedSpy).not.toHaveBeenCalled();
    expect(snackbarSpy.showError).toHaveBeenCalledOnceWith('Try again with another email');
  });
});
