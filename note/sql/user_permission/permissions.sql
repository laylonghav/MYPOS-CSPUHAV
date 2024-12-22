CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `group` VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_menu_web VARCHAR(255) NULL,
  web_route_key VARCHAR(255) NULL
);


CREATE TABLE permission_roles (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE
);


INSERT INTO user_roles (user_id ,role_id) VALUES
(1,1),
(3,4),
(3,7);


INSERT INTO permissions (name, group, is_menu_web, web_route_key) VALUES
("dashboard.get_list", "dashboard", 1, "/"),
("pos.get_list", "pos", 1, "/pos"),
("customer.get_list", "customer", 1, "/customer"),
("customer.get_one", "customer", null, null),
("customer.create", "customer", null, null),
("customer.update", "customer", null, null),
("customer.remove", "customer", null, null),
("order.get_list", "order", 1, "/order"),
("product.get_list", "product", 1, "/product"),
("product.get_one", "product", null, null),
("product.create", "product", null, null),
("product.update", "product", null, null),
("product.remove", "product", null, null),
("category.get_list", "category", 1, "/category"),
("category.get_one", "category", null, null),
("category.create", "category", null, null),
("category.update", "category", null, null),
("category.remove", "category", null, null),
("supplier.get_list", "supplier", 1, "/supplier"),
("supplier.get_one", "supplier", null, null),
("supplier.create", "supplier", null, null),
("supplier.update", "supplier", null, null),
("supplier.remove", "supplier", null, null),
("expanse_type.get_list", "expanse_type", 1, "/expanse_type"),
("expanse_type.get_one", "expanse_type", null, null),
("expanse_type.create", "expanse_type", null, null),
("expanse_type.update", "expanse_type", null, null),
("expanse_type.remove", "expanse_type", null, null),
("expanse.get_list", "expanse", 1, "/expanse"),
("expanse.get_one", "expanse", null, null),
("expanse.create", "expanse", null, null),
("expanse.update", "expanse", null, null),
("expanse.remove", "expanse", null, null),
("employee.get_list", "employee", 1, "/employee"),
("employee.get_one", "employee", null, null),
("employee.create", "employee", null, null),
("employee.update", "employee", null, null),
("employee.remove", "employee", null, null),
("report.report_sale_summary", "report", 1, "/report_sale_summary"),
("report.report_expense_summary", "report", 1, "/report_expense_summary"),
("user.get_list", "user", 1, "/user"),
("user.get_one", "user", null, null),
("user.create", "user", null, null),
("user.update", "user", null, null),
("user.remove", "user", null, null),
("role.get_list", "role", 1, "/role"),
("role.get_one", "role", null, null),
("role.create", "role", null, null),
("role.update", "role", null, null),
("role.remove", "role", null, null),
("purchase.get_list", "purchase", 1, "/purchase"),
("purchase.create", "purchase", null, null),
("purchase.update", "purchase", null, null),
("purchase.remove", "purchase", null, null),
("payroll.get_list", "payroll", 1, "/payroll"),
("currency.get_list", "currency", 1, "/currency"),
("language.get_list", "language", 1, "/language"),
("role_permission.get_list", "role_permission", 1, "/role_permission");



-- Admin
INSERT INTO permission_roles (role_id, permission_id) VALUES
-- Dashboard permissions
(1, 1), -- dashboard.get_list

-- POS permissions
(1, 2), -- pos.get_list

-- Customer permissions
(1, 3), -- customer.get_list
(1, 4), -- customer.get_one
(1, 5), -- customer.create
(1, 6), -- customer.update
(1, 7), -- customer.remove

-- Order permissions
(1, 8), -- order.get_list

-- Product permissions
(1, 9),  -- product.get_list
(1, 10), -- product.get_one
(1, 11), -- product.create
(1, 12), -- product.update
(1, 13), -- product.remove

-- Category permissions
(1, 14), -- category.get_list
(1, 15), -- category.get_one
(1, 16), -- category.create
(1, 17), -- category.update
(1, 18), -- category.remove

-- Supplier permissions
(1, 19), -- supplier.get_list
(1, 20), -- supplier.get_one
(1, 21), -- supplier.create
(1, 22), -- supplier.update
(1, 23), -- supplier.remove

