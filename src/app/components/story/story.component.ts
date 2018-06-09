import { Component, OnInit } from '@angular/core';
import { GameControllerService } from '../../services/game-controller.service';
import { CharacterAction, SuccessOptions, FailureOptions } from '../../models/chapter';
import { Hero, Monster } from '../../models/characters';
import { Router } from '@angular/router';

@Component({
  selector: 'story-component',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  constructor(private gameControllerService: GameControllerService,
              private router: Router) { }

  currentChapter = this.gameControllerService.currentChapter;
  heroParty: Hero[] = this.gameControllerService.heroParty;
  enemyParty: Monster[] = this.currentChapter.enemyParty;

  actionDelay: number = this.gameControllerService.actionDelay;
  displayMessage: string = "";
  successMessages: string[] = [];
  showNextChapterButton: boolean = false;

  ngOnInit() {
  }

  chooseAction(action: string): void {
    if(this.successMessages.length) {
      return;
    }

    this.displayMessage = `You decide to ${action}.`;
    setTimeout(() => {
      switch(action) {
        case CharacterAction.attack:
          this.tryAttack();
          break;
        case CharacterAction.sneak:
          this.trySneak();
          break;
        case CharacterAction.persuade:
          this.tryPersuade();
          break;
        case CharacterAction.doNothing:
          this.doNothing();
          break;
        default:
          console.log("Something went horribly wrong");
      }
    }, this.actionDelay);
  }

  tryAttack(): void {
    this.gameControllerService.isFighting = true;
    this.router.navigateByUrl("/fight");
  }

  trySneak(): void {
    let sneakBarrier = 0;
    let sneakPower = 0;
    this.enemyParty.forEach(enemy => {
      sneakBarrier += enemy.barriers.sneak;
    });
    this.heroParty.forEach(hero => {
      sneakPower += hero.sneak();
    });
    if(sneakPower >= sneakBarrier) {
      this.displayMessage = `Your attempt at sneaking was a success!`;
      setTimeout(() => {
        this.onSuccess();
      }, this.actionDelay);
    } else {
      this.displayMessage = `Your attempt at sneaking was a failure!`;
      setTimeout(() => {
        this.onSneakPersuadeFailure();
      }, this.actionDelay);
    }
  }

  tryPersuade(): void {
    let persuasionBarrier = 0;
    let persuasionPower = 0;
    this.enemyParty.forEach(enemy => {
      persuasionBarrier += enemy.barriers.persuade;
    });
    this.heroParty.forEach(hero => {
      persuasionPower += hero.persuade();
    });
    // console.log(`Enemy persuasion: ${persuasionBarrier}, Hero persuasion: ${persuasionPower}`);
    if(persuasionPower >= persuasionBarrier) {
      this.displayMessage = `Your attempt at persuasion was a success`;
      setTimeout(() => {
        this.onSuccess();
      }, this.actionDelay);
    } else {
      this.displayMessage = `Your attempt at persuasion was a failure`;
      setTimeout(() => {
        this.onSneakPersuadeFailure();
      }, this.actionDelay);
    }

  }

  doNothing(): void {
    this.displayMessage = `You decide to do nothing and move on.`;
    setTimeout(() => {
      this.nextChapter();
    }, this.actionDelay);
  }

  onSuccess(): void {
    this.successMessages = this.gameControllerService.encounterSuccess();
    this.showNextChapterButton = true;
  }

  onSneakPersuadeFailure(): void {
    switch(this.currentChapter.sneakPersuadeFail) {
      case CharacterAction.attack:
      default:
        this.displayMessage = `The enemy attacks you.`;
        setTimeout(() => {
          this.tryAttack();
        }, this.actionDelay);
        break;
      case CharacterAction.doNothing:
        this.displayMessage = `Your failure spoiled the opportunity and your party`;
        setTimeout(() => {
          this.nextChapter();
        }, this.actionDelay);
        break;
    }
  }

  nextChapter(): void {
    this.gameControllerService.nextChapter();
    this.currentChapter = this.gameControllerService.currentChapter;
    this.heroParty = this.gameControllerService.heroParty;
    this.enemyParty = this.gameControllerService.enemyParty;
    this.displayMessage = "";
    this.successMessages = [];
    this.showNextChapterButton = false;
  }

}
