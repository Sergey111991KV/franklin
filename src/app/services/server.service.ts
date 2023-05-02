import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  checkAlive() {
    return this.http
      .get('http://localhost:8080',)
      .subscribe((response) => console.log(response))
  }

  sendAudio(audio: string) {
    let headers = new HttpHeaders();

    return this.http
      .post('http://localhost:8080/speach', audio, { headers: headers})
      .subscribe((response) => console.log(response))

  }

}
