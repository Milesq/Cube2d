export default function random(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export const randNot = (unwanted: number, min: number, max: number): number => {
    let randomized;

    do {
        randomized = random(min, max);
    } while (randomized === unwanted);

    return randomized;
};
