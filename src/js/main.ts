import Navigo from 'navigo';
import startGame from './startGame';
import settings from './pages/settings';

/* eslint @typescript-eslint/no-var-requires: "off" */
const menu = require('../menu.html');
const options = require('../settings.html');
const manual = require('../manual.html');

const router = new Navigo(null, true, '#');
const app = document.getElementById('app');

const bg = document.createElement('div');
bg.className = 'background';

for (let i = 0; i < 20; ++i) {
    bg.appendChild(document.createElement('span'));
}

document.body.appendChild(bg);

router.on({
    '/'() {
        app.innerHTML = menu;
    },
    start() {
        app.innerHTML = '';
        startGame(app);
    },
    settings() {
        app.innerHTML = options;
        settings();
    },
    manual() {
        app.innerHTML = manual;
    }
});

router.hooks({
    after() {
        app.querySelectorAll('.menu__item').forEach(el =>
            el.addEventListener('click', ev => {
                ev.preventDefault();
                const href = (ev.target as HTMLAnchorElement).getAttribute('href');
                router.navigate(href);
            })
        );
    }
});

router.resolve();
