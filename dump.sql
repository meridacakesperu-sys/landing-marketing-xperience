PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    plan TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  , status TEXT DEFAULT 'Nuevo', notes TEXT DEFAULT '', business TEXT DEFAULT '', total_paid REAL DEFAULT 0, birthday TEXT DEFAULT '', ticket_price REAL DEFAULT 0, purchase_stage TEXT DEFAULT 'Pre-venta', table_id INTEGER DEFAULT NULL, occupation TEXT DEFAULT '', has_business TEXT DEFAULT '', business_details TEXT DEFAULT '', social_media TEXT DEFAULT '', sales_type TEXT DEFAULT '', main_goal TEXT DEFAULT '', main_struggle TEXT DEFAULT '', marketing_level TEXT DEFAULT '', ai_level TEXT DEFAULT '', sales_level TEXT DEFAULT '', agent_id INTEGER DEFAULT NULL, ticket_id TEXT, attended INTEGER DEFAULT 0);
INSERT INTO registrations VALUES(1,'eduar','eduarps9513@gmail.com','0274-2523562','XPERIENCE VIP ($120)','2026-07-09 16:32:18','Completado','','',0.0,'2027-01-13',115.0,'Pre-venta',2,'','','','','','','','','','',NULL,'e63f8a38',1);
INSERT INTO registrations VALUES(2,'yissel','eddcs@gmail.com','323232','General','2026-07-13 12:35:38','Nuevo','','educacion',121.0,'2026-12-09',121.0,'Pre-venta',NULL,'','','','','','','','','','',NULL,'4d5e1d9d',0);
INSERT INTO registrations VALUES(3,'ededj','23dsdd@gmail.com','55555','General','2026-07-13 13:30:34','Completado','','',56.0,'2027-01-13',0.0,'Pre-venta',NULL,'','','','','','','','','','',NULL,'5977a682',0);
INSERT INTO registrations VALUES(4,'Prueba API','prueba@api.com','','VIP','2026-07-13 15:22:22','Completado','','',120.0,'',120.0,'Pre-venta',NULL,'','','','','','','','','','','','bbbf3bb9',1);
INSERT INTO registrations VALUES(5,'Maria Test','maria@test.com','+584141234567','VIP','2026-07-13 15:45:28','Completado','','',23.0,'12/05',0.0,'Pre-venta',3,'Diseñadora','Tengo negocio online','Vendo plantillas en notion','@marianotion','Infoproductos','Mas ventas','Conseguir clientes','Lo basico','Cero','Un poco mas que basico',NULL,'903319bc',1);
INSERT INTO registrations VALUES(6,'eduar peña','eduarps9513@gmail.com','0412306097','VIP','2026-07-13 15:53:24','Nuevo','','',0.0,'13/01',0.0,'Pre-venta',NULL,'Marketero','Tengo negocio online','es una academia de reposteria','meridacakes_','Infoproductos','Atraer clientes','Conseguir clientes','Un poco mas que basico','Un poco mas que basico','Lo basico',NULL,'a7c93883',0);
INSERT INTO registrations VALUES(7,'yissel carpio','contacto@ferreteriaelandino.com','04123060970','General','2026-07-13 15:58:46','Nuevo','','',0.0,'1996-12-09',0.0,'Pre-venta',NULL,'repostera','Tengo negocio online','fvervcrecwcwc','dcfeced','Infoproductos','Automatizar','No tengo tiempo','Lo basico','Lo basico','Un poco mas que basico',NULL,'f716c22a',0);
INSERT INTO registrations VALUES(8,'pedro perez','contacto@ferreteriaelandino.com','23322232','General','2026-07-13 16:29:41','Nuevo','','',0.0,'2026-07-20',75.0,'Pre-venta',NULL,'repostera','Tengo una idea de negocio','dfwfewf','dewcwd','Infoproductos','Marca personal','Me cuesta crear contenido','Un poco mas que basico','Un poco mas que basico','Lo basico',NULL,'27abb26d',0);
INSERT INTO registrations VALUES(9,'eerr','','333','General','2026-07-13 18:08:55','Invitado','','',0.0,'',0.0,'Pre-venta',NULL,'','','','','','','','','','',NULL,'4c081eed',0);
INSERT INTO registrations VALUES(11,'mariaaaa','Mileny050880@gmail.com','232233','General','2026-07-13 19:57:28','Completado','','',107.0,'2026-02-14',75.0,'Pre-venta',1,'repostera','Tengo negocio online','sedfrgf','defv','Infoproductos','Mas ventas','Conseguir clientes','Cero','Lo basico','Cero',3,'dad21b96',0);
INSERT INTO registrations VALUES(12,'eddddddddd','33333@gmail.com','2323233','General','2026-07-13 22:12:17','Completado','','',75.0,'',75.0,'Pre-venta',4,'','','','','','','','','','',NULL,'49d6ad5b',1);
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, method TEXT DEFAULT '', bank TEXT DEFAULT '', reference TEXT DEFAULT '', status TEXT DEFAULT 'Activo', history TEXT DEFAULT '',
    FOREIGN KEY(client_id) REFERENCES registrations(id) ON DELETE CASCADE
  );
