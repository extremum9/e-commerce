import { TestBed } from '@angular/core/testing';
import {
  Component,
  DebugElement,
  getDebugNode,
  inject,
  output,
  provideZonelessChangeDetection
} from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatTabGroupHarness, MatTabHarness } from '@angular/material/tabs/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';

import { AuthApiClient } from '../auth-api-client';
import { LoginForm } from '../login-form/login-form';
import { RegisterForm } from '../register-form/register-form';

import AuthDialog from './auth-dialog';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  template: `<button data-testid="open-dialog-button" (click)="open()">Open dialog</button>`
})
class AuthDialogTestHost {
  public dialog = inject(MatDialog);

  public open() {
    this.dialog.open(AuthDialog);
  }
}

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'app-login-form',
  template: ''
})
class LoginFormStub {
  public dialogClosed = output();
}

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'app-register-form',
  template: ''
})
class RegisterFormStub {
  public dialogClosed = output();
}

describe(AuthDialog.name, () => {
  const setup = () => {
    const authApiClientSpy = jasmine.createSpyObj<AuthApiClient>('AuthApiClient', [
      'loginWithGoogle'
    ]);
    authApiClientSpy.loginWithGoogle.and.returnValue(of(undefined));

    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<AuthDialog>>('MatDialogRef', ['close']);

    TestBed.overrideComponent(AuthDialog, {
      remove: { imports: [LoginForm, RegisterForm] },
      add: {
        imports: [LoginFormStub, RegisterFormStub],
        providers: [
          {
            provide: MatDialogRef,
            useValue: dialogRefSpy
          }
        ]
      }
    });
    TestBed.configureTestingModule({
      imports: [MatDialogModule, MatIconTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MATERIAL_ANIMATIONS,
          useValue: { animationsDisabled: true }
        },
        {
          provide: AuthApiClient,
          useValue: authApiClientSpy
        }
      ]
    });
    const fixture = TestBed.createComponent(AuthDialogTestHost);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.detectChanges();

    const overlayContainer = TestBed.inject(OverlayContainer);
    const overlayContainerDebugElement = getDebugNode(
      overlayContainer.getContainerElement()
    ) as DebugElement;

    fixture.debugElement
      .query(By.css('[data-testid=open-dialog-button]'))
      .triggerEventHandler('click');

    const selectSignInTab = async () => {
      const tabGroupHarness = await rootLoader.getHarness(MatTabGroupHarness);
      await tabGroupHarness.selectTab({ label: 'Sign In' });
    };
    const selectSignUpTab = async () => {
      const tabGroupHarness = await rootLoader.getHarness(MatTabGroupHarness);
      await tabGroupHarness.selectTab({ label: 'Sign Up' });
    };

    const getLoginFormStub = () => overlayContainerDebugElement.query(By.directive(LoginFormStub));
    const getRegisterFormStub = () =>
      overlayContainerDebugElement.query(By.directive(RegisterFormStub));

    return {
      fixture,
      rootLoader,
      authApiClientSpy,
      dialogRefSpy,
      selectSignInTab,
      selectSignUpTab,
      getLoginFormStub,
      getRegisterFormStub
    };
  };

  it('should display tabs', async () => {
    const { rootLoader, selectSignInTab, selectSignUpTab, getLoginFormStub, getRegisterFormStub } =
      setup();

    const tabs = await rootLoader.getAllHarnesses(MatTabHarness);
    expect(tabs.length)
      .withContext('You should have 2 tabs: one for a login form, and one for a register form')
      .toBe(2);

    await selectSignInTab();

    expect(getLoginFormStub())
      .withContext('You should display a login form when selecting the first tab')
      .toBeTruthy();

    await selectSignUpTab();

    expect(getRegisterFormStub())
      .withContext('You should display a register form when selecting the second tab')
      .toBeTruthy();
  });

  it('should close the dialog on login success', async () => {
    const { selectSignInTab, dialogRefSpy, getLoginFormStub } = setup();
    await selectSignInTab();

    const loginFormStubComponent: LoginFormStub = getLoginFormStub().componentInstance;
    loginFormStubComponent.dialogClosed.emit();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });

  it('should close the dialog on registration success', async () => {
    const { selectSignUpTab, dialogRefSpy, getRegisterFormStub } = setup();
    await selectSignUpTab();

    const registerFormStubComponent: LoginFormStub = getRegisterFormStub().componentInstance;
    registerFormStubComponent.dialogClosed.emit();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });

  it('should log in with google and close the dialog on success', async () => {
    const { rootLoader, authApiClientSpy, dialogRefSpy } = setup();

    const buttonHarness = await rootLoader.getHarness(
      MatButtonHarness.with({
        selector: '[data-testid=login-with-google-button]',
        appearance: 'outlined'
      })
    );
    expect(await buttonHarness.getText())
      .withContext('The login-with-google button should have a text')
      .toContain('Continue with Google');

    const buttonIconHarness = await buttonHarness.getHarness(MatIconHarness);
    expect(await buttonIconHarness.getName())
      .withContext('The button should have an icon')
      .toBe('google');

    await buttonHarness.click();

    expect(authApiClientSpy.loginWithGoogle).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });
});
