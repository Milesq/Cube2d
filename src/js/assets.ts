const image = (path: string): Promise<ImageBitmap> =>
    fetch(path)
        .then(x => x.blob())
        .then(blob => createImageBitmap(blob));

/* eslint @typescript-eslint/no-var-requires: "off" */
export const stone = image(require('../assets/stone.png'));

export const portal = image(require('../assets/portals.png'));

export const player = image(require('../assets/player.png'));

export const grass = image(require('../assets/grass.png'));

export const teleportSound = new Audio(require('./../assets/teleport.wav'));

export const backgroundSound = new Audio(require('./../assets/background.mp3'));
