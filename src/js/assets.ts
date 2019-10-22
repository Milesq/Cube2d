const image = (path: string) =>
    fetch(path)
        .then(x => x.blob())
        .then(blob => createImageBitmap(blob));

export const stone = image(require('../assets/stone.png'));

export const portal = image(require('../assets/portals.png'));

export const player = image(require('../assets/player.png'));

export const grass = image(require('../assets/grass.png'));

export const teleportSound = new Audio(require('./../assets/teleport.wav'));
