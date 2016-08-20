
function renderer_init(game) {
    game.renderer = {
        camera: {
            position: [0, 0], // camera position
        }
    };
    game.renderer.pixi = PIXI.autoDetectRenderer(800, 600);
    game.renderer.pixi.backgroundColor = 0x000000;

    // TODO integrate more cleanly
    document.body.appendChild(game.renderer.pixi.view);

    game.renderer.stage = new PIXI.Container();
}

function renderer_tick(game, elapsed_time) {

    // render loop goes here

    game.pixi.render(game.renderer.stage);
}
