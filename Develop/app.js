const createClient = require('./src/server.ts');
const { prompt } = ('inquirer');

const dbClient = createClient({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'DB_PASSWORD',
  database: 'manager_database_db'
});

dbClient.connect((err) => {
  if (err) throw err;
  console.log('Connected to database successfully!');
  startPrompt();
});


const startPrompt = () => {
  prompt([
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
        'Update an employee role',
        'Quit',
      ]
    }
  ]).then(((answers) => {
    switch (answers.action) {
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
      case "Exit":
        dbClient.end();
        console.log('You have now exited the database');
        break;

    }
  }))
  .catch((err) => {
    console.error(err)
  });

  //View all employees
  const viewAllEmployees = () => {
    dbClient.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;', (err, res) => {
      if (err) throw err;
      console.table(res.rows);
      startPrompt();
    });
  };
  //View all roles
  const viewAllRoles = () => {
    connection.query('SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;', (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
    })
  }
  //View all departments
  const viewAllDepartments = () => {
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
  const addEmployee = () => {
    prompt([
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
    ]).then((answers) => {
      const { first_name, last_name, role_id, manager_id } = answers;
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
    const values = [first_name, last_name, role_id, manager_id || null];

    dbClient.query(query, values, (err, res) => {
      if (err) throw err;
      console.log('Employee added successfully!');
      startPrompt();
    });
  });
};
  //Update Employee
  const updateEmployee = () => {
    connection.query('SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;', (err, res) => {
      if (err) throw err;
      console.log(res);
      prompt([
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
  const addRole = () => {
    connection.query('SELECT role.title AS Title, role.salary AS Salary FROM role', (err, res) => {
      prompt([
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
  const addDepartment = () => {
    prompt([
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
}


