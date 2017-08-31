var inquirer = require('inquirer');
var mysql = require("mysql");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "BamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    inquirer.prompt([{
        type: 'list',
        name: 'actionSel',
        message: 'What would you like to do?',
        choices: ['View Product Sales by Department', 'Create New Department']
    }]).then(function(answers) {
        doStuff(answers);
    });
});

function doStuff(answers) {
    if (answers.actionSel == 'View Product Sales by Department') viewSales();
    else if (answers.actionSel == 'Create New Department') createDepartment();
}

function viewSales() {
    connection.query("SELECT products.department_name, SUM(products.product_sales) AS total_sales, departments.* FROM products JOIN departments ON departments.department_name = products.department_name GROUP BY departments.department_name, departments.department_id", function(err, res) {
        for (i = 0; i < res.length; i++) {
            var totalProfit = res[i].total_sales - res[i].over_head_costs;
            var pid = res[i].department_id;
            var pname = res[i].department_name;
            var pcosts = res[i].over_head_costs;
            var psales = res[i].total_sales;
            console.table([{
                department_id: pid,
                department_name: pname,
                over_head_costs: "$" + pcosts,
                total_sales: "$" + psales,
                total_profit: "$" + totalProfit
            }]);
            console.log("---------------------------------------------------------------------------------------------\n");
        }
        connection.end();
    });
}

function createDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'nameSel',
        message: 'Name the new department: '
    },
    {
        type: 'input',
        name: 'overheadSel',
        message: 'How much are overhead costs for this department?'
    }]).then(function(answers){
        connection.query("INSERT INTO departments(department_name, over_head_costs) VALUES(?, ?)", [answers.nameSel, answers.overheadSel], function(err, res) {
            if (err) throw err;
            console.log("Added department: " + answers.nameSel + " with an over head cost of $" + answers.overheadSel);
            connection.end();
        });
    });
}
