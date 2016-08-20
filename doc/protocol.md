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
    "messageType": "playerInput",
    "keys" :
    {
        "up": 0,
        "down": -1,
        "left": 1,
        "right": 0
    },
    "cursor" : [345, 556]
}
```

## Itération du jeu

A chaque itération du moteur du jeu dans le serveur, ce dernier envoie l'état complet de la partie à tous les clients.

| Identifiant | gameLoop |
| ------------ | ------ |
| *Expéditeur* | Serveur |
| *Destinataire* | Tous les clients |
| *Périodicité* | 10ms |


```json
{
    "messageType": "gameState",
    "gameInfos":
    {
        "status": "playing",
        "remaningTime": 600, //in ms
        "remaningPoints": 3
    },
    "objects" :
    [
        {
            "id": "Nical",
            "type": "player",
            "position": [120, 426],
            "speed": [5, 7],
            "acceleration": [1, 0],
            "radius": 5,
            "handicap": 54
        },
        {
            "id": "SuperTirDeGruck",
            "type": "bullet",
            "position": [567, 124],
            "speed": [2, 0],
            "acceleration": [0, 3],
            "radius": 2
        },
    ],
    "events":
    [
        {
            "id": "NicalPrendCher",
            "type": "death",
            "position": [120, 426],
            "duration": 2
        }
    ]
}
```

## Connexion au serveur

Lorsqu'un client se connecte au serveur, le premier message qu'il doit envoyer a un format spécifique.

| Identifiant | clientConnection |
| ------------ | ------ |
| *Expéditeur* | Client |
| *Destinataire* | Serveur |
| *Périodicité* | Evenementielle |

```json
{
    "messageType": "clientConnection",
    "nickname": "Nical"
}
```
