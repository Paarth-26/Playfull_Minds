document.addEventListener('DOMContentLoaded', () => {
    class SpellingGame {
        constructor(manager) {
            this.mgr = manager;
            
            this.promptElement = document.getElementById('word-to-spell');
            this.hintElement = document.getElementById('word-hint');
            this.answerElement = document.getElementById('answer');
            this.submitButton = document.getElementById('submit');
            this.levelElement = document.getElementById('level');
            this.timerElement = document.getElementById('timer');
            this.speakBtn = document.getElementById('speak-again-btn');

            this.wordPools = {
                1: [
                    { word: 'cat', hint: 'A small pet that says meow' },
                    { word: 'sun', hint: 'The bright star in our sky' },
                    { word: 'tree', hint: 'It has roots, a trunk, and leaves' },
                    { word: 'book', hint: 'Something you read' },
                    { word: 'fish', hint: 'It swims in the water' },
                    { word: 'frog', hint: 'A green animal that hops' },
                    { word: 'cake', hint: 'A sweet treat for birthdays' },
                    { word: 'lamp', hint: 'It gives light in a room' },
                    { word: 'bird', hint: 'An animal that can fly' },
                    { word: 'milk', hint: 'A white drink from cows' },
                    { word: 'hand', hint: 'You use this to wave hello' },
                    { word: 'star', hint: 'A light in the night sky' }
                ],
                2: [
                    { word: 'apple', hint: 'A red or green fruit' },
                    { word: 'water', hint: 'You drink it every day' },
                    { word: 'green', hint: 'The color of grass' },
                    { word: 'happy', hint: 'The opposite of sad' },
                    { word: 'bread', hint: 'You use this to make a sandwich' },
                    { word: 'cloud', hint: 'A white fluffy thing in the sky' },
                    { word: 'grape', hint: 'A small purple or green fruit' },
                    { word: 'plane', hint: 'It flies people across the world' },
                    { word: 'smile', hint: 'What you do when you are happy' },
                    { word: 'house', hint: 'A place where people live' },
                    { word: 'clock', hint: 'It tells you what time it is' },
                    { word: 'ocean', hint: 'A giant body of salt water' }
                ],
                3: [
                    { word: 'circle', hint: 'A round shape with no corners' },
                    { word: 'yellow', hint: 'The color of a banana' },
                    { word: 'purple', hint: 'Mixing red and blue makes this' },
                    { word: 'family', hint: 'People who love and live with you' },
                    { word: 'garden', hint: 'A place where flowers grow' },
                    { word: 'rocket', hint: 'It travels to the moon' },
                    { word: 'turtle', hint: 'An animal with a hard shell' },
                    { word: 'window', hint: 'You look through it to see outside' },
                    { word: 'cheese', hint: 'A yellow food that mice love' },
                    { word: 'school', hint: 'A place where you learn' },
                    { word: 'dragon', hint: 'A magical creature that breathes fire' },
                    { word: 'monkey', hint: 'A funny animal that loves bananas' }
                ],
                4: [
                    { word: 'banana', hint: 'A long yellow fruit' },
                    { word: 'planet', hint: 'Earth is one of these' },
                    { word: 'rainbow', hint: 'Colorful arc seen after rain' },
                    { word: 'bicycle', hint: 'Something with two wheels you ride' },
                    { word: 'elephant', hint: 'A huge animal with a trunk' },
                    { word: 'butterfly', hint: 'A colorful insect with wings' },
                    { word: 'dinosaur', hint: 'A giant lizard from long ago' },
                    { word: 'mountain', hint: 'A very high hill' },
                    { word: 'treasure', hint: 'Gold and jewels hidden in a chest' },
                    { word: 'keyboard', hint: 'Used to type on a computer' },
                    { word: 'painting', hint: 'A picture made with colors' },
                    { word: 'volcano', hint: 'A mountain that erupts with lava' }
                ],
                5: [
                    { word: 'computer', hint: 'A machine for games and work' },
                    { word: 'strawberry', hint: 'A red fruit with tiny seeds' },
                    { word: 'astronaut', hint: 'Someone who travels in space' },
                    { word: 'lightning', hint: 'Bright flash in a storm' },
                    { word: 'adventure', hint: 'An exciting and fun trip' },
                    { word: 'discovery', hint: 'Finding something new' },
                    { word: 'knowledge', hint: 'What you have when you learn' },
                    { word: 'chocolate', hint: 'A brown sweet treat' },
                    { word: 'umbrella', hint: 'Keeps you dry when it rains' },
                    { word: 'telescope', hint: 'Used to look at far away stars' },
                    { word: 'universe', hint: 'Everything in space and time' },
                    { word: 'creative', hint: 'Having great new ideas' }
                ]
            };

            this.maxLevel = 5;
            this.currentItem = null;
            this.level = 1;
            this.timer = null;
            this.timeLeft = 12;

            this.submitButton.addEventListener('click', () => {
                this.mgr.playSound('click');
                this.handleSubmit();
            });
            
            this.answerElement.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    this.handleSubmit();
                }
            });

            if (this.speakBtn) {
                this.speakBtn.addEventListener('click', () => this.speakWord());
            }
        }

        checkBadges() {
            if (this.mgr.gameScore >= 10) this.mgr.unlockBadge('spelling_bee_1', 'Spelling Bee');
        }

        startTimer() {
            clearInterval(this.timer);
            this.timeLeft = Math.max(8, 16 - this.level);
            this.timerElement.textContent = `Time: ${this.timeLeft}`;
            this.timer = setInterval(() => {
                this.timeLeft--;
                this.timerElement.textContent = `Time: ${this.timeLeft}`;
                if (this.timeLeft <= 0) {
                    clearInterval(this.timer);
                    this.checkAnswer(null);
                }
            }, 1000);
        }

        getPool() {
            return this.wordPools[this.level] || this.wordPools[this.maxLevel];
        }

        speakWord() {
            if (this.currentItem) {
                this.mgr.speak(`The word is ${this.currentItem.word}`);
            }
        }

        nextWord() {
            this.mgr.setCharacterExpression('neutral');
            this.answerElement.disabled = false;
            this.submitButton.disabled = false;

            const spellingWords = this.getPool();
            const randomIndex = Math.floor(Math.random() * spellingWords.length);
            this.currentItem = spellingWords[randomIndex];

            this.hintElement.innerHTML = `Spell the word for:<br><strong>"${this.currentItem.hint}"</strong>`;
            this.promptElement.textContent = 'Listen & Spell';
            this.answerElement.value = '';
            this.answerElement.focus();

            this.mgr.speak(`Spell the word for: ${this.currentItem.hint}. The word is ${this.currentItem.word}`);
            this.startTimer();
        }

        checkAnswer(userAnswer) {
            clearInterval(this.timer);
            this.answerElement.disabled = true;
            this.submitButton.disabled = true;
            
            const correctWord = this.currentItem?.word || '';

            if (userAnswer === correctWord) {
                this.mgr.playSound('correct');
                this.mgr.setCharacterExpression('happy');
                this.mgr.addScore(1);
                this.mgr.addStar(1);
                this.mgr.showPopup(true, 'Correct!', `You spelled "${correctWord}" perfectly!`, () => this.nextWord());
                this.mgr.speak('Correct!');
                
                if (this.mgr.gameScore > 0 && this.mgr.gameScore % 5 === 0 && this.level < this.maxLevel) {
                    this.level++;
                    if (this.levelElement) this.levelElement.textContent = `Level: ${this.level}`;
                    this.mgr.speak(`Awesome! You've reached level ${this.level}.`);
                }
                this.checkBadges();
            } else {
                this.mgr.playSound('incorrect');
                this.mgr.setCharacterExpression('sad');
                const message = userAnswer === null ? `Time's up! It was "${correctWord}".` : `Not quite! It was "${correctWord}".`;
                this.mgr.showPopup(false, 'Oops!', message, () => this.nextWord());
                this.mgr.speak(message);
            }
        }
        
        handleSubmit() {
            const userAnswer = this.answerElement.value.trim().toLowerCase();
            if (userAnswer === '') {
                this.mgr.speak("Type your answer first.");
                this.answerElement.focus();
                return;
            }
            this.checkAnswer(userAnswer);
        }

        start() {
            this.level = 1;
            if (this.levelElement) this.levelElement.textContent = `Level: ${this.level}`;
            this.nextWord();
        }
    }

    const game = new SpellingGame(window.gameManager);
    game.start();
});