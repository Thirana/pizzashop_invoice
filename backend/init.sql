CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);


-- Insert 12 items: 5 pizzas, 3 beverages, 2 desserts, 2 toppings
INSERT INTO items (name, type, price, description) VALUES
('Margherita Pizza - Large', 'pizza', 2200, 'Classic pizza with tomato, mozzarella, and basil'),
('Pepperoni Pizza', 'pizza', 1600, 'Pizza with pepperoni and mozzarella'),
('Veggie Pizza', 'pizza', 1200, 'Pizza with mixed vegetables and mozzarella'),
('BBQ Chicken Pizza', 'pizza', 1800, 'Pizza with BBQ sauce, chicken, and onions'),
('Hawaiian Pizza - medium', 'pizza', 1600, 'Pizza with ham, pineapple, and mozzarella'),
('Cola', 'beverage', 300, 'Chilled cola drink'),
('Lemonade', 'beverage', 450, 'Freshly squeezed lemonade'),
('Iced Tea', 'beverage', 500, 'Sweetened iced tea'),
('Chocolate Lava Cake', 'dessert', 600, 'Warm chocolate cake with molten center'),
('Ice Cream', 'dessert', 400, 'Classic Italian dessert with coffee and mascarpone'),
('Extra Cheese', 'topping', 300, 'Additional mozzarella cheese'),
('Mushrooms', 'topping', 450, 'Sliced fresh mushrooms');