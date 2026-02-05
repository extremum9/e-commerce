import { TestBed } from '@angular/core/testing';
import { Component, output, provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabGroupHarness, MatTabHarness } from '@angular/material/tabs/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { AuthApiClient } from '../auth-api-client';
import { LoginForm } from '../login-form/login-form';
import { RegisterForm } from '../register-form/register-form';
import { provideDisabledAnimations } from '../../testing-utils';

import { AuthDialog } from './auth-dialog';

@Component({
  selector: 'app-login-form',
  template: ''
})
class LoginFormStub {
  dialogClosed = output();
}

@Component({
  selector: 'app-register-form',
  template: ''
})
class RegisterFormStub {
  dialogClosed = output();
}

describe(AuthDialog.name, () => {
  const setup = async () => {
    const authApiClientSpy = jasmine.createSpyObj<AuthApiClient>('AuthApiClient', [
      'loginWithGoogle'
    ]);
    authApiClientSpy.loginWithGoogle.and.returnValue(of(undefined));

    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<AuthDialog>>('MatDialogRef', ['close']);

    TestBed.overrideComponent(AuthDialog, {
      remove: { imports: [LoginForm, RegisterForm] },
      add: {
        imports: [LoginFormStub, RegisterFormStub]
      }
    });
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
          provide: MatDialogRef,
          useValue: dialogRefSpy
        }
      ]
    });
    const fixture = TestBed.createComponent(AuthDialog);
    const debugElement = fixture.debugElement;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    await fixture.whenStable();

    const selectSignInTab = async () => {
      const tabGroupHarness = await loader.getHarness(MatTabGroupHarness);
      await tabGroupHarness.selectTab({ label: 'Sign In' });
    };
    const selectSignUpTab = async () => {
      const tabGroupHarness = await loader.getHarness(MatTabGroupHarness);
      await tabGroupHarness.selectTab({ label: 'Sign Up' });
    };

    const getLoginFormDebugElement = () => debugElement.query(By.directive(LoginFormStub));
    const getRegisterFormDebugElement = () => debugElement.query(By.directive(RegisterFormStub));

    return {
      fixture,
      loader,
      authApiClientSpy,
      dialogRefSpy,
      selectSignInTab,
      selectSignUpTab,
      getLoginFormDebugElement,
      getRegisterFormDebugElement
    };
  };

  it('should display two tabs', async () => {
    const { loader, selectSignUpTab, getLoginFormDebugElement, getRegisterFormDebugElement } =
      await setup();
    const tabHarnesses = await loader.getAllHarnesses(MatTabHarness);

    expect(tabHarnesses.length).toBe(2);
    expect(getLoginFormDebugElement()).toBeTruthy();
    expect(getRegisterFormDebugElement()).toBeFalsy();
    await selectSignUpTab();
    expect(getLoginFormDebugElement()).toBeFalsy();
    expect(getRegisterFormDebugElement()).toBeTruthy();
  });

  it('should close dialog on login success', async () => {
    const { dialogRefSpy, getLoginFormDebugElement } = await setup();
    const loginFormComponent: LoginFormStub = getLoginFormDebugElement().componentInstance;
    loginFormComponent.dialogClosed.emit();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });

  it('should close dialog on registration success', async () => {
    const { selectSignUpTab, dialogRefSpy, getRegisterFormDebugElement } = await setup();
    await selectSignUpTab();

    const registerFormComponent: LoginFormStub = getRegisterFormDebugElement().componentInstance;
    registerFormComponent.dialogClosed.emit();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });

  it('should log in with google and close dialog on success', async () => {
    const { loader, authApiClientSpy, dialogRefSpy } = await setup();

    const buttonHarness = await loader.getHarness(
      MatButtonHarness.with({
        selector: '[data-testid=login-with-google-button]',
        appearance: 'outlined'
      })
    );
    expect(await buttonHarness.getText()).toContain('Continue with Google');

    const buttonIconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await buttonIconHarness.getName()).toBe('google');

    await buttonHarness.click();

    expect(authApiClientSpy.loginWithGoogle).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });
});
