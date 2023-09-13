//  RECEBER UMA LISTA DE PALAVRAS
const turingMachine = require('./wordlist.json');
const readline = require('readline');
const input = require('prompt-sync')();

//console.log(turingMachine['esportes'].length);

//return Object.keys(turingMachine)[indice];

class HangmanGame {
    #keyWord: string;
    #category: string;
    #wordGuessArray = new Array();
    #charSet = new Set<string>();

    constructor() {
        this.#category = this.randomIndexCategory(turingMachine);
        this.#keyWord = this.randomIndexKeyword(turingMachine);
    }

    public randomIndexCategory(turingMachine: any) {
        const max = Object.keys(turingMachine).length;
        const indice = Math.floor(Math.random() * max);
        return Object.keys(turingMachine)[indice];
    }
    public randomIndexKeyword(turingMachine: any) {
        const max = turingMachine[this.category].length;
        const indice = Math.floor(Math.random() * max);
        return turingMachine[this.category][indice];
    }
    public wordGuessToString(): string {
        for (let i = 0; i < this.#keyWord.length; i++) {
            if (this.#keyWord[i] == ' ') {
                this.#wordGuessArray[i] = ' ';
            }
            else {
                this.#wordGuessArray[i] = 0;
            }
        }

        return this.#wordGuessArray.join('');
    }

    public set category(category: string) {
        this.#category = category;
    }

    public get category() { return this.#category };

    public set keyWord(keyWord: string) {
        this.#keyWord = keyWord;
    }

    public get keyWord() { return this.#keyWord };

    // JOGO DA FORCA

    public generateScoreboard(player1: HumanPlayer, player2: ComputerPlayer | HumanPlayer, category: string): void {
        console.log('----------------------------');
        console.log('|----P--L--A--C--A--R-----');
        console.log('|--------------------------');
        console.log(`|  CATEGORIA: ${category}`);
        console.log('|--------------------------');
        console.log(`|  JOGADOR 1 (HUMANO): ${player1._hp}`);
        console.log(`|  ${player1.wordGuess}`);
        console.log(`|  JOGADOR 2 (COMPUTADOR): ${player2._hp}`);
        console.log(`|  ${player2.wordGuess}`);
        console.log('|--------------------------');
        console.log(player1._score > player2._score ? `|    JOGADOR 1 GANHOU!` : (player1._score == player2._score) ? '| EMPATE!' : '|   JOGADOR 2 GANHOU!');
        console.log('|--------------------------');
    }

    public playGameWithComputer(computer: ComputerPlayer, human: HumanPlayer): void {
        computer.wordGuess = this.wordGuessToString();
        human.wordGuess = this.wordGuessToString();
        const guessLetters = computer.generateWords(this.category, this.keyWord, this.#charSet);
        while ((guessLetters.length > 0 && computer._hp != 0 && computer.wordGuess != this.keyWord)) {
            const guess = computer.computerChooseLetter(guessLetters);
            guessLetters.splice(guessLetters.indexOf(guess), 1);
            let occour = false;
            for (let i = 0; i < this.keyWord.length; i++) {
                if (this.keyWord[i] == guess) {
                    computer.wordGuess = replaceChar(computer.wordGuess, i, guess);
                    occour = true;
                    computer._score++;
                }
            }
            if (!occour) computer._hp--;


        }
        while ((human._hp != 0 && human.wordGuess != this.keyWord)) {
            console.log(`CATEGORIA: ${this.category}\n`);
            console.log(`NÚMERO DE LETRAS: ${this.keyWord.length}\n`);
            console.log(`TENTATIVA RESTANTES: ${human._hp}\n`);
            const guessPlayer = input('Qual o seu palpite: ')[0];
            let occour = false;
            for (let i = 0; i < this.keyWord.length; i++) {
                if (this.keyWord[i] == guessPlayer) {
                    human.wordGuess = replaceChar(human.wordGuess, i, guessPlayer);
                    occour = true;
                    human._score++;
                }
            }
            if (!occour) human._hp--;

            console.log(`${human.wordGuess}\n`);
        }
        return this.generateScoreboard(human, computer, this.category);

        function replaceChar(string: string, index: number, replacement: string) {
            return (
                string.slice(0, index) + replacement + string.slice(index + replacement.length)
            );
        }
    }
}

class Player {
    _hp: number;
    _score: number;
    #wordGuess: string;
    constructor(hp = 6, wordGuess: string, score = 0) {
        this._hp = hp;
        this.#wordGuess = wordGuess;
        this._score = score;
    }

    public set wordGuess(wordGuess: string) {
        this.#wordGuess = wordGuess;
    }

    public get wordGuess() { return this.#wordGuess };

}


class HumanPlayer extends Player {
    public playerInputGuessWord() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        function value(answer: string) {
            let wordGuess;
            wordGuess = answer;
            console.log(wordGuess);
        }
    }
}



class ComputerPlayer extends Player {
    public generateWords(category: string, keyWord: string, charSet: Set<string>): string[] {
        // Criando um Array com possíveis guesss
        if (turingMachine.hasOwnProperty(category)) {
            for (const word of turingMachine[category]) {
                if (word.length == keyWord.length) {
                    for (const letra of word) {
                        if (letra != ' ') {
                            charSet.add(letra);
                        }
                    }
                }
            }
        }
        else {
            throw new Error('Categoria inválida');
        }

        return Array.from(charSet);
    }
    public computerChooseLetter(letras: string[]) {
        const max = letras.length;
        const indice = Math.floor(Math.random() * max);
        return letras[indice];
    }


}
const newGame = new HangmanGame();
const turing = new ComputerPlayer(undefined, '');
const player = new HumanPlayer(undefined, '');

newGame.playGameWithComputer(turing, player);