-- Expense Type permissions
(1, 24), -- expanse_type.get_list
(1, 25), -- expanse_type.get_one
(1, 26), -- expanse_type.create
(1, 27), -- expanse_type.update
(1, 28), -- expanse_type.remove

-- Expense permissions
(1, 29), -- expanse.get_list
(1, 30), -- expanse.get_one
(1, 31), -- expanse.create
(1, 32), -- expanse.update
(1, 33), -- expanse.remove

-- Employee permissions
(1, 34), -- employee.get_list
(1, 35), -- employee.get_one
(1, 36), -- employee.create
(1, 37), -- employee.update
(1, 38), -- employee.remove

-- Report permissions
(1, 39), -- report.report_sale_summary
(1, 40), -- report.report_expense_summary

-- User permissions
(1, 41), -- user.get_list
(1, 42), -- user.get_one
(1, 43), -- user.create
(1, 44), -- user.update
(1, 45), -- user.remove

-- Role permissions
(1, 46), -- role.get_list
(1, 47), -- role.get_one
(1, 48), -- role.create
(1, 49), -- role.update
(1, 50), -- role.remove

-- Purchase permissions
(1, 51), -- purchase.get_list
(1, 52), -- purchase.create
(1, 53), -- purchase.update
(1, 54), -- purchase.remove

-- Payroll permissions
(1, 55), -- payroll.get_list

-- Currency permissions
(1, 56), -- currency.get_list

-- Language permissions
(1, 57), -- language.get_list

-- Role Permission permissions
(1, 58); -- role_permission.get_list


INSERT INTO permission_roles (role_id, permission_id) VALUES
-- Admin permissions for new_customer and top_sale
(1, 59),  -- new_customer.get_list
(1, 60),  -- new_customer.get_one
(1, 61),  -- new_customer.create
(1, 62),  -- new_customer.update
(1, 63),  -- new_customer.remove
(1, 64),  -- top_sale.get_list
(1, 65),  -- top_sale.get_one
(1, 66),  -- top_sale.create
(1, 67),  -- top_sale.update
(1, 68);  -- top_sale.remove



--  (4, Cashier)
INSERT INTO permission_roles (role_id, permission_id) VALUES
-- Dashboard permissions
(4, 1), -- dashboard.get_list

-- POS permissions
(4, 2), -- pos.get_list

-- Order permissions
(4, 8),  -- order.get_list

-- Customer permissions (if Cashier needs to manage customers)
(4, 3), -- customer.get_list
(4, 4), -- customer.get_one

-- Product permissions (if Cashier needs access to product information)
(4, 9),  -- product.get_list
(4, 10); -- product.get_one



--  (7, Inventory) 
INSERT INTO permission_roles (role_id, permission_id) VALUES
-- Product permissions
(7, 9),  -- product.get_list
(7, 10), -- product.get_one
(7, 11), -- product.create
(7, 12), -- product.update
(7, 13), -- product.remove

-- Category permissions
(7, 14), -- category.get_list
(7, 15), -- category.get_one
(7, 16), -- category.create
(7, 17), -- category.update
(7, 18), -- category.remove

-- Supplier permissions
(7, 19), -- supplier.get_list
(7, 20), -- supplier.get_one
(7, 21), -- supplier.create
(7, 22), -- supplier.update
(7, 23); -- supplier.remove



-- 2
-- Manager
-- Manager

INSERT INTO permission_roles (role_id, permission_id) VALUES
-- Dashboard permissions
(2, 1),  -- dashboard.get_list

-- POS permissions
(2, 2),  -- pos.get_list

-- Order permissions
(2, 8),  -- order.get_list

-- Customer permissions
(2, 3),  -- customer.get_list
(2, 4),  -- customer.get_one
(2, 5),  -- customer.create
(2, 6),  -- customer.update
(2, 7),  -- customer.remove

-- Product permissions
(2, 9),  -- product.get_list
(2, 10), -- product.get_one
(2, 11), -- product.create
(2, 12), -- product.update
(2, 13), -- product.remove

-- Category permissions
(2, 14), -- category.get_list
(2, 15), -- category.get_one
(2, 16), -- category.create
(2, 17), -- category.update
(2, 18), -- category.remove

-- Supplier permissions
(2, 19), -- supplier.get_list
(2, 20), -- supplier.get_one
(2, 21), -- supplier.create
(2, 22), -- supplier.update
(2, 23), -- supplier.remove

