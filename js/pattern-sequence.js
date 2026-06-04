document.addEventListener('DOMContentLoaded', () => {
    class PatternGame {
        constructor(manager) {
            this.mgr = manager;
            
            this.patternElement = document.getElementById('pattern');
            this.optionsElement = document.getElementById('options');
            this.levelElement = document.getElementById('level');
            this.timerElement = document.getElementById('timer');

            this.patterns = {
                1: [
                    { sequence: ['A', 'B', 'A', 'B'], options: ['A', 'B', 'C'], answer: 'A' },
                    { sequence: [1, 2, 1, 2], options: [1, 2, 3], answer: 1 },
                    { sequence: ['🍎', '🍌', '🍎', '🍌'], options: ['🍎', '🍌', '🍇'], answer: '🍎' },
                    { sequence: ['Red', 'Blue', 'Red', 'Blue'], options: ['Red', 'Blue', 'Green'], answer: 'Red' },
                    { sequence: ['Sun', 'Moon', 'Sun', 'Moon'], options: ['Sun', 'Moon', 'Star'], answer: 'Sun' },
                    { sequence: ['Up', 'Down', 'Up', 'Down'], options: ['Up', 'Down', 'Left'], answer: 'Up' }
                ],
                2: [
                    { sequence: [1, 2, 3, 1, 2], options: [1, 2, 3], answer: 3 },
                    { sequence: ['A', 'B', 'C', 'A', 'B'], options: ['A', 'B', 'C'], answer: 'C' },
                    { sequence: ['🐶', '🐱', '🐭', '🐶', '🐱'], options: ['🐶', '🐱', '🐭'], answer: '🐭' },
                    { sequence: [10, 20, 30, 10, 20], options: [30, 40, 50], answer: 30 },
                    { sequence: ['Mon', 'Tue', 'Wed', 'Mon', 'Tue'], options: ['Wed', 'Thu', 'Fri'], answer: 'Wed' },
                    { sequence: ['Red', 'Yellow', 'Green', 'Red', 'Yellow'], options: ['Green', 'Blue', 'Pink'], answer: 'Green' }
                ],
                3: [
                    { sequence: [1, 1, 2, 2, 3], options: [1, 2, 3], answer: 3 },
                    { sequence: ['A', 'A', 'B', 'B', 'C'], options: ['A', 'B', 'C'], answer: 'C' },
                    { sequence: ['Big', 'Small', 'Big', 'Small', 'Big'], options: ['Big', 'Small', 'Medium'], answer: 'Small' },
                    { sequence: [2, 4, 6, 8, 10], options: [11, 12, 14], answer: 12 },
                    { sequence: ['A', 'C', 'E', 'G', 'I'], options: ['J', 'K', 'L'], answer: 'K' },
                    { sequence: ['⚽', '🏀', '⚽', '🏀', '⚽'], options: ['🏀', '🎾', '🏐'], answer: '🏀' }
                ],
                4: [
                    { sequence: [5, 10, 15, 20, 25], options: [25, 30, 35], answer: 30 },
                    { sequence: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], options: ['Jun', 'Jul', 'Aug'], answer: 'Jun' },
                    { sequence: ['Red', 'Blue', 'Yellow', 'Red', 'Blue'], options: ['Yellow', 'Green', 'Orange'], answer: 'Yellow' },
                    { sequence: ['Square', 'Circle', 'Triangle', 'Square', 'Circle'], options: ['Triangle', 'Star', 'Diamond'], answer: 'Triangle' },
                    { sequence: [1, 3, 5, 7, 9], options: [10, 11, 13], answer: 11 },
                    { sequence: ['North', 'South', 'East', 'West', 'North'], options: ['South', 'Up', 'Down'], answer: 'South' }
                ]
            };
            
            this.maxLevel = 4;
            this.currentPattern = null;
            this.level = 1;
            this.timer = null;
            this.timeLeft = 10;
        }

        checkBadges() {
            if (this.mgr.gameScore >= 10) this.mgr.unlockBadge('pattern_pro_1', 'Pattern Pro');
        }

        startTimer() {
            clearInterval(this.timer);
            this.timeLeft = 12 - this.level;
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

        generatePattern() {
            this.mgr.setCharacterExpression('neutral');
            const patternList = this.patterns[this.level] || this.patterns[this.maxLevel];
            this.currentPattern = patternList[Math.floor(Math.random() * patternList.length)];
            
            this.patternElement.innerHTML = '';
            const questionText = document.createElement('p');
            questionText.textContent = 'What comes next?';
            questionText.classList.add('sequence-question', 'mb-4', 'text-xl', 'font-bold');

            const track = document.createElement('div');
            track.classList.add('sequence-track', 'flex', 'justify-center', 'gap-4', 'mb-8');
            
            this.currentPattern.sequence.forEach(item => {
                const slot = document.createElement('div');
                slot.classList.add('sequence-slot', 'w-16', 'h-16', 'bg-white', 'border-4', 'border-blue-400', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'text-2xl', 'font-bold', 'shadow-md');
                slot.textContent = item;
                track.appendChild(slot);
            });
            
            const missingSlot = document.createElement('div');
            missingSlot.classList.add('sequence-slot', 'missing', 'w-16', 'h-16', 'bg-yellow-100', 'border-4', 'border-dashed', 'border-yellow-400', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'text-2xl', 'font-bold', 'text-yellow-600');
            missingSlot.textContent = '?';
            track.appendChild(missingSlot);

            this.patternElement.appendChild(questionText);
            this.patternElement.appendChild(track);

            this.optionsElement.innerHTML = '';
            this.optionsElement.classList.add('option-grid', 'flex', 'justify-center', 'gap-4');
            this.currentPattern.options.forEach(option => {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = option;
                button.classList.add('option-card', 'primary-btn', 'px-8', 'py-4');
                button.addEventListener('click', () => {
                    this.mgr.playSound('click');
                    this.checkAnswer(option);
                });
                this.optionsElement.appendChild(button);
            });

            this.startTimer();
        }

        checkAnswer(selectedOption) {
            clearInterval(this.timer);
            this.optionsElement.querySelectorAll('.option-card').forEach(btn => btn.disabled = true);

            if (selectedOption === this.currentPattern.answer) {
                this.mgr.playSound('correct');
                this.mgr.setCharacterExpression('happy');
                this.mgr.addScore(1);
                this.mgr.addStar(1);
                this.mgr.showPopup(true, 'Correct!', 'You figured out the pattern!', () => this.generatePattern());
                
                if (this.mgr.gameScore > 0 && this.mgr.gameScore % 5 === 0 && this.level < this.maxLevel) {
                    this.level++;
                    if (this.levelElement) this.levelElement.textContent = `Level: ${this.level}`;
                }
                this.checkBadges();
            } else {
                this.mgr.playSound('incorrect');
                this.mgr.setCharacterExpression('sad');
                const msg = selectedOption === null ? "Time's Up!" : "Not Quite!";
                this.mgr.showPopup(false, msg, `The answer was ${this.currentPattern.answer}.`, () => this.generatePattern());
            }
        }

        start() {
            this.level = 1;
            if (this.levelElement) this.levelElement.textContent = `Level: ${this.level}`;
            this.generatePattern();
        }
    }

    const game = new PatternGame(window.gameManager);
    game.start();
});