-- Insert departments
INSERT INTO departments (id, name) VALUES
(1, 'Sales'),
(2, 'Engineering'),
(3, 'Human Resources'),
(4, 'Marketing');

-- Insert roles
INSERT INTO roles (id, title, salary, department_id) VALUES
(1, 'Sales Manager', 80000, 1),
(2, 'Sales Associate', 50000, 1),
(3, 'Software Engineer', 90000, 2),
(4, 'DevOps Engineer', 95000, 2),
(5, 'HR Manager', 70000, 3),
(6, 'Recruiter', 60000, 3),
(7, 'Marketing Manager', 75000, 4),
(8, 'Content Creator', 55000, 4);

-- Insert employees
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL), -- Sales Manager
(2, 'Jane', 'Smith', 2, 1), -- Sales Associate, reports to John
(3, 'Alice', 'Johnson', 3, NULL), -- Software Engineer
(4, 'Bob', 'Brown', 4, 3), -- DevOps Engineer, reports to Alice
(5, 'Charlie', 'Davis', 5, NULL), -- HR Manager
(6, 'Eve', 'White', 6, 5), -- Recruiter, reports to Charlie
(7, 'Frank', 'Green', 7, NULL), -- Marketing Manager
(8, 'Grace', 'Harris', 8, 7); -- Content Creator, reports to Frank
