const mysql = require('mysql');
const inquirer = require('inquirer');

const command = process.argv[2];
// console.log(command);


const databaseCredentials = {
  user: 'root',
  password: '',
  database: 'first_sql',
  host: 'localhost',
  port: 3306
};

const databaseString =  "mysql://root:@localhost:3306/first_sql"
// console.log(databaseString);
const databaseConnection = mysql.createConnection(databaseString);
let readAll = "SELECT * FROM sesameStreet";

databaseConnection.connect();

inquirer.prompt([
  {
    type: "list",
    message: "What operation would you like to perform?",
    choices: ['Create', 'Read', 'Update', 'Delete'],
    name: "operation"
  }
]).then(function(answers){
  if(answers.operation == 'Create'){
      console.log("Creating")
      inquirer.prompt([
        {
          type: "input",
          message: "Please add a Sesame Street character's Name",
          name: "puppetName"
        },
        {
          type: "input",
          message: "Please add character Species",
          name: "species"
        },
        {
          type: "input",
          message: "Please input chatacter's Demeanor",
          name: "demeanor"
        }
      ]).then(function(answers){
        // console.log(answers)
        let name = answers.puppetName;
        let species = answers.species;
        let demeanor = answers.demeanor;

        let databaseUpdate = "INSERT INTO sesameStreet (puppetName, species, demeanor) VALUES ('"+name+"', '"+species+"', '"+demeanor+"')";
        databaseConnection.query(databaseUpdate, function(err, data){
          try{
            if(err){
              throw new Error(err)
            }
            console.log("Success");
          }catch (e){
            console.log("Error")
            console.log(e)
          }finally{
            databaseConnection.end();
          }
        })
      });
  }else if(answers.operation == 'Read'){
    inquirer.prompt([
      {
        type: "list",
        message: "Would you like to read Data?",
        choices: ["yes", "no"],
        name: "confirm"
      }
    ]).then(function(answers){
      if(answers.confirm == "yes"){
        try{
          databaseConnection.query(readAll, function(err, data){
            if(err){
              throw new Error(err)
            }
            console.log("Success")
            console.log(data)
          })
        }catch (e){
          console.log("Error")
          console.log(e);
        }finally{
          databaseConnection.end();
        }
      }else if (answers.confirm == "no"){
        console.log("Ok")
        databaseConnection.end();
      }
    })
  }else if(answers.operation == 'Update'){
    databaseConnection.query(readAll, function(err, data){
      if(err){
        throw new Error(err)
      }
      let updateChoices = data.map((result) => result.puppetName)

      inquirer.prompt([
        {
          type: "list",
          message: "Select character to update",
          choices: updateChoices,
          name: "puppet_name"
        },
        {
          type: "list",
          message: "Which column would you like to update?",
          choices: ["puppetName", "Species", "Demeaonor"],
          name: "updates"
        },
        {
          type: "input",
          message: "Enter new value",
          name: "new_value"
        }
      ]).then(function(answers){
        try{
          let updateQuery = "UPDATE sesameStreet SET "+answers.updates+ "='" +answers.new_value+ "' WHERE puppetName = '"+answers.puppet_name+"'"
          databaseConnection.query(updateQuery, function(err, data){

            if(err){
              throw new Error(err)
            }
            console.log("Success");
            console.log(data);
          })
        }catch (e){
          console.log("Error");
          console.log(e);
        }finally{
          databaseConnection.end();
        }
      })
    })
  }else if(answers.operation == 'Delete'){
    let deleteQuery = "DELETE FROM sesameStreet WHERE puppetName=";
    databaseConnection.query(readAll, function(err, data){
      try{
        if(err){
          throw new Error(err);
        }
        let deleteOptions = data.map((sesameStreet) => sesameStreet.puppetName)
        inquirer.prompt([
          {
            type: "list",
            message: "Which character would you like to delete?",
            choices: deleteOptions,
            name: "delete_choice"
          }
        ]).then(function(answers){
          deleteQuery += "'"+answers.delete_choice+"'";
          try {
            databaseConnection.query(deleteQuery, function(deleteErr, deleteData){
              if(deleteErr){
                throw new Error(deleteErr);
              }
              console.log("Bye-bye");
            });
          }catch (e){
            console.log("ERROR");
            console.log(e);
          }finally{
            databaseConnection.end();
          }
        })
      }catch (e){
        console.log("Error");
        console.log(e);
      }
    })
  }else{
    console.log("Please Select an Option");
  }
})
