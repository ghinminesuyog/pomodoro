import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Observable, timer, Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('buttonState', [
      state('false', style({
        background: 'rgba(255,255,255,0.4)',
      })),
      state('true', style({
      })),
      transition('false => true', animate('700ms ease-in')),
      transition('true => false', animate('700ms ease-out'))
    ])
  ]
})
export class AppComponent implements OnInit {

  isRunning: boolean = false;
  isPaused: boolean = true;
  toggleState() {
    this.isRunning = this.isRunning === true ? false : true;
    this.isPaused = this.isPaused === true ? false : true;
  }
  mode = 'Pomodoro';
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  // TOTAL_SECONDS = 25 * 60;

  constructor(
    private titleService: Title
  ) {
    this.titleService.setTitle(this.mode);
  }

  ngOnInit() {
    this.message = timerMessages.start;
    this.displayTime();
  }

  moveTo(section) {

    const element = document.getElementById(section);
    const elementPosition = element.offsetTop;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth"
    })
  }

  changeMode(toMode: string) {
    this.mode = toMode;
    this.titleService.setTitle(this.mode);

    this.stopTimer();

    this.favIcon.href = '/assets/' + this.mode + '.svg'

    this.getTotalSeconds();
    this.displayTime();
  }


  message: string = '';
  strMinutes: string = '';
  strSeconds: string = '';
  totalSeconds: number = 25 * 60;
  timerId = null;
  status = Status.STOP;


  countdown() {
    this.timerId = setInterval(
      function () {
        if (this.totalSeconds <= 0) {
          clearInterval(this.timerId);
          this.setStatus(Status.STOP);
          this.displayTime();
        }
        this.displayTime();
        this.totalSeconds -= 1;
        this.updateProgBar(this.totalSeconds);
      }.bind(this), 1000);
  }

  updateProgBar(currValue) {
    console.log('Curr val: ', currValue)
    const progBar = document.getElementById('prog-bar');

    var totalValue = 0;
    if (this.mode == 'Pomodoro') {
      totalValue = 25 * 60;
    }
    else if (this.mode == "Short Break") {
      totalValue = 5 * 60;
    }
    else if (this.mode == "Long Break") {
      totalValue = 15 * 60;
    }

    const percent = currValue / totalValue * 100;
    console.log('Percent value is: ', percent)
    progBar.style.width = percent.toString() + '%'
  }


  displayTime() {
    const seconds = this.totalSeconds % 60;
    const minutes = Math.floor((this.totalSeconds - seconds) / 60);

    this.strMinutes = (minutes < 10) ? `0${minutes}` : `${minutes}`;
    this.strSeconds = (seconds < 10) ? `0${seconds}` : `${seconds}`;;
  }

  startTimer() {
    if (this.status == Status.RUNNING) { }
    else {
      console.log('In start timer')
      this.toggleState();
      this.setStatus(Status.RUNNING);
      this.countdown();
    }
  }

  pauseTimer() {
    if (this.status == Status.PAUSE || this.status == Status.STOP) { }
    else {
      console.log('In pause timer')
      this.toggleState();
      clearInterval(this.timerId);
      this.setStatus(Status.PAUSE);
    }

  }

  getTotalSeconds(): number {

    if (this.mode == 'Pomodoro') {
      this.totalSeconds = 25 * 60;

    }
    else if (this.mode == "Short Break") {
      this.totalSeconds = 5 * 60;
    }
    else if (this.mode == "Long Break") {
      this.totalSeconds = 15 * 60;
    }
    return this.totalSeconds
  }

  stopTimer() {
    if (this.status == Status.STOP) { }
    else {
      this.totalSeconds = this.getTotalSeconds()
      console.log('In stop timer');
      this.toggleState();
      clearInterval(this.timerId);
      this.setStatus(Status.STOP);
      this.displayTime();
      this.updateProgBar(this.getTotalSeconds())
    }

  }

  setStatus(newStatus: Status) {
    this.status = newStatus;
    switch (newStatus) {
      case Status.STOP:
        this.message = timerMessages.start;
        // this.totalSeconds = this.totalSeconds;
        break;
      case Status.RUNNING:
        this.message = timerMessages.running;
        break;
      case Status.PAUSE:
        this.message = timerMessages.stop;
        break;
      default:
        break;
    }
  }

}

const timerMessages = {
  start: 'Let the countdown begin!!',
  running: 'Greatness is within sight!!',
  stop: 'Never quit keep going!!'
}

enum Status {
  STOP = 'STOP',
  PAUSE = 'PAUSE',
  RUNNING = 'RUNNING'
};