INSERT INTO payments VALUES(1,2,35.0,'2026-07-13T12:40:41.752Z','2026-07-13 12:40:41','','','','Activo','');
INSERT INTO payments VALUES(2,2,45.0,'2026-07-13T13:12:27.884Z','2026-07-13 13:12:27','Pago móvil','Provincial','00005678','Activo','');
INSERT INTO payments VALUES(3,2,38.0,'2026-07-13T13:27:24.989Z','2026-07-13 13:27:25','Transferencia','','','Activo','');
INSERT INTO payments VALUES(4,2,3.0,'2026-07-13T13:27:57.427Z','2026-07-13 13:27:57','Transferencia','','','Activo','');
INSERT INTO payments VALUES(7,1,34.0,'2026-07-13T14:45:29.637Z','2026-07-13 14:45:29','Transferencia','','','Anulado','Anulado el 7/13/2026, 10:45:33 AM. ');
INSERT INTO payments VALUES(8,11,23.0,'2026-07-13T19:58:48.682Z','2026-07-13 19:58:48','Transferencia','','','Activo','');
INSERT INTO payments VALUES(9,11,32.0,'2026-07-13T20:28:00.284Z','2026-07-13 20:28:00','Transferencia','','','Activo','');
INSERT INTO payments VALUES(10,11,52.0,'2026-07-13T20:28:06.659Z','2026-07-13 20:28:06','Transferencia','','','Activo','');
INSERT INTO payments VALUES(11,3,56.0,'2026-07-13T21:44:29.700Z','2026-07-13 21:44:29','Punto de Venta','Taquilla/Puerta','Check-in','Activo','');
INSERT INTO payments VALUES(12,5,23.0,'2026-07-13T21:47:55.386Z','2026-07-13 21:47:55','Punto de Venta','Taquilla/Puerta','Check-in','Activo','');
INSERT INTO payments VALUES(13,4,120.0,'2026-07-13T21:49:51.740Z','2026-07-13 21:49:51','Pago Móvil','Taquilla/Puerta','Check-in','Activo','');
INSERT INTO payments VALUES(14,12,50.0,'2026-07-13T22:12:17.013Z','2026-07-13 22:12:17','Punto de Venta','Taquilla/Puerta','5555','Activo','');
INSERT INTO payments VALUES(15,12,25.0,'2026-07-13T22:12:56.563Z','2026-07-13 22:12:56','Efectivo (Puerta)','Taquilla/Puerta','Check-in','Activo','');
CREATE TABLE campaign_objectives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT DEFAULT 'Pendiente',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  , notes TEXT DEFAULT '');
INSERT INTO campaign_objectives VALUES(1,'Anuncio pre venta','2026-07-13','2026-07-18','Pendiente','2026-07-13 12:38:01','ss');
CREATE TABLE tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    leader TEXT DEFAULT '',
    order_index INTEGER DEFAULT 0
  , leader_id INTEGER DEFAULT NULL);
INSERT INTO tables VALUES(1,'Mesa 1','Yissel Carpio',1,1);
INSERT INTO tables VALUES(2,'Mesa 2','',2,NULL);
INSERT INTO tables VALUES(3,'Mesa 3','',3,NULL);
INSERT INTO tables VALUES(4,'Mesa 4','',4,NULL);
INSERT INTO tables VALUES(5,'Mesa 5','',5,NULL);
INSERT INTO tables VALUES(6,'Mesa 6','',6,NULL);
INSERT INTO tables VALUES(7,'Mesa 7','',7,NULL);
INSERT INTO tables VALUES(8,'Mesa 8','',8,NULL);
INSERT INTO tables VALUES(9,'Mesa 9','',9,NULL);
INSERT INTO tables VALUES(10,'Mesa 10','',10,NULL);
CREATE TABLE leaders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    business TEXT DEFAULT '',
    birthday TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
INSERT INTO leaders VALUES(1,'Yissel Carpio','Yisselc099@gmail.com','4122605200','Me2rida Cakes','2026-12-09','','2026-07-13 14:24:00');
CREATE TABLE timeline_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day INTEGER NOT NULL,
    time TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    order_index INTEGER DEFAULT 0
  );
