document.addEventListener('DOMContentLoaded', () => {
    class WordScrambleGame {
        constructor(manager) {
            this.mgr = manager;
            
            this.scrambledWordElement = document.getElementById('scrambled-word');
            this.answerElement = document.getElementById('answer');
            this.submitButton = document.getElementById('submit');
            this.levelElement = document.getElementById('level');
            this.timerElement = document.getElementById('timer');

            this.words = [
                'apple', 'banana', 'orange', 'grape', 'strawberry', 'planet', 'rocket', 'circle', 'family', 'happy',
                'ocean', 'mountain', 'rainbow', 'treasure', 'volcano', 'butterfly', 'dinosaur', 'astronaut', 'lightning', 'adventure',
                'computer', 'keyboard', 'telescope', 'universe', 'discovery', 'knowledge', 'chocolate', 'umbrella', 'bicycle', 'airplane',
                'elephant', 'giraffe', 'octopus', 'whisper', 'freedom', 'glitter', 'journey', 'magical', 'monster', 'perfect',
                'python', 'program', 'science', 'history', 'weather', 'balloon', 'feather', 'diamond', 'crystal', 'holiday',
                'island', 'jungle', 'kitchen', 'library', 'morning', 'nestle', 'penguin', 'quality', 'respect', 'silence'
            ];
            
            this.currentWord = '';
            this.level = 1;
            this.timer = null;
            this.timeLeft = 15;

            this.submitButton.addEventListener('click', () => {
                this.mgr.playSound('click');
                this.checkAnswer();
            });

            this.answerElement.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    this.checkAnswer();
                }
            });
        }

        checkBadges() {
            if (this.mgr.gameScore >= 10) this.mgr.unlockBadge('word_scrambler_1', 'Word Scrambler');
        }

        scrambleWord(word) {
            let scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
            // Ensure it's actually scrambled
            if (scrambled === word && word.length > 1) return this.scrambleWord(word);
            return scrambled;
        }

        startTimer() {
            clearInterval(this.timer);
            this.timeLeft = Math.max(8, 18 - this.level);
            this.timerElement.textContent = `Time: ${this.timeLeft}`;
            this.timer = setInterval(() => {
                this.timeLeft--;
                this.timerElement.textContent = `Time: ${this.timeLeft}`;
                if (this.timeLeft <= 0) {
                    clearInterval(this.timer);
                    this.checkAnswer(true);
                }
            }, 1000);
        }

        generateWord() {
            this.mgr.setCharacterExpression('neutral');
            this.answerElement.disabled = false;
            this.submitButton.disabled = false;
            
            // Pick a random word from the large pool
            this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
            const scrambled = this.scrambleWord(this.currentWord);
            this.scrambledWordElement.textContent = scrambled;
            this.answerElement.value = '';
            this.answerElement.focus();
            this.startTimer();
        }

        checkAnswer(isTimeout = false) {
            clearInterval(this.timer);
            const userAnswer = this.answerElement.value.trim().toLowerCase();
            
            if (isTimeout) {
                this.mgr.playSound('incorrect');
                this.mgr.setCharacterExpression('sad');
                this.mgr.showPopup(false, "Time's Up!", `The correct word was "${this.currentWord}".`, () => this.generateWord());
                return;
            }

            if (userAnswer === '') {
                this.answerElement.focus();
                return;
            }

            this.answerElement.disabled = true;
            this.submitButton.disabled = true;

            if (userAnswer === this.currentWord) {
                this.mgr.playSound('correct');
                this.mgr.setCharacterExpression('happy');
                this.mgr.addScore(1);
                this.mgr.addStar(1);
                this.mgr.showPopup(true, 'Correct!', `You unscrambled it! "${this.currentWord}" is right.`, () => this.generateWord());
                
                if (this.mgr.gameScore > 0 && this.mgr.gameScore % 5 === 0) {
                    this.level++;
                    if (this.levelElement) this.levelElement.textContent = `Level: ${this.level}`;
                }
                this.checkBadges();
            } else {
                this.mgr.playSound('incorrect');
                this.mgr.setCharacterExpression('sad');
                this.mgr.showPopup(false, 'Oops!', `Not quite. The correct word was "${this.currentWord}".`, () => this.generateWord());
            }
        }

        start() {
            this.level = 1;
            if (this.levelElement) this.levelElement.textContent = `Level: ${this.level}`;
            this.generateWord();
        }
    }

    const game = new WordScrambleGame(window.gameManager);
    game.start();
});