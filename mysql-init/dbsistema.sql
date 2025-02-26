-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 172.21.33.87    Database: sistema
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Cuentas`
--

DROP TABLE IF EXISTS `Cuentas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cuentas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nro_cuenta` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `id_padre` int DEFAULT NULL,
  `recibe_saldo` tinyint(1) DEFAULT NULL,
  `tipo` enum('Ac','Pa','Pm','R+','R-') NOT NULL,
  `saldo_actual` decimal(10,2) DEFAULT '0.00',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id_padre` (`id_padre`),
  CONSTRAINT `Cuentas_ibfk_1` FOREIGN KEY (`id_padre`) REFERENCES `Cuentas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cuentas`
--

LOCK TABLES `Cuentas` WRITE;
/*!40000 ALTER TABLE `Cuentas` DISABLE KEYS */;
INSERT INTO `Cuentas` VALUES (6,100,'Activo',NULL,0,'Ac',0.00,1),(15,110,'Caja y Bancos',6,0,'Ac',0.00,1),(16,120,'Créditos',6,0,'Ac',0.00,1),(17,130,'Bienes de cambio',6,0,'Ac',0.00,1),(18,140,'Bienes de uso',6,0,'Ac',0.00,1),(37,111,'Caja',15,1,'Ac',3002.00,1),(38,112,'Banco plazo fijo',15,1,'Ac',0.00,1),(39,113,'Banco c/c',15,1,'Ac',0.00,1),(40,121,'Deudores por ventas',16,1,'Ac',-2.00,1),(41,122,'Documentos a cobrar',16,1,'Ac',900.00,1),(42,123,'Valores a depositar',16,1,'Ac',0.00,1),(43,131,'Mercaderias',17,1,'Ac',0.00,1),(44,141,'Inmuebles',18,1,'Ac',0.00,1),(45,142,'Rodados',18,1,'Ac',0.00,1),(46,143,'Instalaciones',18,1,'Ac',0.00,1),(47,200,'Pasivo',NULL,0,'Pa',0.00,1),(48,300,'Patrimonio',NULL,0,'Pm',0.00,1),(49,400,'Ingresos',NULL,0,'R+',0.00,1),(50,500,'Egresos',NULL,0,'R-',0.00,1),(51,210,'Deudas Comerciales',47,0,'Pa',0.00,1),(52,211,'Proveedores',51,1,'Pa',0.00,1),(53,212,'Sueldos a Pagar',51,1,'Pa',0.00,1),(54,220,'Deudas Fiscales',47,0,'Pa',0.00,1),(55,221,'Impuestos a Pagar',54,1,'Pa',0.00,1),(56,222,'Moratorias',54,1,'Pa',0.00,1),(57,230,'Prestamos Bancarios',47,1,'Pa',0.00,1),(58,310,'Capital',48,1,'Pm',0.00,1),(59,320,'Resultados',48,1,'Pm',0.00,1),(60,410,'Ventas',49,0,'R+',0.00,1),(61,411,'Ventas',60,1,'R+',0.00,1),(62,420,'Otros ingresos',49,0,'R+',0.00,1),(63,430,'Intereses Ganados',49,1,'R+',0.00,1),(64,510,'Costo de Mercadería Vendida',50,1,'R-',0.00,1),(65,520,'Impuestos',50,1,'R-',0.00,1),(66,530,'Sueldos',50,1,'R-',0.00,1),(67,540,'Intereses',50,1,'R-',0.00,1),(68,550,'Alquileres',50,1,'R-',0.00,1),(70,132,'asdas',17,1,'Ac',0.00,1);
/*!40000 ALTER TABLE `Cuentas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asientos`
--

DROP TABLE IF EXISTS `asientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `asientos_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asientos`
--

LOCK TABLES `asientos` WRITE;
/*!40000 ALTER TABLE `asientos` DISABLE KEYS */;
INSERT INTO `asientos` VALUES (39,'2025-01-08','prueba6',7),(40,'2025-01-09','prueba111',7);
/*!40000 ALTER TABLE `asientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuenta_asiento`
--

DROP TABLE IF EXISTS `cuenta_asiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuenta_asiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cuenta` int DEFAULT NULL,
  `id_asiento` int DEFAULT NULL,
  `debe` decimal(10,2) DEFAULT '0.00',
  `haber` decimal(10,2) DEFAULT '0.00',
  `saldo` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `id_cuenta` (`id_cuenta`),
  KEY `id_asiento` (`id_asiento`),
  CONSTRAINT `cuenta_asiento_ibfk_1` FOREIGN KEY (`id_cuenta`) REFERENCES `Cuentas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cuenta_asiento_ibfk_2` FOREIGN KEY (`id_asiento`) REFERENCES `asientos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuenta_asiento`
--

LOCK TABLES `cuenta_asiento` WRITE;
/*!40000 ALTER TABLE `cuenta_asiento` DISABLE KEYS */;
INSERT INTO `cuenta_asiento` VALUES (55,37,39,1.00,0.00,3001.00),(56,40,39,0.00,1.00,-1.00),(57,37,40,1.00,0.00,3002.00),(58,40,40,0.00,1.00,-2.00);
/*!40000 ALTER TABLE `cuenta_asiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permisos`
--

DROP TABLE IF EXISTS `role_permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permisos` (
  `rol_id` int NOT NULL,
  `permiso_id` int NOT NULL,
  PRIMARY KEY (`rol_id`,`permiso_id`),
  KEY `permiso_id` (`permiso_id`),
  CONSTRAINT `role_permisos_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `role_permisos_ibfk_2` FOREIGN KEY (`permiso_id`) REFERENCES `permisos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permisos`
--

LOCK TABLES `role_permisos` WRITE;
/*!40000 ALTER TABLE `role_permisos` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rol_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_rol` (`rol_id`),
  CONSTRAINT `fk_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (7,'asd','$2a$10$XTMMZbMbQWiTOmEoxO/Hl.PQqLY00eBElPU8/IeQUt./KSq1OmrLi','asd@asd','2025-01-03 03:03:47',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-25  0:41:27
