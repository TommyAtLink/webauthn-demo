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
  recoveryToken: string | null | undefined = null;

  constructor(private readonly navCtrl: NavController,
              private readonly messagesService: MessagesService,
              private readonly httpClient: HttpClient) {
  }

  registerNew(username: string): void {
    this.register(username, null, null);
  }

  registerAdd(username: string, registerAddToken: string): void {
    this.register(username, registerAddToken, null);
  }

  recover(username: string, recovery: string): void {
    this.register(username, null, recovery);
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
    if (recovery) {
      body.mode = 'RECOVERY';
      body.sessionId = username;
      body.recoveryToken = recovery;
    } else if (registrationAddToken) {
      body.mode = 'ADD';
      body.sessionId = username;
      body.registrationAddToken = registrationAddToken;
    } else {
      body.mode = 'NEW';
      body.sessionId = username;
    }

    this.httpClient.post<RegistrationStartResponse>('v1/registration/start', body)
      .subscribe(async (response) => {
        await loading.dismiss();
        console.log(response.authChallengeId);
        // if (response !== null) {
          await this.createCredentials(response);
        //
        // } else if (response.status === 'USERNAME_TAKEN') {
        //   this.submitError = 'usernameTaken';
        // } else if (response.status === 'TOKEN_INVALID') {
        //   if (registrationAddToken) {
        //     this.submitError = 'addTokenInvalid';
        //   } else {
        //     this.submitError = 'recoveryTokenInvalid';
        //   }
        // }
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
      authChallengeId: response.authChallengeId,
      credential
    };

    const loading = await this.messagesService.showLoading('Finishing registration ...');
    await loading.present();

    this.httpClient.post<RegistrationFinishResponse>('v1/registration/finish', credentialResponse)
      .subscribe(response => {
        console.log(response);
        if (response !== null) {
          if (response.recoveryToken !== null) {
            this.recoveryToken = response.recoveryToken;
          } else {
            this.recoveryToken = "OK";
          }

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
  mode: 'NEW' | 'ADD' | 'RECOVERY' | undefined;
  sessionId?: string | null;
  registrationAddToken?: string| null;
  recoveryToken?: string| null;
}

interface RegistrationStartResponse {
  authChallengeId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publicKeyCredentialCreationOptions: any;
}

interface RegistrationFinishResponse {
  recoveryToken?: string | null;
}
