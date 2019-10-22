/*eslint @typescript-eslint/no-explicit-any: "off"*/

type Func = () => any;

export default (...funcs: Func[]): Func => {
    return (): any[] => funcs.map(fn => fn());
};
