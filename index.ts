//  RECEBER UMA LISTA DE PALAVRAS
const turingMachine = require('./wordlist.json');

function replaceChar(string: string, index: number, replacement: string) {
    return (
        string.slice(0, index) + replacement + string.slice(index + replacement.length)
    );
}

class HangmanGame {
    #keyWord: string;
    #category: string;
    #wordGuessArray = new Array();
    #wordGuess: string;
    #charSet = new Set<string>();

    constructor() {
        this.#keyWord = 'futebol';
        this.#category = 'esportes';
        this.#wordGuess = this.wordGuessToString();
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

    public set wordGuess(wordGuess: string) {
        this.#wordGuess = wordGuess;
    }

    public get wordGuess() { return this.#wordGuess };

    public set category(category: string) {
        this.#category = category;
    }

    public get category() { return this.#category };

    public set keyWord(keyWord: string) {
        this.#keyWord = keyWord;
    }


    public get keyWord() { return this.#keyWord };

    // JOGO DA FORCA

    public playGameWithComputer(computer: ComputerPlayer): string {

        // Criando um Array com possíveis guesss
        if (turingMachine.hasOwnProperty(this.category)) {
            for (const word of turingMachine[this.category]) {
                if (word.length == this.keyWord.length) {
                    for (const letra of word) {
                        if (letra != ' ') {
                            this.#charSet.add(letra);
                        }
                    }
                }
            }
        }
        else {
            throw new Error('Categoria inválida');
        }

        const guessLetters = Array.from(this.#charSet);

        while (guessLetters.length > 0 && computer._hp != 0 && this.#wordGuess != this.keyWord) {
            function computerPlay(letras: string[]) {
                const max = letras.length;
                const indice = Math.floor(Math.random() * max);
                return letras[indice];
            }
            const guess = computerPlay(guessLetters);
            guessLetters.splice(guessLetters.indexOf(guess), 1);
            let occour = false;
            for (let i = 0; i < this.keyWord.length; i++) {
                if (this.keyWord[i] == guess) {
                    this.wordGuess = replaceChar(this.wordGuess, i, guess);
                    occour = true;
                }
            }
            if (!occour) computer._hp--;
        }

        return this.wordGuess == this.keyWord ? `${this.wordGuess}` : `${this.keyWord}`;
    }
}

class ComputerPlayer {
    _hp: number;

    constructor(hp = 6) {
        this._hp = hp;
    }
}

const newGame = new HangmanGame();
const turing = new ComputerPlayer();

console.log(newGame.playGameWithComputer(turing));