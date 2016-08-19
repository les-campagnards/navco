var game = {
    renderer: {},
    inputs: {
        // TODO: figure out how inputs show work, I guess we should accumulate inputs from the
        // network into a list and for each frame the game logic will consume the list and react
        // to the inputs or something.
    },
    actors: {
        // dynamic game objects
    },
    level: {
        // static level data
    },
    game_state: {
        // some higher level state, like whether the game loops is active or paused, etc.
        running: true
    },
};

function client_main() {
    console.log("j'ai soif");

    renderer_init(game);

    anim_cb(16);
}

function anim_cb() {
    var elapsed_time = 16; // TODO

    // TODO consume inputs.

    client_game_tick(elapsed_time);

    renderer_tick(game, elapsed_time);

    if (game.game_state.running) {
        requestAnimationFrame(anim_cb);
    }
}

function client_game_tick(elapsed_time) {
    // console.log("client_game_tick");
}

function pause_game() {
    game.game_state.running = false;
}

function resume_game() {
    game.game_state.running = true;
    anim_cb(16);
}
