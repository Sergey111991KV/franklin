import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import {environment} from "../../environments/environment";
import {filter, from, map} from "rxjs";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  constructor() { }

  readonly configuration = new Configuration({
    apiKey: environment.openAIToken
  });

  readonly openai = new OpenAIApi(this.configuration);


  getDataFromOpenAI(text: string) {
    from(this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 256
    })).pipe(
      filter(resp => !!resp && !!resp.data),
      map(resp => resp.data),
      filter((data: any) => data.choices && data.choices.length > 0 && data.choices[0].text),
      map(data => data.choices[0].text)
    ).subscribe(data => {
      console.log(data);
    });
  }

  async sendAudio(audio: any) {
    let binary= this.convertDataURIToBinary(audio);
    let blob=new Blob([binary], {type : 'audio/ogg'});
    let blobUrl = URL.createObjectURL(blob);
    //this.audioTag.nativeElement.setAttribute('src',this.audioSource);
    console.log(blob);
    // "https://api.openai.com/v1/audio/transcriptions?model=whisper-1"

    this.getDataFromOpenAI('test')
    // const response = await fetch( "https://api.openai.com/v1/completions", {
    //   method: "POST",
    //   headers: {
     //     "Model": 'whisper-1',
    //     "ContentType": "application/json",
    //     // 'Content-Type: multipart/form-data',
    // // --form file=@/path/to/file/german.mp3   --form model=whisper-1
    //   },
    //   body: JSON.stringify(
    //     {
    //       // audio: blob,
    //       prompt: "Say this is a test",
    //       model: 'text-davinci-003',
    //       // model: 'whisper-1'
    //     }),
    // });
    //
    // const data = await response.json();
    // console.log(data)
  }

  convertDataURIToBinary(dataURI:any) {
    let BASE64_MARKER = ';base64,';
    let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    let base64 = dataURI.substring(base64Index);
    let raw = window.atob(base64);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));

    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }



//    createFormDataFromBase64(base64String: any, fieldName: any, fileName: any) {
//     const byteString = atob(base64String.split(',')[1]);
//     const mimeType = dataUri.split(';')[0].split(':')[1];
//
//     const arrayBuffer = new ArrayBuffer(byteString.length);
//     const intArray = new Uint8Array(arrayBuffer);
//
//     for (let i = 0; i < byteString.length; i += 1) {
//       intArray[i] = byteString.charCodeAt(i);
//     }
//
//     const blob = new Blob([intArray], { type: mimeType });
//
//     const formData = new FormData();
//     formData.append(fieldName, blob, fileName);
//
//     return formData;
//   }
//
//   axios({
//           method: 'post',
//           url: 'https://api.openai.com/v1/audio/transcriptions',
//           data: createFormDataFromBase64(base64Str, 'file', 'audio.webm'),
//   headers: {
//     'Content-Type': 'multipart/form-data',
//     'Authorization': 'Bearer {OPEN_AI_API_KEY}'
//   },
// })
// .then(function (response) {
//   //handle success
//   console.log(response);
// })
//   .catch(function (response) {
//     //handle error
//     console.log(response);
//   });

}
