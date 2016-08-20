# Communication client-serveur

La communication entre les clients et le serveur Navco s'effectue par échanges de messages JSON. Les différents
messages sont définis ci-dessous.

## Rapport d'interaction de joueur

| *Expéditeur* | Client |
| *Destinataire* | Serveur |
| *Périodicité* | Evenementielle |

```json
{
   "keys" :
   {
       "up": 0,
       "down": -1,
       "left": 1,
       "right": 0
   },
   "cursor" :
   {
       "x": 345,
       "y": 556
   }
}
```

Serveur => Client
-----------------

```json
{
    "game_infos":
    {
        "remaning_time": 600,
        "remaning_points": 3
    },
    "objects" :
    [
        {
            "id": "Nical",
            "type": "player",
            "position":
            {
                "x": 120,
                "y": 426
            },
            "speed":
            {
                "x": 5,
                "y": 7
            },
            "acceleration":
            {
                "x": 1,
                "y": 0
            },
            "radius": 5,
            "handicap": 54
        },
        {
            "id": "SuperTirDeGruck",
            "type": "bullet",
            "position":
            {
                "x": 567,
                "y": 124
            },
            "speed":
            {
                "x": 2,
                "y": 0
            },
            "acceleration":
            {
                "x": 0,
                "y": 3
            },
            "radius": 2
        },
   ],
   "events":
   [
       {
           "id": "NicalPrendCher",
           "type": "death",
           "position":
           {
               "x": 120,
               "y": 426
           },
           "duration": 2
       }
   ]
}
```
