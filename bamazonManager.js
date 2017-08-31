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
    console.log("Connected as ID: " + connection.threadId);
    inquirer.prompt([{
	type: 'list',
	name: 'actionSel',
	choices: ['View Inventory', 'View Low Inventory', 'Add To Inventory', 'Add New Item'],
	message: 'What would you like te do?'
    }]).then(function(answers) {
	doStuff(answers);
       });
});

function doStuff(answers) {
	console.log(answers);
	if (answers.actionSel == 'View Inventory') showInventory();
	else if (answers.actionSel == 'View Low Inventory') lowInventory();
	else if (answers.actionSel == 'Add To Inventory') addTo();
	else if (answers.actionSel == 'Add New Item') newItem();
}

function showInventory() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		console.table(res);
        connection.end();
	});
}

function lowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 100", function(err, res) {
		if (err) throw err;
        connection.end();
	});
}

function addTo() {
	connection.query("SELECT product_name FROM products", function(err, res) {
		if (err) throw err;
		var products = [];
		for (i = 0; i < res.length; i++) {
			products.push(res[i].product_name);
        }
		inquirer.prompt([{
			type: 'list',
			name: 'productSel',
			choices: products,
			message: 'To which product would you like to add stock?'
			},
			{
			type: 'input',
			name: 'quantitySel',
			message: 'How much?',
            validate: function(value) {
                if (isNaN(value)) return false;
                else return true;
            }
			}]).then(function(answers) {
				connection.query("SELECT stock_quantity FROM products WHERE product_name = ?", answers.productSel, function(err, res) {
				if (err) throw err;
				var amount = res[0].stock_quantity;
				var newAmount = amount + parseInt(answers.quantitySel);
				connection.query("UPDATE products SET stock_quantity = ? WHERE product_name = ?", [newAmount, answers.productSel], function(err, res) {
					if (err) throw err;
					console.log("Added " + parseFloat(answers.quantitySel).toFixed(0) + " units of " + answers.productSel + ", the new total is: " + newAmount + ".");
                    connection.end();
				});
			});
		});
	});
}

function newItem() {
    var departmentExists = false;
	inquirer.prompt([{
		type: 'input',
		name: 'newProduct',
		message: 'Name of product: '
	},
	{
		type: 'input',
		name: 'newQuantity',
		message: 'How many do you want to stock?',
        validate: function(value) {
            if (isNaN(value)) return false;
            else return true;
        }
	},
	{
		type: 'input',
		name: 'newPrice',
		message: 'What do you want to charge?',
        validate: function(value) {
            if (isNaN(value)) return false;
            else return true;
        }
	},
	{
		type: 'input',
		name: 'newDepartment',
		message: 'Stock in which department?'
	}]).then(function(answers) {
        connection.query("SELECT department_name FROM departments", function(err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                if (res[i].department_name  == answers.newDepartment) departmentExists = true;
                else if (i == res.length) departmentExists = false;
            }
            if (departmentExists == false) {
                console.log("No such department");
                connection.end();
                return 1;
            }
            connection.query("SELECT product_name FROM products", function(err, res){
                for (i = 0; i < res.length; i++) {
                    if (res[i].product_name == answers.newProduct) {
                        console.log("Item already exists");
                        connection.end();
                        return 2;
                    }
                }
		        connection.query("INSERT INTO products(product_name, stock_quantity, price, department_name, product_sales) VALUES(?, ?, ?, ?, 0.00)", [answers.newProduct, answers.newQuantity, answers.newPrice, answers.newDepartment], function(err, res) {
	        if (err) throw err;
	        console.log("Added " + answers.newProduct + " to " + answers.newDepartment + ". Can sell " + parseFloat(answers.newQuantity).toFixed(0) + " for $" + answers.newPrice + " each.");
                    connection.end();
		        });
	        });
        });
    });
}
