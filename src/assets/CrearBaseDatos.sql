CREATE TABLE IF NOT EXISTS tableItems(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    unTextoCorto TEXT,
    unTextoLargo TEXT,
    unNumeroEntero INTEGER,
    unNumeroReal REAL,
    unaFecha TEXT,
    unBooleano INTEGER,
    unaImagen TEXT);
INSERT INTO tableItems
    (unTextoCorto, unTextoLargo, unNumeroEntero, unNumeroReal, unaFecha, unBooleano, unaImagen) VALUES 
    ('Uno', 'El primer valor', 1111, 111.11, '2001-01-01 01:01:01', 1, 'uno.png');
INSERT INTO tableItems
    (unTextoCorto, unTextoLargo, unNumeroEntero, unNumeroReal, unaFecha, unBooleano, unaImagen) VALUES 
    ('Dos', 'El segundo valor', 2222, 222.22, '2002-02-02 02:02:02', 0, 'dos.png');
INSERT INTO tableItems
    (unTextoCorto, unTextoLargo, unNumeroEntero, unNumeroReal, unaFecha, unBooleano, unaImagen) VALUES 
    ('Tres', 'El tercer valor', 3333, 333.33, '2003-03-03 03:03:03', 1, 'tres.png');