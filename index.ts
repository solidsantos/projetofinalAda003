//  RECEBER UMA LISTA DE PALAVRAS
const turingMachine = require('./wordlist.json');

class HangmanGame {
    #keyWord: string;
    #category: string;
    #wordGuessArray = new Array();
    #charSet = new Set<string>();

    constructor() {
        this.#keyWord = 'futebol';
        this.#category = 'esportes';
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

    public playGameWithComputer(computer: ComputerPlayer, human: HumanPlayer): string {
        computer.wordGuess = this.wordGuessToString();
        const guessLetters = computer.generateWords(this.category, this.keyWord, this.#charSet);
        while ((guessLetters.length > 0 && computer._hp != 0 && computer.wordGuess != this.keyWord)){
            const guess = computer.computerChooseLetter(guessLetters);
            guessLetters.splice(guessLetters.indexOf(guess), 1);
            let occour = false;
            for (let i = 0; i < this.keyWord.length; i++) {
                if (this.keyWord[i] == guess) {
                    computer.wordGuess = replaceChar(computer.wordGuess, i, guess);
                    occour = true;
                }
            }
            if (!occour) computer._hp--;
        }

        return computer.wordGuess == this.keyWord ? `${computer.wordGuess}` : `${this.keyWord}`;

        function replaceChar(string: string, index: number, replacement: string) {
            return (
                string.slice(0, index) + replacement + string.slice(index + replacement.length)
            );
        }
    }
}

class Player {
    _hp: number;
    #wordGuess: string;
    constructor(hp = 6, wordGuess: string) {
        this._hp = hp;
        this.#wordGuess = wordGuess;
    }

    public set wordGuess(wordGuess: string) {
        this.#wordGuess = wordGuess;
    }

    public get wordGuess() { return this.#wordGuess };

}


class HumanPlayer extends Player {
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

console.log(newGame.playGameWithComputer(turing, player));