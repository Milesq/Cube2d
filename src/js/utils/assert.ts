class AssertionError extends Error {
    constructor(msg: string) {
        super('Assertion Error!');
        this.name = msg + '!';
    }
}

export default (condition: boolean, msg: string): void => {
    if (!condition) {
        throw new AssertionError(msg);
    }
};
