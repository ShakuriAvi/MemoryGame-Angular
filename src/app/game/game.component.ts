import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  sequenceMovementSystemArray: Array<number> = [];
  sequenceMovementUserArray: Array<number> = [];
  lstCirclesItems: Array<any> = []; // TODO add interface
  availableFreeBubbles: Array<number> = [];
  score: number = 0;
  //scoreHistory: any;
  history: Array<number> = [];
  //history: any = {};
  userName: String = ""
  movementSystemSteps: number = 0;
  movementUserStepNumber: number = 0;
  isUserTurn: boolean = false;
  isGameOver: boolean = false;
  lastTopFromLocalStorage: any;
  toArray(answers: any) {
    return answers.keys();
  }
  constructor(private data: DataService) {
    this.data.currentMessage.subscribe(message => this.userName = message)
  }

  ngOnInit(): void {
    this.sequenceMovementSystemArray = [];
    this.sequenceMovementUserArray = [];
    this.availableFreeBubbles = [0, 1, 2, 3, 4, 5];
    this.score = 0;
    //  this.scoreHistory = new Map();
    //localStorage.clear();
    this.initTopTable();
    this.isGameOver = false;
    this.lstCirclesItems = [];
    this.movementSystemSteps = 0;
    this.movementUserStepNumber = 0;
    this.isUserTurn = false;
    this.initNewGame();
  }
  initTopTable(): void {
    this.lastTopFromLocalStorage = (JSON.parse(localStorage.getItem("history") || "[]"));
    if (this.lastTopFromLocalStorage.length > 0)
      this.history = this.lastTopFromLocalStorage

  }
  initNewGame(): void {
    const item = {
      isSelected: false,
    };
    for (let i = 0; i < 6; i++) {
      const newItem = Object.create(item);
      this.lstCirclesItems.push(newItem);
    }
  }

  // getScoreItem(score: number): any {
  //   const scoreitem = {
  //     date: new Date(),
  //     name: 'ortal',
  //   };
  //   return Object.create(scoreitem);
  // }

  getRandomInt(max: any): number {
    return Math.floor(Math.random() * max);
  }
  selectRandomCircleIndex(): number {
    const numRange = 5;
    const selectedIndex = this.getRandomInt(numRange);
    return selectedIndex;
  }
  setScoreHistory(): void {
    // const scoreItem = this.getScoreItem(this.score);
    // let scoreRecord = this.scoreHistory.get(this.score);
    // if (!scoreRecord) {
    //  this.scoreHistory.set(this.score, []);
    //    scoreRecord = this.scoreHistory.get(this.score);
    // }
    //scoreRecord.push(scoreItem);
    // this.scoreHistory.set(this.score, new Date);
    // this.scoreHistory = new Map([...this.scoreHistory.entries()].sort(function (a, b) { return (+b) - (+a); }));


    // this.history[this.score] = new Date();
    // this.history = Object.keys(this.history).sort(function (a, b) { return (+b) - (+a); }).reduce((t, k) => {
    //   t.set(k, this.history[k]);
    //   return t;
    // }, new Map());
    //localStorage.clear();
    localStorage.clear();

    if (this.lastTopFromLocalStorage.length > 0) {
      this.history.push(this.score)
      this.history = this.history.sort((a, b) => b - a)
    } else {
      this.history.push(this.score)
    }
    localStorage.setItem("history", JSON.stringify(this.history))
  }
  selectCircle(index: any): void {
    if (!this.isUserTurn && !this.isGameOver) {
      return;
    }
    this.resetLights();
    this.lstCirclesItems[index].isSelected = true;
    this.sequenceMovementUserArray.push(index);
    const isUserCorrect = this.checkIfUserCorrect();
    if (!isUserCorrect) {
      this.isGameOver = true;
      this.setScoreHistory();
      alert('game over');
      this.resetGame();
    } else {
      this.movementUserStepNumber += 1;
      if (this.movementUserStepNumber >= this.sequenceMovementSystemArray.length) {
        this.isUserTurn = false;
        this.score += 10;
        this.sequenceMovementUserArray = [];
        this.movementUserStepNumber = 0;
        setTimeout(() => {
          this.resetLights();
          alert('system turn');
          setTimeout(() => {
            this.startSystemMove();
          }, 1000);
        }, 1000);

      }
    }
  }

  resetGame(): void {
    this.movementUserStepNumber = 0;
    this.movementSystemSteps = 0;
    this.sequenceMovementSystemArray = [];
    this.sequenceMovementUserArray = [];
    this.isUserTurn = false;
    this.score = 0;
    this.resetLights();
  }
  checkIfUserCorrect(): boolean {
    if (this.sequenceMovementSystemArray[this.movementUserStepNumber] === this.sequenceMovementUserArray[this.movementUserStepNumber]) {
      return true;
    }
    return false;
  }
  resetLights(): void {
    this.lstCirclesItems.forEach((item) => {
      item.isSelected = false;
    });
  }
  illuminatedCircle(index: any): void {
    this.resetLights();
    this.lstCirclesItems[index].isSelected = true;
    setTimeout(() => {
      this.resetLights();
      this.movementSystemSteps += 1;
      if (this.movementSystemSteps === this.sequenceMovementSystemArray.length) {
        this.movementSystemSteps = 0;
        this.isUserTurn = true;
        alert('Your turn');
      }
    }, 1000);
  }

  startGame(): void {
    this.isGameOver = false;
    this.startSystemMove();
  }
  startSystemMove(): void {
    const selectedIndex = this.selectRandomCircleIndex();
    this.sequenceMovementSystemArray.push(selectedIndex);

    for (let i = 0; i < this.sequenceMovementSystemArray.length; i++) {
      setTimeout(() => {
        this.illuminatedCircle(this.sequenceMovementSystemArray[i]);
      }, i * 2000);
    }
  }
}