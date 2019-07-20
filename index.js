const API_URL = 'https://api.github.com/';
const rootElement = document.getElementById('root');
const loadingElement = document.getElementById('loading-overlay');
const arr = [];




function callApi(endpoind, method) {
    const url = API_URL + endpoind
    const options = {
        method
    };

    return fetch(url, options)
        .then(response =>
            response.ok ?
            response.json() :
            Promise.reject(Error('Failed to load'))
        )
        .catch(error => {
            throw error
        });
}

class FighterService {
    async getFighters() {
        try {
            const endpoint = 'repos/sahanr/street-fighter/contents/fighters.json';
            const apiResult = await callApi(endpoint, 'GET');
            return JSON.parse(atob(apiResult.content));
        } catch (error) {
            throw error;
        }
    }
    async getFighterDetails() {
        try {
            const endpoint = 'repos/no4good/fighters/contents/fighterdetalies.json';
            const apiResult = await callApi(endpoint, 'GET');
            return JSON.parse(atob(apiResult.content));
        } catch (error) {
            throw error;
        }
    }
}

class Fighter {
    constructor(fighter) {
        this.fighter = fighter;
    }

    getHitPower() {
        let criticalHitChance = Math.floor(Math.random() * 2) + 1;
        return this.fighter.attack * criticalHitChance;
    }

    getBlockPower() {
        let dodgeChance = Math.floor(Math.random() * 2) + 1;
        return this.fighter.defense * dodgeChance;
    }
}

const fighterService = new FighterService();

class View {
    element;

    createElement({
        tagName,
        className = '',
        attributes = {}
    }) {
        const element = document.createElement(tagName);
        element.classList.add(className);

        Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

        return element;
    }

}

class FighterView extends View {
    constructor(fighter, handleClick) {
        super();

        this.createFighter(fighter, handleClick);
    }

    createFighter(fighter, handleClick) {
        const {
            name,
            source
        } = fighter;
        const nameElement = this.createName(name);
        const imageElement = this.createImage(source);

        this.element = this.createElement({
            tagName: 'div',
            className: 'fighter'
        });
        this.element.append(imageElement, nameElement);
        this.element.addEventListener('click', event => handleClick(event, fighter), false);
    }

    createName(name) {
        const nameElement = this.createElement({
            tagName: 'span',
            className: 'name'
        });
        nameElement.innerText = name;

        return nameElement;
    }

    createImage(source) {
        const attributes = {
            src: source
        };
        const imgElement = this.createElement({
            tagName: 'img',
            className: 'fighter-image',
            attributes
        });

        return imgElement;
    }
}

class FightersView extends View {
    constructor(fighters) {
        super();
        this.handleClick = this.handleFighterClick.bind(this);
        this.createFighters(fighters);
    }

    fightersDetailsMap = new Map();

    createFighters(fighters) {
        const fighterElements = fighters.map(fighter => {
            const fighterView = new FighterView(fighter, this.handleClick);
            return fighterView.element;
        });

        this.element = this.createElement({
            tagName: 'div',
            className: 'fighters'
        });
        this.element.append(...fighterElements);
    }

    async handleFighterClick(event, fighter) {
        let fighterDetails = await fighterService.getFighterDetails();
        this.fightersDetailsMap.set(fighter._id, fighterDetails[fighter._id - 1])

        if (arr.length === 0) {
            arr.push([fighterDetails[fighter._id - 1], event.path[1]])
            event.path[1].classList.add('ss');
        } else {
            if (arr.length < 2) {
                arr.map((x, i) => x[0].name === event.path[1].innerText ? (arr[i][1].classList.remove('ss'), arr.splice(i, 1)) :
                    arr.push([fighterDetails[fighter._id - 1], event.path[1]]), event.path[1].classList.add('ss'));
            } else {
                arr[0][1].classList.remove('ss');
                arr.shift();
                arr.push([fighterDetails[fighter._id - 1], event.path[1]]);
                event.path[1].classList.add('ss');
            }
        }

        // const popup = document.querySelector('.popup');
        // popup.style.left = event.x + 'px';
        // popup.style.top = event.y + 'px';
        // setTimeout(function () {
        //     document.body.classList.add('opened');

        //     setTimeout(function () {
        //         popup.classList.add('opened');
        //     }, 10);
        // }, 10);


    }
}

class App {
    constructor() {
        this.startApp();
    }

    static rootElement = document.getElementById('root');
    static loadingElement = document.getElementById('loading-overlay');

    async startApp() {
        try {
            App.loadingElement.style.visibility = 'visible';

            const fighters = await fighterService.getFighters();

            const fightersView = new FightersView(fighters);
            const fightersElement = fightersView.element;

            App.rootElement.appendChild(fightersElement);
        } catch (error) {
            console.warn(error);
            App.rootElement.innerText = 'Failed to load data';
        } finally {
            App.loadingElement.style.visibility = 'hidden';
        }
    }
}

new App();