-- Expense permissions
(2, 24), -- expanse_type.get_list
(2, 25), -- expanse_type.get_one
(2, 26), -- expanse_type.create
(2, 27), -- expanse_type.update
(2, 28), -- expanse_type.remove
(2, 29), -- expanse.get_list
(2, 30), -- expanse.get_one
(2, 31), -- expanse.create
(2, 32), -- expanse.update
(2, 33), -- expanse.remove

-- Employee permissions
(2, 34), -- employee.get_list
(2, 35), -- employee.get_one
(2, 36), -- employee.create
(2, 37), -- employee.update
(2, 38), -- employee.remove

-- Report permissions
(2, 39), -- report.report_sale_summary
(2, 40), -- report.report_expense_summary

-- User permissions
(2, 41), -- user.get_list
(2, 42), -- user.get_one
(2, 43), -- user.create
(2, 44), -- user.update
(2, 45), -- user.remove

-- Role permissions
(2, 46), -- role.get_list
(2, 47), -- role.get_one
(2, 48), -- role.create
(2, 49), -- role.update
(2, 50); -- role.remove


-- 3
-- Account
-- Account

INSERT INTO permission_roles (role_id, permission_id) VALUES
-- Dashboard permissions
(2, 1),  -- dashboard.get_list

-- POS permissions
(2, 2),  -- pos.get_list

-- Order permissions
(2, 8),  -- order.get_list

-- Customer permissions
(2, 3),  -- customer.get_list
(2, 4),  -- customer.get_one
(2, 5),  -- customer.create
(2, 6),  -- customer.update
(2, 7),  -- customer.remove

-- Product permissions
(2, 9),  -- product.get_list
(2, 10), -- product.get_one
(2, 11), -- product.create
(2, 12), -- product.update
(2, 13), -- product.remove

-- Category permissions
(2, 14), -- category.get_list
(2, 15), -- category.get_one
(2, 16), -- category.create
(2, 17), -- category.update
(2, 18), -- category.remove

-- Supplier permissions
(2, 19), -- supplier.get_list
(2, 20), -- supplier.get_one
(2, 21), -- supplier.create
(2, 22), -- supplier.update
(2, 23), -- supplier.remove

-- Expense permissions
(2, 24), -- expanse_type.get_list
(2, 25), -- expanse_type.get_one
(2, 26), -- expanse_type.create
(2, 27), -- expanse_type.update
(2, 28), -- expanse_type.remove
(2, 29), -- expanse.get_list
(2, 30), -- expanse.get_one
(2, 31), -- expanse.create
(2, 32), -- expanse.update
(2, 33), -- expanse.remove

-- Employee permissions
(2, 34), -- employee.get_list
(2, 35), -- employee.get_one
(2, 36), -- employee.create
(2, 37), -- employee.update
(2, 38), -- employee.remove

-- Report permissions
(2, 39), -- report.report_sale_summary
(2, 40), -- report.report_expense_summary

-- User permissions
(2, 41), -- user.get_list
(2, 42), -- user.get_one
(2, 43), -- user.create
(2, 44), -- user.update
(2, 45), -- user.remove

-- Role permissions
(2, 46), -- role.get_list
(2, 47), -- role.get_one
(2, 48), -- role.create
(2, 49), -- role.update
(2, 50); -- role.remove


select
DISTINCT
  p.id,
  p.name,
  p.group,
  p.is_menu_web,
  p.web_route_key
from permissions p
inner join permission_roles pr on p.id = pr.permission_id
inner join `role` r on pr.role_id = r.id
inner join user_roles ur on r.id = ur.role_id
where ur.user_id = 3
 ORDER BY `id` ASC;


 INSERT INTO permissions (name, group, is_menu_web, web_route_key) VALUES
-- New Customer permissions
("new_customer.get_list", "new_customer", 1, "/new_customer"),
("new_customer.get_one", "new_customer", null, null),
("new_customer.create", "new_customer", null, null),
("new_customer.update", "new_customer", null, null),
("new_customer.remove", "new_customer", null, null),

-- Top Sale permissions
("top_sale.get_list", "top_sale", 1, "/top_sale"),
("top_sale.get_one", "top_sale", null, null),
("top_sale.create", "top_sale", null, null),
("top_sale.update", "top_sale", null, null),
("top_sale.remove", "top_sale", null, null);
