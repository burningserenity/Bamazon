# Bamazon

CLI for a mock ecommerce platform.

There are three modules: bamazon.js, bamazonManager.js, and bamazonSupervisor.js.

The first one, bamazon.js, allows the user to "buy" items from a database called BamazonDB. The items are first displayed for the user, who may then select the desired item by name from a list.
Next, the user must specify the amount desired, but it cannot be more than the stock available. Finally, bamazon.js shows the user what was just "bought," the quantity selected, and the total
cost deducted from the user's infinite funds.

The second module, bamazonManager.js, allows the user to do one of four things: display the contents of the products table in the BamazonDB database, view the items with a quantity less than 100,
add stock to an existing item, or add a new item altogether. The usage for these is about as straightforward as the usage of bamazon.js. Items added via the last option must have unique names,
and must be added to a department that exists in the departments table.

The final module, bamazonSupervisor.js, allows the user to either display each department with over head costs, total sales, and total profit (over head deducted from sales), or add a new 
department to the departments table; each department must have a unique name. 


Link to video demonstration: https://my.pcloud.com/publink/show?code=XZyLuy7Z0YngvUf433Y0VB5mecM3QJ5AdKlk
