export const stone = fetch(require('./../assets/stone.png'))
    .then(x => x.blob())
    .then(blob => createImageBitmap(blob));

export const teleportSound = new Audio(require('./../assets/teleport.wav'));
