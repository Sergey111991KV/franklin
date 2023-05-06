import { Router } from '@angular/router';

export class AuthenticationService extends IonicAuth {
  constructor(private router: Router) {
    super(Capacitor.isNativePlatform() ? nativeAuthOptions : webAuthOptions);
  }

  async onLoginSuccess() {
    await this.router.navigate(['/']);
  }
}
