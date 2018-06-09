import { RaceOptions, ClassOptions, GenderOptions } from './character-options';

export class Armor {
    constructor(public name: string
                ,public attackBarrierBonus: number) { }
}

export class Weapon {
    constructor(public name: string
                , public minDamage: number
                , public maxDamage: number) { }
}

export enum CharacterSkills {
    attack = "attack",
    sneak = "sneak",
    persuade = "persuade",
    intelligence = "intelligence" 
}

export enum FightOptions {
    attack = "Attack",
    specialAttack = "Special Attack",
    none = "None"
}

export const ExperienceToLevel = {
    1: 1000,
    2: 2000,
    3: 3000,
    4: 4000,
    5: 5000,
    6: 6000,
    7: 7000,
    8: 8000,
    9: 9000
}

export class BaseCharacter {
    name: string;
    maxHealth: number;
    currentHealth: number;
    isIncapacitated: boolean;
    spriteUrl: string;
    barriers: {
        attack: number;
        sneak: number;
        persuade: number;
    };
    skills: {
        attack: number;
        sneak: number;
        persuade: number;
        intelligence: number;
    };
    equippedWeapon: Weapon;
    equippedArmor: Armor;

    constructor(name: string, health: number, skills = {attack: 0, sneak: 0, persuade: 0, intelligence: 0}) {
        this.name = name,
        this.maxHealth = health,
        this.currentHealth =  health,
        this.skills = skills,
        this.isIncapacitated = false;
        this.barriers = {
            attack: 10,
            sneak: 10,
            persuade: 10
        }
    }

    attack() {
        return Math.floor(Math.random() * 20) + 1 + this.skills.attack;
    }

    sneak() {
        return Math.floor(Math.random() * 20) + 1 + this.skills.sneak;
    }

    persuade() {
        return Math.floor(Math.random() * 20) + 1 + this.skills.persuade;
    }

    dealDamage() {
        return Math.floor(Math.random() * (this.equippedWeapon.maxDamage - this.equippedWeapon.minDamage + 1)) + this.equippedWeapon.minDamage;
    }

}

export class Monster extends BaseCharacter {
    isTrapped: boolean = false;
    poisonStacks: number = 0;
    isStrongPoison: boolean = false;
    hasTakenPoisonDamageThisTurn: boolean = false;

    constructor(name, health, skills, barriers: {attack: number, sneak: number, persuade: number}, minDamage, maxDamage, spriteUrl) {
        super(name, health, skills);

        this.barriers = barriers;
        this.equippedWeapon = new Weapon(undefined, minDamage, maxDamage);

        this.spriteUrl = spriteUrl;
    }
}

export class Hero extends BaseCharacter {
    gender: string;
    race: string;
    characterRole: string;
    experience: number;
    level: number;
    availableSkillPoints: number;
    hastrapDefence: boolean;
    hasDamagingTrap: boolean;
    turnsUntilSpecialAvailableAgain: number;

    constructor(name, gender, race, level, health, skills, weapon, armor) {
        super(name, health, skills);

        this.gender = gender;
        this.race = race;
        this.experience = 0;
        this.level = level;
        this.equippedWeapon = weapon;
        this.equipNewArmor(armor);
    }

    levelUp(): void {
        this.experience -= ExperienceToLevel[this.level];
        this.level++;
        this.availableSkillPoints += 2;
        if(this.experience >= ExperienceToLevel[this.level]) {
            this.levelUp();
        }
    }

    equipNewArmor(armor: Armor): void {
        if(this.equippedArmor) {
            this.barriers.attack -= this.equippedArmor.attackBarrierBonus;
        }
        this.equippedArmor = armor;
        this.barriers.attack += this.equippedArmor.attackBarrierBonus;
    }

    equipNewWeapon(weapon: Weapon): void {
        this.equippedWeapon = weapon;
    }

    rest(): void {
        this.currentHealth = this.maxHealth;
        this.isIncapacitated = false;
        this.turnsUntilSpecialAvailableAgain = 0;
    }
}



