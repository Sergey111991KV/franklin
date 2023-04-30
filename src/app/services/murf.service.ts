import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MurfService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  login() {
    console.log('login')
    let headers = new HttpHeaders();

    // --url "https://api.murf.ai/v1/auth/token"
    return this.http
      .get('https://api.murf.ai/v1/auth/token', { headers: headers})
        .subscribe((response) => console.log(response))

  }

  voices() {
    let headers = new HttpHeaders();

    // --url "https://api.murf.ai/v1/auth/token"
    return this.http
      .get('https://api.murf.ai/v1/speech/voices', { headers: headers})
      .subscribe((response) => console.log(response))

  }

}
