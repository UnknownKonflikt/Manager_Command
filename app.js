const pg = require('pg');
const inquirer = require('inquirer');

const client = newClient({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Kasper303',
  database: 'manager_database_db'
});

client.connect((err) => {
  if (err) throw err;
  console.log('Connected to database successfully!');
  startPrompt();


  function startPrompt() {
    inquirer.prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role'
          'Quit'
        ]
      }
    ]).then(((val) => {
      switch (val.choice) {
        case "View All Employees?":
          viewAllEmployees();
          break;

        case "View All Employee's By Roles?":
          viewAllRoles();
          break;
        case "View all Emplyees By Deparments":
          viewAllDepartments();
          break;

        case "Add Employee?":
          addEmployee();
          break;

        case "Update Employee":
          updateEmployee();
          break;

        case "Add Role?":
          addRole();
          break;

        case "Add Department?":
          addDepartment();
          break;
        case "Quit":
          connection.end();
          break;

        default:
          console.log('Invalid choice');
          break;
      }
    }).catch((err) => {
      console.error(err)
    });

    //View all employees
    function viewAllEmployees() {
      connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;', (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
      })
    }
    //View all roles
    function viewAllRoles() {
      connection.query('SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;', (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
      })
    }
    //View all departments
    function viewAllDepartments() {
      connection.query('SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;', (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
      })
    }
    //Select role title for Add Employee
    var roleArr = [];
    function selectRole() {
      connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          roleArr.push(res[i].title);
        }
      })
      return roleArr;
    }
    //Select manager for Add Employee
    var managersArr = [];
    function selectManager() {
      connection.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          managersArr.push(res[i].first_name);
        }
      })
      return managersArr;
    }
    //Add Employee
    function addEmployee() {
      inquirer.prompt([
        {
          name: 'firstName',
          type: 'input',
          message: "Enter employee's first name: ",
        },
        {
          name: 'lastName',
          type: 'input',
          message: "Enter employee's last name: ",
        },
        {
          name: 'role',
          type: 'list',
          message: "What is the employee's role?",
          choices: selectRole()
        },
        {
          name: 'manager',
          type: 'list',
          message: "Who is the employee's manager?",
          choices: selectManager()
        }
      ]).then((val) => {
        var roleId = selectRole().indexOf(val.role) + 1
        var managerId = selectManager().indexOf(val.manager) + 1
        connection.query('INSERT INTO employee SET ?',
          {
            first_name: val.firstName,
            last_name: val.lastName,
            manager_id: managerId,
            role_id: roleId,
          }, (err) => {
            if (err) throw err;
            console.table(val);
            startPrompt();
          })
      })
    }
    //Update Employee
    function updateEmployee() {
      connection.query('SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;', (err, res) => {
        if (err) throw err;
        console.log(res);
        inquirer.prompt([
          {
            name: 'lastName',
            type: 'rawlist',
            choices: function () {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the employee's last name? ",
          },
          {
            name: 'role',
            type: 'rawlist',
            message: "What is the new role?",
            choices: selectRole()
          },
        ]).then((val) => {
          var roleId = selectRole().indexOf(val.role) + 1
          connection.query('UPDATE employee SET WHERE ?',
            {
              last_name: val.lastName
            },
            {
              role_id: roleId
            }, (err) => {
              if (err) throw err;
              console.table(val);
              startPrompt();
            })
        });
      });
    }
    //Add Role
    function addRole() {
      connection.query('SELECT role.title AS Title, role.salary AS Salary FROM role', (err, res) => {
        inquirer.prompt([
          {
            name: 'Title',
            type: 'input',
            message: 'What is the role title?'
          },
          {
            name: 'Salary',
            type: 'input',
            message: 'What is the salary?'
          }
        ]).then((res) => {
          connection.query(
            'INSERT INTO role SET ?',
            {
              title: res.Title,
              salary: res.Salary,
            },
            (err) => {
              if (err) throw err;
              console.table(res);
              startPrompt();
            }
          )
        })
      })
    }
    //Add Department
    function addDepartment() {
      inquirer.prompt([
        {
          name: 'name',
          type: 'input',
          message: 'What department would you like to add?'
        }
      ]).then((res) => {
        var query = connection.query(
          'INSERT INTO department SET ?',
          {
            name: res.name,
          },
          (err) => {
            if (err) throw err;
            console.table(res);
            startPrompt();
          }
        )
      })
    }
  });
