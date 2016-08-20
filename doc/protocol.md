# Communication client-serveur

La communication entre les clients et le serveur Navco s'effectue par échanges de messages JSON. Les différents
messages sont définis ci-dessous.

## Rapport d'interaction de joueur

A chaque fois qu'un joueur presse ou relache une touche du clavier ou un bouton de la souris, le client envoie un rapprt d'interaction au serveur.

| Identifiant | playerInput | 
| ------------ | ------ |
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

## Itération du jeu

A chaque itération du moteur du jeu dans le serveur, ce dernier envoie l'état complet de la partie à tous les clients.

| Identifiant | playerInput | 
| ------------ | ------ |
| *Expéditeur* | Serveur |
| *Destinataire* | Tous les clients |
| *Périodicité* | 10ms |


```json
{
    "game_infos":
    {
        "status": "playing",
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
