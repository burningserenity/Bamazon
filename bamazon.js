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

function buyProduct(answers) {
    var amount = 0;
    var price = 0;
    connection.query("SELECT stock_quantity FROM products WHERE product_name = ?", answers.productSel, function(err, res){
        if (err) throw err;
        amount = res[0].stock_quantity;
        if (amount < answers.quantitySel) {
            console.log("You are trying to buy more " + answers.productSel + " than is in stock.");
            connection.end();
        }
        else {
            var remaining = amount - answers.quantitySel;
            var product = answers.productSel;
            connection.query("SELECT price FROM products WHERE product_name = ?", answers.productSel, function(err, res){
                if (err) throw err;
                price = res[0].price;
                var change = connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: remaining}, {product_name: product}], function(err, res){
                    if (err) throw err;
                    priceTotal = price * answers.quantitySel;
                    console.log("You purchased " + answers.quantitySel + " " + answers.productSel + " at $" + price + " for a total of $" + priceTotal + ".");
                    connection.end();
                });
            });
        }
    });
}

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    connection.query("SELECT item_id, product_name, price, department_name, product_description FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        var productNames = [];
        var questions = [{
            type: 'list',
            name: 'productSel',
            message: "What would you like to buy?",
            choices: productNames

        },
        {
            type: 'input',
            name: 'quantitySel',
            message: 'How many?',
        }];
        for (i = 0; i < res.length; i++) {
            productNames.push(res[i].product_name);
        }
        inquirer.prompt(questions).then(function(answers) {
            buyProduct(answers);
        });
    });
});

