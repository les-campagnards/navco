'use strict';

var meh = 0;

function fakeServerTick(elapsedTime) {
    var t = meh * 0.01;
    var msg = {
        "messageType": "gameState",
        "gameInfos":
        {
            "status": "playing",
            "remaningTime": 600,
            "remaningPoints": 3
        },
        "objects" : {
            "nical": {
                "type": "player1",
                "position": [200+120 * Math.sin(t), 200 + 100 * Math.cos(t)],
                "rotation": t * 2.1,
                "speed": [5, 7],
                "acceleration": [1, 0],
                "radius": 5,
                "handicap": 54
            },
            "Gruck" : {
                "type": "player2",
                "position": [567 + Math.sin(t*5) * 100, 124],
                "rotation": Math.sin(t),
                "speed": [2, 0],
                "acceleration": [0, 3],
                "radius": 2
            },
        },
        "events": [
        ]
    };
    if (meh++ % 100 == 0) {
        msg.events.push({
            "id": "NicalPrendCher",
            "type": "death",
            "position": [120, 426],
            "duration": 2
        });
    }
    handleServerMessage(msg);

}
