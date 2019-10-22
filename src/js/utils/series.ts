type Func = () => any;

export default (...funcs: Func[]): Func => {
    return () => funcs.map(fn => fn());
};
