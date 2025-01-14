// scripts/hooks.js
import { assignOrderToTiles } from "./utilities.js";
import { TotMForm } from "./totmManager.js";

// Define moduleId
const moduleId = 'totm-manager';

export function initializeHooks() {

  // Register keybinding from settings
  console.log("TotM Manager | Registering keybinding for totm manager");
  game.keybindings.register(moduleId, 'openManager', {
    name: 'Open/Close TotM Manager',
    hint: 'Toggles the Theatre of the Mind Manager window.',
    editable: [{ key: 'KeyT', modifiers: ['Control'] }], // Set default keybinding
    onDown: () => {
      console.log("TotM Manager: Keybinding triggered");

      // Check if the singleton instance is rendered
      if (TotMForm._instance && TotMForm._instance.rendered) {
        // If the instance is rendered, close it (hide it)
        TotMForm._instance.close();
      } else {
        // If the instance is not rendered, render it
        TotMForm.renderSingleton();
      }
      return true;
    },
    restricted: true
  });
  console.log("TotM Manager | Finished registering keybinding for totm manager");

  game.settings.register(moduleId, 'imageTransitionDuration', {
    name: "Image Transition Duration",
    hint: "Duration of the image transition effect in milliseconds.",
    scope: 'world',
    config: true,
    type: Number,
    default: 500,
  });

  game.settings.register(moduleId, 'imageTransitionIncrement', {
    name: "Image Transition Increment",
    hint: "Increment value for the image transition effect.",
    scope: 'world',
    config: true,
    type: Number,
    default: 0.01,
  });

  game.settings.register(moduleId, 'imageTransitionTargetAlpha', {
    name: "Image Transition Target Alpha",
    hint: "Target alpha value for the image transition effect. 0 is fully transparent, 1 is fully opaque.",
    scope: 'world',
    config: true,
    type: Number,
    default: 0.5,
    range: {
      min: 0,
      max: 1,
      step: 0.01
    }
  });

  game.settings.register(moduleId, 'initialTileTag', {
    name: 'Initial Tile Tag',
    hint: 'The tag of the initial tile to be selected when the module loads.',
    scope: 'world',
    config: true,
    type: String,
    default: 'scene',
    onChange: value => {
      console.log(`Initial Tile Tag setting changed to: ${value}`);
    }
  });

  // Register search image size setting
  game.settings.register(moduleId, 'imageSize', {
    name: 'Search Image Size',
    hint: 'Set the size of images in search results.',
    scope: 'client',
    config: true,
    type: Number,
    range: {
      min: 50,
      max: 300,
      step: 10
    },
    default: 100
  });

  // Register preview image size setting
  game.settings.register(moduleId, 'previewImageSize', {
    name: 'Preview Image Size',
    hint: 'Set the size of the preview images.',
    scope: 'client',
    config: true,
    type: Number,
    range: {
      min: 50,
      max: 300,
      step: 10
    },
    default: 200
  });

  // Hook into the getSceneControlButtons event
  Hooks.on("getSceneControlButtons", controls => {
    console.log("TotM Manager: getSceneControlButtons hook called");

    // Ensure the canvas and scene are ready
    if (!canvas.ready || !game.scenes.active) {
      console.warn("TotM Manager: Canvas or active scene not yet ready, delay getSceneControlButtons operations.");
      return;
    }

    let tileControl = controls.find(c => c.name === "tiles");
    if (tileControl) {
      console.log("TotM Manager: Adding button to tile controls");
      tileControl.tools.push({
        name: "totmManager",
        title: "Theatre of the Mind Manager",
        icon: "fas fa-mask",
        onClick: () => {
          console.log("TotM Manager: Button clicked");
          TotMForm.renderSingleton(); // Render the singleton instance
        },
        button: true
      });
    }
  });

  Hooks.on('canvasReady', () => {
    // Check if the canvas is ready
    if (!canvas.ready) {
      console.warn("TotM Manager: Canvas is not ready, aborting tile operations.");
      return;
    }

    // Check if there are any tiles on the canvas
    const tiles = canvas.tiles?.placeables;
    if (!tiles || tiles.length === 0) {
      console.warn("TotM Manager: No tiles found on the canvas, skipping refreshManagerData.");
      return;
    }

    // Check if the TotMForm instance is rendered
    if (TotMForm._instance && TotMForm._instance.rendered) {
      TotMForm._instance.refreshManagerData(); // Refresh manager data if instance is rendered
    }
  });

  Hooks.on('createTile', (tile, options, userId) => {
    console.log('Tile created, assigning order...');
    assignOrderToTiles();
  });

}
