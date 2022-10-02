import {Component} from '@angular/core';
import {NavController} from '@ionic/angular';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MessagesService} from '../messages.service';
import {create} from '@github/webauthn-json';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage {
  view = 'new';

  submitError: string | null = null;
  recoveryToken: string | null = null;

  constructor(private readonly navCtrl: NavController,
              private readonly messagesService: MessagesService,
              private readonly httpClient: HttpClient) {
  }

  registerNew(username: string): void {
    this.register(username, null, null);
  }

  registerAdd(registerAddToken: string): void {
    this.register(null, registerAddToken, null);
  }

  recover(recovery: string): void {
    this.register(null, null, recovery);
  }

  selectSegment($event: Event): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.view = ($event.target as any).value;
  }

  private async register(username: string | null,
                         registrationAddToken: string | null,
                         recovery: string | null): Promise<void> {
    const loading = await this.messagesService.showLoading('Starting registration ...');
    await loading.present();


    let body = new RegistrationStartRequest
    if (username) {
      body.status = 'NEW';
      body.sessionId = username;
    } else if (registrationAddToken) {
      body.status = 'ADD';
      body.registrationAddToken = registrationAddToken;
    } else if (recovery) {
      body.status = 'RECOVERY';
      body.recoveryToken = recovery;
    }

    this.httpClient.post<RegistrationStartResponse>('registration/start', body)
      .subscribe(async (response) => {
        await loading.dismiss();
        if (response.status === 'OK') {
          await this.createCredentials(response);
        } else if (response.status === 'USERNAME_TAKEN') {
          this.submitError = 'usernameTaken';
        } else if (response.status === 'TOKEN_INVALID') {
          if (registrationAddToken) {
            this.submitError = 'addTokenInvalid';
          } else {
            this.submitError = 'recoveryTokenInvalid';
          }
        }
      }, () => {
        loading.dismiss();
        this.messagesService.showErrorToast('Registration failed');
      }, () => loading.dismiss());
  }

  private async createCredentials(response: RegistrationStartResponse): Promise<void> {
    const credential = await create({
      publicKey: response.publicKeyCredentialCreationOptions
    });

    try {
      // @ts-ignore
      credential.clientExtensionResults = credential.getClientExtensionResults();
    } catch (e) {
      // @ts-ignore
      credential.clientExtensionResults = {};
    }

    const credentialResponse = {
      sessionId: response.sessionId,
      credential
    };

    const loading = await this.messagesService.showLoading('Finishing registration ...');
    await loading.present();

    this.httpClient.post<RegistrationFinishResponse>('registration/finish', credentialResponse)
      .subscribe(response => {
        if (response.status === 'OK') {
          // @ts-ignore
          this.recoveryToken = response.recoveryToken;
        } else {
          this.messagesService.showErrorToast('Registration failed');
        }
      }, () => {
        loading.dismiss();
        this.messagesService.showErrorToast('Registration failed');
      }, () => loading.dismiss());
  }
}
class RegistrationStartRequest {
  status: 'NEW' | 'ADD' | 'RECOVERY' | undefined;
  sessionId?: string| null;
  registrationAddToken?: string| null;
  recoveryToken?: string| null;
}
interface RegistrationStartResponse {
  status: 'OK' | 'USERNAME_TAKEN' | 'TOKEN_INVALID';
  sessionId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publicKeyCredentialCreationOptions: any;
}

interface RegistrationFinishResponse {
  status: 'OK' | 'REGISTER_FAILED';
  recoveryToken?: string | null;
}
