import { Component, OnInit } from '@angular/core';
import { DataService } from '../DataService.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string = "";
  clickOnButton: boolean = false;
  constructor(private data: DataService) { }
  saveUserName() {
    if (this.userName != undefined) {
      console.log(this.userName)

      this.clickOnButton = true;
      console.log(this.clickOnButton)
      this.sendUserName();
    }

  }
  ngOnInit(): void {
  }

  sendUserName() {
    this.data.changeMessage(this.userName.toUpperCase());

  }
}
