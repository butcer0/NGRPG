import { Component, OnInit } from '@angular/core';
import { CharacterOptions } from '../../models/character-options';
import { GameControllerService } from '../../services/game-controller.service';

const DEFAULTSELECTIONTEXT: string = "--Choose--";

@Component({
  selector: 'character-creation-component',
  templateUrl: './character-creation.component.html',
  styleUrls: ['./character-creation.component.css']
})
export class CharacterCreationComponent implements OnInit {
  character = {
    race: DEFAULTSELECTIONTEXT,
    class: DEFAULTSELECTIONTEXT,
    gender: undefined,
    name: undefined
  }

  characterComplete: boolean = false;

  races = CharacterOptions.races;
  classes = CharacterOptions.classes;
  genders = CharacterOptions.genders;

  constructor(private gameControllerService: GameControllerService) {
    
   }

  ngOnInit() {
  }

  changeRace(race: string):void {
    this.character.race = race;
    this.checkCompleted();
  }

  changeGender(gender: string):void {
    this.character.gender = gender;
    this.checkCompleted();
  }

  changeClass(newClass: string):void {
    this.character.class = newClass;
    this.checkCompleted();
  }
  
  checkCompleted(): void {
    this.characterComplete = this.character.race !== DEFAULTSELECTIONTEXT 
                        && this.character.class !== DEFAULTSELECTIONTEXT
                        && this.character.gender
                        && this.character.name;

  }

  changeName():void {
    this.checkCompleted();
  }

  createCharacter():void {
    if(!this.characterComplete)
    {
      return;
    }

    this.gameControllerService.setMainCharacter(this.character)
  }

}
