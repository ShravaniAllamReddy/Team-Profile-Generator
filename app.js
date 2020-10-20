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

//Used inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function userInput() {
    question = [{
        type: "input",
        name: "name",
        message: "What is your name?"
    },
    {
        type: "input",
        name: "id",
        message: "What is your employee id?"
    },
    {
        type: "input",
        name: "email",
        message: "What is your email id?"
    }]
    inquirer.prompt(employee).then(response => {

        if (response.Employeetype === "Engineer") {
            question.push({
                type: "input",
                name: "github",
                message: "What is your github username?"
            })
            inquirer
                .prompt(question)
                .then(engineer => {
                    const newengineer = new Engineer(engineer.id, engineer.name, engineer.email, engineer.github);
                    teamArray.push(newengineer);
                    addEmployee();
                })
        }
        else if (response.Employeetype === "Intern") {
            question.push({
                type: "input",
                name: "school",
                message: "What is your School name?"
            })
            inquirer
                .prompt(question)
                .then(intern => {
                    const newintern = new Intern(intern.id, intern.name, intern.email, intern.school);
                    teamArray.push(newintern);
                    addEmployee();
                })
        }

        else if (response.Employeetype === "Manager") {
            question.push({
                type: "input",
                name: "officenumber",
                message: "What is your office number?"
            })
            inquirer
                .prompt(question)
                .then(manager => {
                    const newmanager = new Manager(manager.id, manager.name, manager.email, manager.officenumber);
                    teamArray.push(newmanager);
                    addEmployee();
                })
        }
    })
}

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

function addEmployee() {
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "choice",
                message: "would you like to add new employees?"
            }
        ])
        .then(confirmAddemployee => {

            if (confirmAddemployee.choice) {
                userInput();
            }
            else {
                writeToHtml();
            }

        });
}

addEmployee();





// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

