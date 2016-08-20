
function renderer_init(game) {
    game.renderer = {
        camera: {
            follow: "player",
            position: [0, 0], // camera position
        }
    };

    game.game_objects = {};

    game.renderer.pixi = PIXI.autoDetectRenderer(800, 600);
    game.renderer.pixi.backgroundColor = 0x000000;

    // TODO integrate more cleanly
    document.body.appendChild(game.renderer.pixi.view);

    game.renderer.assets = {};

    var player = new PIXI.Sprite.fromImage('assets/player_placeholder.png');
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    player.position = { x: 400, y: 400 };

    game.renderer.assets.player = player;

    game.renderer.stage = new PIXI.Container();
    game.renderer.stage.addChild(player);

    game.renderer.game_objects = {};
}

function renderer_tick(game, elapsed_time) {
    // render loop goes here

    game.renderer.assets.player.rotation += 0.01 * elapsed_time;

    update_camera(game, elapsed_time);

    game.renderer.pixi.render(game.renderer.stage);
}

/*
    game_objects: {
        player_1: [
            world_position: {x: 100, y: 200 },
            speed: 12.0,
            render_node: {...},
        ]
    }

*/

function pixi_vec2(v) { return { x: v[0], y: [1] }; }
function pixi_set_vec2(dst, src) { dst.x = src[0]; dst.y = src[1]; }
function glm_vec2(v) { return [v.x, v.y] }
function glm_set_vec2(dst, src) { dst[0] = src.x; dst[1] = srx.y; }

function update_camera(game, elapsed_time) {
    var cam_follow = game.renderer.game_objects[game.renderer.camera.follow];

    if (!cam_follow) {
        return;
    }

    var cam_pos = cam_follow.position;
    // iterate over all objects and set their screen pos
    for (player in game.game_objects) {
        var dt = elapsed_time / 16;
        var screen_pos = vec2.new();
        vec2.sub(screen_pos, player.world_position, cam_pos)
        pixi_vec2_set(player.render_node.position, screen_pos);
        var delta = vec2.scale(player.velocity, dt);
        vec2.in_add(player.world_position, delta);
    }
}
