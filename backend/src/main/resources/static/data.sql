insert into categorias(c_nombre, c_descripcion, c_fecha_creacion) values
('Electrónica', 'Dispositivos y gadgets electrónicos', now()),
('Ropa', 'Prendas de vestir para todas las edades', now()),
('Hogar', 'Artículos para el hogar y decoración', now()),
('Libros', 'Libros de diversos géneros y autores', now()),
('Deportes', 'Equipamiento y ropa deportiva', now());

insert into productos(p_nombre, p_precio, p_stock, p_fecha_creacion, p_codigo, p_categoria_id) values
('Smartphone XYZ', 699.99, 50, now(), 'ELEC001', 1),
('Camiseta Deportiva', 29.99, 200, now(), 'ROPA001', 2),
('Sofá de Tela', 499.99, 20, now(), 'HOGAR001', 3),
('Novela de Misterio', 15.99, 150, now(), 'LIBRO001', 4),
('Balón de Fútbol', 25.99, 100, now(), 'DEPO001', 5),
('Laptop ABC', 999.99, 30, now(), 'ELEC002', 1),
('Pantalones Vaqueros', 49.99, 120, now(), 'ROPA002', 2),
('Lámpara de Mesa', 39.99, 80, now(), 'HOGAR002', 3),
('Libro de Cocina', 22.99, 90, now(), 'LIBRO002', 4),
('Raqueta de Tenis', 89.99, 60, now(), 'DEPO002', 5);

insert into solicitud (s_cliente_nombre, s_cliente_numero, s_fecha_solicitud) values
('Juan Pérez', '555-1234', now()),
('María Gómez', '555-5678', now());