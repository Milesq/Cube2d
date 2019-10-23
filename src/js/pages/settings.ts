function interactiveOption(opt: string, whenOn: string, whenOff: string) {
    let isOn = localStorage.getItem(opt) === null ? true : false;
    const el = document.querySelector(`.option-${opt}`);

    const adjust = (): void => {
        if (isOn) {
            el.classList.add(whenOn);
            el.classList.remove(whenOff);
        } else {
            el.classList.add(whenOff);
            el.classList.remove(whenOn);
        }
    };

    adjust();

    el.parentElement.addEventListener('click', () => {
        isOn = !isOn;

        if (isOn) {
            localStorage.removeItem(opt);
        } else localStorage.setItem(opt, 'false');

        adjust();
    });
}

export default () => {
    interactiveOption('sounds', 'fa-volume-up', 'fa-volume-mute');
    interactiveOption('music', 'option-music--on', 'option-music--off');
};
