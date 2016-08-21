'use strict';

var assetDescriptors = {
    "player1": {
        sprite: "assets/player_placeholder.png",
        anchor: { x: 0.5, y: 0.5 },
    },
    "player2": {
        sprite: "assets/player_placeholder2.png",
        anchor: { x: 0.5, y: 0.5 },
    },
    "bullet": {
        sprite: "assets/bullet_placeholder.png",
        anchor: { x: 0.5, y: 0.5 },
    }
}

function rendererInit(game) {

    game.renderer = {
        camera: {
            follow: "nical",
            position: [0, 0]
        }
    };

    game.renderer.pixi = PIXI.autoDetectRenderer(800, 600);
    game.renderer.pixi.backgroundColor = 0x000000;

    document.body.appendChild(game.renderer.pixi.view);
    game.renderer.stage = new PIXI.Container();

    game.renderer.objects = {};
}

function createRenderObject(game, name, descName, position) {
    if (game.logging) { console.log("[renderer] createRenderObject ", descName); }

    var desc = assetDescriptors[descName];
    let obj = new PIXI.Sprite.fromImage(desc.sprite);
    obj.position = pixi_vec2(position);
    obj.anchor = desc.anchor;

    var renderObj = { renderNode: obj }

    // Add the object to the renderer's object list.
    game.renderer.objects[name] = renderObj;
    // Add the object to pixi's scene graph.
    game.renderer.stage.addChild(renderObj.renderNode);

    return renderObj;
}

function rendererTick(game, elapsedTime) {
    // Look for objects that do not exist anymore.
    var toRemove = [];
    for (var key in game.renderer.objects) {
        if (!game.renderer.objects.hasOwnProperty(key)) {
            continue;
        }
        if (!game.objects.hasOwnProperty(key)) {
            toRemove.push(key);
        }
    }

    var cam = [0.0, 0.0];

    removeRenderObjects(game, toRemove);

    // Look for objects that do not exist yet.
    for (var key in game.objects) {
        if (!game.objects.hasOwnProperty(key)) {
            continue;
        }
        var gameObj = game.objects[key];
        if (!game.renderer.objects.hasOwnProperty(key)) {
            let renderObj = createRenderObject(game, key, gameObj.type, gameObj.position);
        }

        var renderObj = game.renderer.objects[key];

        // Assign screen-space position.
        renderObj.renderNode.position.x = gameObj.position[0] - cam[0];
        renderObj.renderNode.position.y = gameObj.position[1] - cam[1];
        renderObj.renderNode.rotation = gameObj.rotation;
    }

    if (game.renderer.objects.nical) {
    }

    updateCamera(game, elapsedTime);

    game.renderer.pixi.render(game.renderer.stage);
}

function removeRenderObjects(game, keys) {
    for (var i in keys) {
        if (game.logging) { console.log("[renderer] remove object " + keys[i]); }
        delete game.renderer.objects[keys[i]];
    }
}

function updateCamera(game, elapsedTime) {
    var cam = game.renderer.camera.position;
    var follow = game.renderer.camera.follow;
    if (follow) {
        if (game.renderer.objects[follow]) {
            cam = game.renderer.objects[follow].position;
        }
    }

    if (!cam) {
        return;
    }

    if (!isVec2(cam)) {
        //console.log("cam is not a vec2 ", cam)
        cam = pixi_vec2(cam);
    }

    var dt = elapsedTime / 16;

    // Iterate over all objects and set their screen pos
    for (name in game.renderer.objects) {
        var obj = game.renderer.objects[name];

        var screen_pos = vec2.create();
        vec2.sub(screen_pos, obj.position, camPos);

        pixi_set_vec2(player.renderNode.position, screen_pos);

        //var delta = vec2.scale(player.velocity, dt);
        //vec2.in_add(player.position, delta);
    }
}

function isVec2(v) { return !!v && !!v[0] && !!v[1]; }
function isPixiVec2(v) { return !!v && !!v.x && !!v.x; }

function pixi_vec2(v) { return { x: v[0], y: [1] }; }
function pixi_set_vec2(dst, src) { dst.x = src[0]; dst.y = src[1]; }
function glm_vec2(v) { return [v.x, v.y] }
function glm_set_vec2(dst, src) { dst[0] = src.x; dst[1] = srx.y; }
