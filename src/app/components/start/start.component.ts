import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'start-component',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  gameTitle = "Awesomeness!";

  constructor() { }

  ngOnInit() {
  }

}
