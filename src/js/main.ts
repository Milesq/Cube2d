import Navigo from 'navigo';
import startGame from './startGame';

/* eslint @typescript-eslint/no-var-requires: "off" */
const menu = require('../menu.html');
const manual = require('../manual.html');

const router = new Navigo(null, true, '#');
const app = document.getElementById('app');

router.on({
    '/'() {
        app.innerHTML = menu;
    },
    start() {
        app.innerHTML = '';
        startGame(app);
    },
    manual() {
        app.innerHTML = manual;
    }
});

router.hooks({
    after() {
        app.querySelectorAll('.manu__item').forEach(el =>
            el.addEventListener('click', ev => {
                ev.preventDefault();
                const href = (ev.target as HTMLAnchorElement).getAttribute('href');
                router.navigate(href);
            })
        );
    }
});

router.resolve();
