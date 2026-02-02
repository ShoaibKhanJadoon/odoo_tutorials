// clicker_game/static/src/clicker_model.js
import { Reactive } from "@web/core/utils/reactive";
import { EventBus } from "@odoo/owl";
import { getReward } from "./components/click_rewards";
import { browser } from "@web/core/browser/browser";

const STORAGE_KEY = "clicker_game_state";
const CURRENT_VERSION = 2;

const migrations = [
  {
    fromVersion: 1,
    toVersion: 2,
    apply: (state) => {
      console.log("Migrating state from v1 → v2 (adding peach trees) 🍑");
      state.peachTrees = 0; // add new property
      state.peaches = 0; // add fruit counter
      return state;
    },
  },
];

export class ClickerModel extends Reactive {
  constructor(env) {
    super();
    this.env = env;
    this.bus = new EventBus();

    // Load saved game state (if any)
    const saved = browser.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      let loaded = JSON.parse(saved);
      loaded = this._applyMigrations(loaded); // apply migrations if needed
      Object.assign(this, loaded);
    } else {
      this._initializeDefaultState();
    }

    // ⏱️ Interval for clickBots (10 clicks every 10s)
    setInterval(() => {
      const generated = (10 * this.clickBots + 100 * this.bigBots) * this.power;
      this.clicks += generated;
      this._updateLevel();
      if (Math.random() < 0.01) {
        // 5% chance every cycle
        this._triggerReward();
      }
      this._save();
    }, 10000);

    setInterval(() => {
      this.pears += this.pearTrees;
      this.cherries += this.cherryTrees;
      this.peaches += this.peachTrees;
      this._save();
    }, 30000);
  }

  _initializeDefaultState() {
    this.clicks = 0;
    this.level = 0;
    this.clickBots = 0;
    this.bigBots = 0;
    this.power = 1;
    this.pearTrees = 0;
    this.cherryTrees = 0;
    this.peachTrees = 0;
    this.pears = 0;
    this.cherries = 0;
    this.peaches = 0;
  }
  // Save current state
  _save() {
    const data = {
      clicks: this.clicks,
      level: this.level,
      clickBots: this.clickBots,
      bigBots: this.bigBots,
      power: this.power,
      pearTrees: this.pearTrees,
      cherryTrees: this.cherryTrees,
      peachTrees: this.peachTrees,
      pears: this.pears,
      cherries: this.cherries,
      peaches: this.peaches,
    };
    browser.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  _applyMigrations(state) {
    let migrated = { ...state };
    migrated.version = migrated.version || 1; // assume version 1 if missing

    while (migrated.version < CURRENT_VERSION) {
      const migration = migrations.find(
        (m) => m.fromVersion === migrated.version
      );
      if (!migration) break;
      migrated = migration.apply(migrated);
      migrated.version = migration.toVersion;
    }

    return migrated;
  }
  // Reset Game
  reset() {
    browser.localStorage.removeItem(STORAGE_KEY);
    this._initializeDefaultState();
    window.location.reload();
  }
  //  Add one click
  increment(amount) {
    this.clicks += amount;
    this._updateLevel();
    if (Math.random() < 0.01) {
      // 1% chance per click
      this._triggerReward();
    }
    this._save();
  }

  // 🤖 Buy a ClickBot if enough clicks
  buyClickBot() {
    if (this.level >= 1 && this.clicks >= 1000) {
      this.clicks -= 1000;
      this.clickBots++;
      this._updateLevel();
    }
    this._save();
  }
  buyBigBot() {
    if (this.level >= 2 && this.clicks >= 5000) {
      this.clicks -= 5000;
      this.bigBots++;
      this._updateLevel();
    }
    this._save();
  }

  buyPower() {
    if (this.level >= 3 && this.clicks >= 50000) {
      this.clicks -= 50000;
      this.power++;
      this._updateLevel();
    }
    this._save();
  }
  buyTree(type) {
    if (this.level >= 4 && this.clicks >= 1000000) {
      this.clicks -= 1000000;
      if (type === "pear") {
        this.pearTrees++;
      } else if (type === "cherry") {
        this.cherryTrees++;
      }else if (type === "peach") {
        this.peachTrees++;
      }
    }
    this._save();
  }

  get totalTrees() {
    return this.pearTrees + this.cherryTrees + this.peachTrees;
  }

  get totalFruits() {
    return this.pears + this.cherries + this.peaches;
  }

  // Update level depending on clicks
  _updateLevel() {
    if (this.clicks >= 1000 && this.level < 1) {
      this.level = 1;
      this.bus.trigger("MILESTONE_1K");
      this._triggerReward();
    } else if (this.clicks >= 5000 && this.level < 2) {
      this.level = 2;
      this.bus.trigger("MILESTONE_5K");
      this._triggerReward();
    } else if (this.clicks >= 100000 && this.level < 3) {
      this.level = 3;
      this.bus.trigger("MILESTONE_100K");
      this._triggerReward();
    } else if (this.clicks >= 1000000 && this.level < 4) {
      this.level = 4;
      this.bus.trigger("MILESTONE_1M");
      this._triggerReward();
    }
  }
  _triggerReward() {
    const reward = getReward(this.level);
    reward.apply(this);

    const service = this.env.services;
    service.effect.add({
      type: "rainbow_man",
      message: `🎉 Reward Unlocked! ${reward.description}`,
      fadeout: "slow",
    });
    service.notification.add(`You received a reward: ${reward.description}`, {
      title: "Reward Earned!",
      type: "success",
    });
    this._save();
  }
}
