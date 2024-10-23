import dotenv from 'dotenv';
import inquirer from 'inquirer';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

const seedData = [
    { name: 'Engineering' },
    { name: 'Finance' },
    { name: 'Legal' },
    { name: 'Sales' },
];
const insertDepartments = async () => {
    try {
        await pool.connect();
        for (const department of seedData) {
            await pool.query('INSERT INTO department (name) VALUES ($1)', [department.name]);
        }
        console.log('Departments seeded successfully!');
    } catch (err) {
        console.error('Error seeding departments:', err);
    } finally {
        pool.end();
    }
};

insertDepartments();

pool.connect((err) => {
    if (err) throw err;
    console.log('Connected to database successfully!');
    startPrompt();
});

const startPrompt = () => {
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
                'Update an employee role',
                'Quit',
            ],
        },
    ]).then((answers) => {
        switch (answers.choice) {
            case 'View All Employees?':
                viewAllEmployees();
                break;

            case 'View All Employee\'s By Roles?':
                viewAllRoles();
                break;

            case 'View all Emplyees By Deparments':
                viewAllDepartments();
                break;

            case 'Add Employee?':
                addEmployee();
                break;

            case 'Update Employee':
                updateEmployee();
                break;

            case 'Add Role?':
                addRole();
                break;

            case 'Add Department?':
                addDepartment();
                break;

            case 'Quit':
                pool.end();
                break;
            default:
                console.log('Invalid choice');
                break;


        }
    }).catch((err) => {
        console.error('Error:', err);
    });
};

const viewAllEmployees = () => {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startPrompt();
    });
};

const viewAllRoles = () => {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startPrompt();
    });
};

const viewAllDepartments = () => {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startPrompt();
    });
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter their first name',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter their last name',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter their role id',
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter their manager id',
        },
    ]).then((answers: { first_name: string; last_name: string; role_id: string; manager_id: string; }) => {
        pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            startPrompt();
        });
    }).catch((err) => {
        console.error('Error:', err);
    });
};

const updateEmployee = () => {
    let employeeArr: string[] = [];
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.rows.length; i++) {
            let employee_id: string = `${res.rows[i].id} ${res.rows[i].first_name} ${res.rows[i].last_name}`;
            employeeArr.push(employee_id);
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Select an employee to update',
                choices: employeeArr,
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select a new role for the employee',
                choices: ['1', '2', '3', '4'],
            },
        ]).then((answers) => {
            let id = answers.choice.split(' ')[0];
            pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, id], (err) => {
                if (err) throw err;
                console.log('Employee role updated successfully!');
                startPrompt();
            });
        });
    });
};

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the new role',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the new role',
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the department id of the new role',
        },
    ]).then((answers: { title: string; salary: string; department_id: string }) => {
        pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id], (err) => {
            if (err) throw err;
            console.log('Role added successfully!');
            startPrompt();
        });
    }).catch((err) => {
        console.error('Error:', err);
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the new department',
        },
    ]).then((answers: { name: string }) => {
        pool.query('INSERT INTO department (name) VALUES ($1)', [answers.name], (err) => {
            if (err) throw err;
            console.log('Department added successfully!');
            startPrompt();
        });
    }).catch((err) => {
        console.error('Error:', err);
    });
};

startPrompt();





