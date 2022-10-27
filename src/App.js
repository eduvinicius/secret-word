// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// Data
import {wordsList} from './data/words';

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id:2, name: "game"},
  {id:3, name: "end"}
];

const guessesQty = 5;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);
 
  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words); // return an array with the keys of wordsList object
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)]; // return a random key 
    
    // pick a random word
    const word = 
      words[category][Math.floor(Math.random() * words[category].length)]; // return a random value from the key
    
    return {word, category};  
  }, [words]);

  const startGame = useCallback(() => {
    setScore(0)
    clearLettersState();
    const {word, category} = pickWordAndCategory();

    let wordLetters = word.split("");
    wordLetters = wordLetters.map((letter) => letter.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name)
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    } 
    
    // push guesses letter or remove a guess
    if (letters.includes(normalizedLetter)) {
        setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters,
          normalizedLetter
        ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);
      
      setGuesses((actualGuesses) => actualGuesses -1);
    }
  };

  const clearLettersState = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states from the app
      clearLettersState();
      setGameStage(stages[2].name);
    }
  }, [guesses])

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      setScore((actualScore) => (actualScore += 100));
      setTimeout(() => {
        startGame()
      }, 1000)
      
    }
  }, [guessedLetters, letters, startGame, gameStage]);

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && ( 
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