INSERT INTO timeline_events VALUES(1,1,'09:30 AM','Inicio con energía','Daniel sale y anima al publico, hace una bailoterapia. En el punto mas alto baja la musica, da una breve reseña mia y sube la energia con la musica y me presenta con todo','30min',1);
INSERT INTO timeline_events VALUES(2,1,'10:00 AM','Inicio Marketing - Eduar','','120min',2);
INSERT INTO timeline_events VALUES(3,1,'12:00 PM','Reto: Crear un buen marketing a un negocio','','90min',3);
INSERT INTO timeline_events VALUES(4,1,'01:30 PM','Almuerzo','','60min',4);
INSERT INTO timeline_events VALUES(5,1,'02:30 PM','Dinámica','','15min',5);
INSERT INTO timeline_events VALUES(6,1,'02:45 PM','Cameo','','15min',6);
INSERT INTO timeline_events VALUES(7,1,'03:00 PM','Presentación a Creadora de contenido','','5min',7);
INSERT INTO timeline_events VALUES(8,1,'03:05 PM','Creadora de contenido','Como una marca trabaja con un creador de contenido y como crear ese contenido','60min',8);
INSERT INTO timeline_events VALUES(9,1,'04:05 PM','Presentación a creadora de contenido','','5min',9);
INSERT INTO timeline_events VALUES(10,1,'04:10 PM','Creadora de contenido','Como grabarte sin tenerle miedo a la camara','60min',10);
INSERT INTO timeline_events VALUES(11,1,'05:10 PM','Reto de creación de contenido','','60min',11);
INSERT INTO timeline_events VALUES(12,1,'06:10 PM','Cierre Eduar','','20min',12);
INSERT INTO timeline_events VALUES(13,1,'06:30 PM','Final','','',13);
INSERT INTO timeline_events VALUES(14,2,'09:00 AM','Inicio con energía/ dinámica','','30min',1);
INSERT INTO timeline_events VALUES(15,2,'09:30 AM','Mentalidad ganadora - Daniel Zambrano','','60min',2);
INSERT INTO timeline_events VALUES(16,2,'10:30 AM','Presentación Ponente','','5min',3);
INSERT INTO timeline_events VALUES(17,2,'10:35 AM','Ventas y cierre por whatsapp - Juan Pinto','','60min',4);
INSERT INTO timeline_events VALUES(18,2,'11:35 AM','Reto de pitch de ventas','','60min',5);
INSERT INTO timeline_events VALUES(19,2,'12:35 PM','Almuerzo','','60min',6);
INSERT INTO timeline_events VALUES(20,2,'01:05 PM','Dinámica','','15min',7);
INSERT INTO timeline_events VALUES(21,2,'01:20 PM','Cameo','','15min',8);
INSERT INTO timeline_events VALUES(22,2,'01:35 PM','Introducción y presentación sobre la IA','','5min',9);
INSERT INTO timeline_events VALUES(23,2,'01:40 PM','IA y sistemas','','120min',10);
INSERT INTO timeline_events VALUES(24,2,'03:40 PM','Reto IA','','90min',11);
INSERT INTO timeline_events VALUES(25,2,'05:10 PM','Premio a equipo de Ganadores','','20min',12);
INSERT INTO timeline_events VALUES(26,2,'05:30 PM','Cierre motivacional - Eduar','','30min',13);
INSERT INTO timeline_events VALUES(27,2,'06:30 PM','Party y entrega de certificados','','40min',14);
INSERT INTO timeline_events VALUES(28,2,'07:10 PM','Final','7:10pm a 7:30PM','20min',15);
CREATE TABLE materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    path TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
INSERT INTO settings VALUES('current_stage','Pre-venta');
INSERT INTO settings VALUES('price_general_preventa','75');
INSERT INTO settings VALUES('price_vip_preventa','120');
INSERT INTO settings VALUES('price_general_etapa1','87');
INSERT INTO settings VALUES('price_vip_etapa1','143');
INSERT INTO settings VALUES('price_general_etapa2','97');
INSERT INTO settings VALUES('price_vip_etapa2','185');
CREATE TABLE IF NOT EXISTS "reminders" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      lead_name TEXT,
      lead_phone TEXT,
      tag TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, converted INTEGER DEFAULT 0,
      FOREIGN KEY(client_id) REFERENCES registrations(id) ON DELETE CASCADE
    );
CREATE TABLE sales_agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ref_code TEXT NOT NULL UNIQUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
INSERT INTO sales_agents VALUES(3,'Eduar Peña','General','2026-07-13 19:57:56');
INSERT INTO sales_agents VALUES(4,'Daniel Zambrano','daniel','2026-07-13 19:58:10');
INSERT INTO sales_agents VALUES(5,'Yissel Carpio','yissel','2026-07-13 19:58:19');
INSERT INTO sales_agents VALUES(6,'Daniela Quiñonez','daniela','2026-07-13 19:58:30');
INSERT INTO sqlite_sequence VALUES('registrations',12);
INSERT INTO sqlite_sequence VALUES('campaign_objectives',2);
INSERT INTO sqlite_sequence VALUES('payments',15);
INSERT INTO sqlite_sequence VALUES('tables',10);
INSERT INTO sqlite_sequence VALUES('leaders',1);
INSERT INTO sqlite_sequence VALUES('timeline_events',29);
INSERT INTO sqlite_sequence VALUES('materials',1);
INSERT INTO sqlite_sequence VALUES('reminders',19);
INSERT INTO sqlite_sequence VALUES('sales_agents',6);
CREATE UNIQUE INDEX idx_registrations_ticket_id ON registrations(ticket_id);
COMMIT;
