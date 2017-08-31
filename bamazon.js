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
        useQuantity = parseFloat(answers.quantitySel).toFixed(0);
        if (amount < answers.quantitySel) {
            console.log("You are trying to buy more " + answers.productSel + " than is in stock.");
            connection.end();
        }
        else {
            var remaining = amount - useQuantity;
            var product = answers.productSel;
            connection.query("SELECT price FROM products WHERE product_name = ?", answers.productSel, function(err, res){
                if (err) throw err;
                price = res[0].price;
                priceTotal = price * useQuantity;
                var change = connection.query("UPDATE products SET stock_quantity = ?, product_sales = product_sales + ? WHERE product_name = ?", [remaining, priceTotal, product], function(err, res){
                    if (err) throw err;
                    console.log("You purchased " + useQuantity + " " + answers.productSel + " at $" + price.toFixed(2) + " for a total of $" + priceTotal.toFixed(2) + ".");
                    connection.end();
                });
            });
        }
    });
}

connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT item_id, product_name, price, department_name FROM products", function(err, res) {
        if (err) throw err;
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
            validate: function(value) {
                if (isNaN(value)) return false;
                else return true;
            }
        }];
        for (i = 0; i < res.length; i++) {
            productNames.push(res[i].product_name);
        }
        inquirer.prompt(questions).then(function(answers) {
            buyProduct(answers);
        });
    });
});

