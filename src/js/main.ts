import Navigo from 'navigo';
import startGame from './startGame';
import settings from './pages/settings';

/* eslint @typescript-eslint/no-var-requires: "off" */
const menu = require('../menu.html');
const options = require('../settings.html');
const manual = require('../manual.html');
const manualContent = require('../assets/manual.md');

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
        document.body.classList.add('in-game');
        (document.querySelector('.background') as HTMLElement).style.display = 'none';
        startGame(app);
    },
    settings() {
        app.innerHTML = options;
        settings();
    },
    manual() {
        app.innerHTML = manual;
        app.querySelector('.content').innerHTML = manualContent;
    }
});

router.hooks({
    before(done: () => void) {
        document.body.classList.remove('in-game');
        (document.querySelector('.background') as HTMLElement).style.display = 'inherit';
        done();
    },
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
