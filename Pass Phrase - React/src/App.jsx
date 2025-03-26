import { useState, useEffect } from 'react';
import {
  specialChars,
  nums,
  twoLetterWords,
  twoLetterWordsCaps,
  threeLetterWords,
  threeLetterWordsCaps,
  fourLetterWords,
  fourLetterWordsCaps,
  fiveLetterWords,
  fiveLetterWordsCaps,
  sixLetterWords,
  sixLetterWordsCaps,
  sevenLetterWords,
  sevenLetterWordsCaps,
  eightLetterWords,
  eightLetterWordsCaps,
  nineLetterWords,
  nineLetterWordsCaps
} from "./Words.js";

function App() {
  const [length, setLength] = useState(8);
  const [numbers, setNumbersAllowed] = useState(false);
  const [chars, setCharsAllowed] = useState(false);
  const [upperCase, setUpperCaseAllowed] = useState(false);
  const [string, setString] = useState("");

  function returnWord(words) {
    let index = Math.floor(Math.random() * words.length);
    return words[index];
  }

  function returnNumbers(value) {
    let num = "";
    for (let i = 0; i < value; i++) {
      let index = Math.floor(Math.random() * nums.length);
      num += nums[index];
    }
    return num;
  }

  function getWordsList(wordLength, upperCase) {
    if (wordLength === 2) return upperCase ? twoLetterWordsCaps : twoLetterWords;
    if (wordLength === 3) return upperCase ? threeLetterWordsCaps : threeLetterWords;
    if (wordLength === 4) return upperCase ? fourLetterWordsCaps : fourLetterWords;
    if (wordLength === 5) return upperCase ? fiveLetterWordsCaps : fiveLetterWords;
    if (wordLength === 6) return upperCase ? sixLetterWordsCaps : sixLetterWords;
    if (wordLength === 7) return upperCase ? sevenLetterWordsCaps : sevenLetterWords;
    if (wordLength === 8) return upperCase ? eightLetterWordsCaps : eightLetterWords;
    return upperCase ? nineLetterWordsCaps : nineLetterWords;
  }

  function generatePassword() {
    // Use a local variable to track remaining characters to be filled
    let remaining = Number(length);
    let password = "";
    let numberString = "";
    let spChar = "";
    let specialAdded = false;
    let numberAdded = false;

    // Loop until we've filled the required length
    while (remaining > 0) {
      // Add special character if enabled and not added yet
      if (chars && !specialAdded && remaining > 0) {
        let i = Math.floor(Math.random() * specialChars.length);
        spChar = specialChars[i];
        specialAdded = true;
        remaining--; // reduce the remaining count
      }

      // Add number string if enabled and not added yet, ensuring we leave room for a word (min 2 chars)
      if (numbers && !numberAdded && remaining > 2) {
        // Ensure we leave at least 2 characters for a word.
        let maxNumLength = remaining - 2;
        let numLength = Math.floor(Math.random() * maxNumLength) + 1;
        numberString = returnNumbers(numLength);
        numberAdded = true;
        remaining -= numLength;
      }

      // If remaining is 1, get a two-letter word and trim it to 1 char.
      let wordLength = remaining === 1 ? 2 : remaining;
      let words = getWordsList(wordLength, upperCase);
      let word = returnWord(words);
      // If the chosen word is longer than remaining (or we purposely chose 2 for a 1-char gap), trim it.
      if (word.length > remaining) {
        word = word.slice(0, remaining);
      }
      password += word;
      remaining -= word.length;
    }

    // Place the special character and number string at either the beginning or end randomly
    let choiceForSpecialChar = Math.round(Math.random());
    if (choiceForSpecialChar === 0) {
      password = `${spChar}${password}${numberString}`;
    } else {
      password = `${password}${spChar}${numberString}`;
    }

    setString(password);
  }

  useEffect(() => {
    generatePassword();
  }, [length, numbers, chars, upperCase]); // Trigger password generation when these values change

  // Function to copy the generated password to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(string);
    alert("Password copied to clipboard!");
  };

  return (
    <div className='bg-black h-screen flex flex-col items-center justify-center'>
      <h1 className='text-white text-center my-6 text-3xl'>Pass Phrase</h1>
      
      <div className='flex shadow rounded-lg overflow-hidden mb-5 w-80'>
        <input 
          type="text" 
          value={string} 
          className='outline-none w-full py-1 px-3' 
          placeholder='Generated String' 
          readOnly 
        />
        <button 
          onClick={copyToClipboard}
          className='outline-none bg-blue-700 hover:bg-blue-900 text-white px-3 py-0.5 shrink-0'>
          Copy
        </button>
      </div>
      
      <div className='flex text-sm gap-x-2'>
        {/* Range input for length */}
        <div className='flex items-center gap-x-1'>
          <input
            type="range"
            min={6}
            max={50}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))} 
          />
          <label className='text-white'>Length: {length}</label>
        </div>

        {/* Checkbox for including numbers */}
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            checked={numbers}
            id="numberInput"
            onChange={() => setNumbersAllowed(prev => !prev)}
          />
          <label htmlFor="numberInput" className='text-white'>Numbers</label>
        </div>

        {/* Checkbox for including special characters */}
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            checked={chars}
            id="characterInput"
            onChange={() => setCharsAllowed(prev => !prev)}
          />
          <label htmlFor="characterInput" className='text-white'>Characters</label>
        </div>

        {/* Checkbox for including Upper Case Alphabets */}
        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            checked={upperCase}
            id="upperCase"
            onChange={() => setUpperCaseAllowed(prev => !prev)}
          />
          <label htmlFor="upperCase" className='text-white'>Upper Case</label>
        </div>
      </div>
    </div>
  );
}

export default App;
