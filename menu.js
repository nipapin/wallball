let menu;
let levels;
let gameOverScreen;
let pickModificator;

document.addEventListener('DOMContentLoaded', () => {
    menu = document.getElementById('game-menu');
    levels = document.getElementById('levels');
    gameOverScreen = document.getElementById('game-over');
    pickModificator = document.getElementById('pick-modificator');



    const menuButton = document.getElementById('menu')
    const playButton = document.getElementById('play');
    const continueButton = document.getElementById('continue');

    playButton.addEventListener('click', () => {
        menu.style.display = 'none';
        menu.style.pointerEvents = 'none'
    });

    continueButton.addEventListener('click', () => {
        levels.style.display = 'flex';
        levels.style.pointerEvents = 'auto';
        gameOverScreen.style.display = 'none';
        gameOverScreen.style.pointerEvents = 'none';
        menuButton.style.display = 'block';
        menuButton.style.pointerEvents = 'auto'
    });

    menuButton.addEventListener('click', () => {
        menu.style.display = 'flex';
        menu.style.pointerEvents = 'auto';
    })

    pickModificator.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
    })

    window.levelConfig = [
        { name: 'Level 1', waves: 5, blocksPerWave: 4, boss: { size: 3, health: 10 } },
        { name: 'Level 2', waves: 5, blocksPerWave: 4, boss: { size: 3, health: 10 } },
        { name: 'Level 3', waves: 5, blocksPerWave: 4, boss: { size: 3, health: 10 } },
        { name: 'Level 4', waves: 6, blocksPerWave: 5, boss: { size: 3, health: 10 } },
        { name: 'Level 5', waves: 6, blocksPerWave: 5, boss: { size: 3, health: 10 } },
        { name: 'Level 6', waves: 6, blocksPerWave: 5, boss: { size: 3, health: 10 } },
        { name: 'Level 7', waves: 7, blocksPerWave: 6, boss: { size: 3, health: 10 } },
        { name: 'Level 8', waves: 7, blocksPerWave: 6, boss: { size: 3, health: 10 } },
        { name: 'Level 9', waves: 7, blocksPerWave: 6, boss: { size: 3, health: 10 } },
        { name: 'Level 10', waves: 8, blocksPerWave: 7, boss: { size: 3, health: 10 } },
        { name: 'Level 11', waves: 8, blocksPerWave: 7, boss: { size: 3, health: 10 } },
        { name: 'Level 12', waves: 8, blocksPerWave: 7, boss: { size: 3, health: 10 } },
        { name: 'Level 13', waves: 9, blocksPerWave: 8, boss: { size: 3, health: 10 } },
        { name: 'Level 14', waves: 9, blocksPerWave: 8, boss: { size: 3, health: 10 } },
        { name: 'Level 15', waves: 9, blocksPerWave: 8, boss: { size: 3, health: 10 } },
        { name: 'Level 16', waves: 10, blocksPerWave: 9, boss: { size: 3, health: 10 } },
        { name: 'Level 17', waves: 10, blocksPerWave: 9, boss: { size: 3, health: 10 } },
        { name: 'Level 18', waves: 10, blocksPerWave: 9, boss: { size: 3, health: 10 } },
    ]

    window.levelConfig.forEach(level => {
        const card = document.createElement('button');
        card.classList.add('level-card');
        card.innerText = level.name;
        card.addEventListener('click', () => {
            world.level = { ...level };
            world.initEmptyGrid();
            world.generateRandomGrid();
            world.hitsToNextModificator = world.level.blocksPerWave;
            levels.style.display = 'none';
            levels.style.pointerEvents = 'none';
            menuButton.style.display = 'none';
            menuButton.style.pointerEvents = 'none'
        })
        document.getElementById('levels-cards').appendChild(card);
    })

})