const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function extractWords(input) {
  return input.filter((item) => isNaN(item));
}

function extractNumbers(input) {
  return input.filter((item) => !isNaN(item));
}

function sortAlphabetically(input) {
  return input.sort();
}

function sortNumbersAscending(input) {
  return input.sort((a, b) => a - b);
}

function sortNumbersDescending(input) {
  return input.sort((a, b) => b - a);
}

function sortByWordLength(input) {
  return input.sort((a, b) => a.length - b.length);
}

function filterUniqueWords(input) {
  return [...new Set(input)];
}

function filterUniqueValues(input) {
  return [...new Set(input)];
}

const options = {
  '1': (input) => sortAlphabetically(extractWords(input)),
  '2': (input) => sortNumbersAscending(extractNumbers(input)),
  '3': (input) => sortNumbersDescending(extractNumbers(input)),
  '4': (input) => sortByWordLength(extractWords(input)),
  '5': (input) => filterUniqueWords(extractWords(input)),
  '6': (input) => filterUniqueValues(input),
};

function processInput(input, option) {
  const selectedOption = options[option];
  if (selectedOption) {
    try {
      const result = selectedOption(input);
      console.log(result.join(' '));
    } catch (error) {
      console.log('An error occurred while processing the input.');
      console.log(error.message);
    }
  } else {
    console.log('Invalid option');
  }
}

function startProgram() {
  rl.question('Enter words or numbers separated by a space (or type "exit" to quit): ', (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    const dataArray = input.split(' ');
    rl.question(`How would you like to sort the input?\n
      1. Sort words alphabetically
      2. Show numbers from lesser to greater
      3. Show numbers from bigger to smaller
      4. Display words in ascending order by number of letters in the word
      5. Show only unique words
      6. Display only unique values from the set of words and numbers entered by the user\n
      Enter your option: `, (option) => {
      try {
        if (!Object.keys(options).includes(option)) {
          throw new Error('Invalid option');
        }
        processInput(dataArray, option);
      } catch (error) {
        console.log('An error occurred while processing the input.');
        console.log(error.message);
      } finally {
        startProgram();
      }
    });
  });
}

startProgram();
