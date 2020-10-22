const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const teamArray = [];
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
let question = [];
const render = require("./lib/htmlRenderer");
const { type } = require("os");
const { resolve } = require("path");
const employee = {
    type: "list",
    message: "Employee",
    name: "Employeetype",
    choices: ["Engineer", "Intern", "Manager"]
};

//function to ask different questions via inquirer depending on employee type.
function userInput() {
    question = [{
        type: "input",
        name: "name",
        message: "What is your name?",
        //user input must be letters 
        validate: val => {
            if (!/^[a-zA-Z]+$/gi.test(val) || val.length === 0) {
                return "Please enter valid name"
            }
            return true;
        }
    },
    {
        type: "input",
        name: "id",
        message: "What is your employee id?",
        // user input must be numbers
        validate: val => {
            if (!/^[0-9]+$/gi.test(val) || val.length === 0) {
                return "Please enter valid number"
            }
            return true;
        },

    },
    {
        type: "input",
        name: "email",
        message: "What is your email?",
        //user input must be anystring@anystring.anystring
        validate: val => {
            if (!(/\S+@\S+\.\S+/gi.test(val)) || val.length === 0) {
                return "Please enter valid email"
            }
            return true;
        }
    }]
    inquirer.prompt(employee).then(response => {

        if (response.Employeetype === "Engineer") {
            question.push({
                type: "input",
                name: "github",
                message: "What is your github username?",
                //user input must be letters 
                validate: val => {
                    if (!/^[a-zA-Z]+$/gi.test(val) || val.length === 0) {
                        return "Please enter valid username"
                    }
                    return true;
                },
            })
            inquirer
                .prompt(question)
                .then(engineer => {
                    const newengineer = new Engineer(engineer.name, engineer.id, engineer.email, engineer.github);
                    teamArray.push(newengineer);
                    addEmployee();
                })
        }
        else if (response.Employeetype === "Intern") {
            question.push({
                type: "input",
                name: "school",
                message: "What is your School name?",
                //user input must be letters 
                validate: val => {
                    if (!/^[a-zA-Z]+$/gi.test(val) || val.length === 0) {
                        return "Please enter valid schoolname"
                    }
                    return true;
                },
            })
            inquirer
                .prompt(question)
                .then(intern => {
                    const newintern = new Intern(intern.name, intern.id, intern.email, intern.school);
                    teamArray.push(newintern);
                    addEmployee();
                })
        }

        else if (response.Employeetype === "Manager") {
            question.push({
                type: "input",
                name: "officenumber",
                message: "What is your office number?",
                // user input must be numbers
                validate: val => {
                    if (!/^[0-9]+$/gi.test(val) || val.length === 0) {
                        return "Please enter valid number"
                    }
                    return true;
                },
            })
            inquirer
                .prompt(question)
                .then(manager => {
                    const newmanager = new Manager(manager.name, manager.id, manager.email, manager.officenumber);
                    teamArray.push(newmanager);
                    addEmployee();
                })
        }
    })
}

//function which generates html from render function
//the `render` function will generate and return a block of HTML including templated divs for each employee!
function writeToHtml() {
    console.log(teamArray);
    const teamHtml = render(teamArray);
    console.log(teamHtml);
    fs.writeFile(outputPath, teamHtml, function (err) {
        if (err) {
            throw err;
        }
        console.log("success");
    })
}

//function which is called recursivly to add more employees
//and team.html is generated after the user has input all employees desired.
function addEmployee() {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "choice",
                message: "would you like to add new employee?"
            }
        ])
        .then(confirmAddemployee => {
            // if user enters yes userInput function is called
            if (confirmAddemployee.choice) {
                userInput();
            }
            //if user enters no, html is generated
            else {
                writeToHtml();
            }

        });
}

//function call to initialise the application
addEmployee();



