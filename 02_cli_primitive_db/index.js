const fs = require('fs');
const inquirer = require('inquirer');

const databaseFile = 'users.txt';

function startProgram() {
  addUser();
}

function addUser() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the user (or press ENTER to stop):',
      },
    ])
    .then((answers) => {
      const name = answers.name.trim();
      if (name === '') {
        searchUser();
      } else {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'gender',
              message: 'Choose the gender of the user:',
              choices: ['Male', 'Female'],
            },
            {
              type: 'input',
              name: 'age',
              message: 'Enter the age of the user:',
              validate: function (value) {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a valid age';
              },
            },
          ])
          .then((answers) => {
            const user = {
              name: name,
              gender: answers.gender,
              age: parseInt(answers.age),
            };
            const userString = JSON.stringify(user);
            fs.appendFileSync(databaseFile, userString + '\n');
            console.log('User added successfully.');
            addUser();
          });
      }
    });
}

function searchUser() {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'search',
        message: 'Do you want to search for a user by name?',
      },
    ])
    .then((answers) => {
      if (answers.search) {
        const users = fs.readFileSync(databaseFile, 'utf8').split('\n');
        console.log('User list:');
        const userList = users
          .filter(user => user !== '')
          .map(user => JSON.parse(user));
        console.log(userList);

        inquirer
          .prompt([
            {
              type: 'input',
              name: 'name',
              message: 'Enter the name of the user:',
            },
          ])
          .then((answers) => {
            const name = answers.name.trim().toLowerCase();
            let foundUser = userList.find(
              user => user.name.toLowerCase() === name
            );
            if (foundUser) {
              console.log('User found:');
              console.log(foundUser);
            } else {
              console.log('User not found.');
            }
          });
      } else {
        console.log('Exiting the program.');
      }
    });
}

if (!fs.existsSync(databaseFile)) {
  fs.writeFileSync(databaseFile, '');
}

startProgram();
