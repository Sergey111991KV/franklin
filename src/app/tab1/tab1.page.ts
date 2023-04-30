import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Directory, FileInfo, Filesystem} from '@capacitor/filesystem';
import {VoiceRecorder} from "capacitor-voice-recorder";
import {GestureController} from "@ionic/angular";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {OpenAiService} from "../services/open-ai.service";
import {MurfService} from "../services/murf.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit{

  recording = false;
  storedFileNames: FileInfo[] = [];
  durationDisplay = '';
  duration = 0;

  @ViewChild('recordbtn', {read: ElementRef}) recordbtn: ElementRef;

  constructor(
    private gestureCtrl: GestureController,
    private openAiService: OpenAiService,
    private murfService: MurfService,
  ) {
    // this.murfService.login()
    this.murfService.voices()

  }

  ngAfterViewInit(): void {
        const longpress = this.gestureCtrl.create({
          el: this.recordbtn.nativeElement,
          threshold: 0,
          gestureName: 'long-mic-press',
          onStart: (ev) => {
            Haptics.impact({style: ImpactStyle.Light});
            this.startRecording();
            this.calculateDuration();
          },
          onEnd: (ev) => {
            Haptics.impact({style: ImpactStyle.Light});
            this.stopRecording();
          }
        }, true);
    longpress.enable()
    }

  ngOnInit() {
    this.loadFiles()

    VoiceRecorder.requestAudioRecordingPermission();
  }

  async loadFiles() {

    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then((result) => {
      console.log(result)
      this.storedFileNames = result.files
    })
  }

  startRecording() {
    if (this.recording){
      return
    }
    this.recording = true;
    VoiceRecorder.startRecording()
  }

  stopRecording() {
    if (!this.recording){
      return
    }
    this.recording = false;
    VoiceRecorder.stopRecording().then( async (result) => {
      if (result.value && result.value.recordDataBase64) {

        const recordData = result.value.recordDataBase64;

        console.log(recordData)
        const fileName = new Date().getTime() + '.wav'
        console.log(fileName);
        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: recordData
        })
        this.loadFiles();
      }
    })
  }

  async playFile(file: FileInfo) {
      const audioFile = await Filesystem.readFile({
        path: file.name,
        directory: Directory.Data
      })
      console.log('audioFile', audioFile)
      this.openAiService.sendAudio('sendAudio')
      const base64Sound = audioFile.data
      //   TODO UPLOAD

      const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
    audioRef.oncanplaythrough = () => audioRef.play()
    audioRef.load()
  }

  calculateDuration(){
    if (!this.recording) {
      this.duration = 0;
      this.durationDisplay = '';
      return
    }
    this.duration += 1;
    const minutes = Math.floor(this.duration / 60);
    const seconds = (this.duration % 60).toString().padStart(2, '0')
    this.durationDisplay = `${minutes}:${seconds}`

    setTimeout(() => {
      this.calculateDuration()
    }, 1000)
  }

  async deleteFile(file: FileInfo) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.name
    })
    this.loadFiles();
  }

}
