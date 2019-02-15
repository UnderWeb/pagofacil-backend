# Prueba Técnica - Backend - Pago Fácil

Este proyecto ha sido generado en Nodejs versión 10.13.0, express versión 4.16.2, MongoDb versión 4.0 y Mongoose versión 5.4.11 como ORM.

## Instalación

1. Se debe descargar la aplicación mediante el siguiente comando:

git clone https://github.com/UnderWeb/pagofacil-backend.git

2. Una vez descargado, hay que dirigirse al directorio o carpeta donde se encuentra la aplicación para proceder a instalar las librerías de dependencias, ejecutando el siguiente comando:

npm install

## Servidor de desarrollo

Se debe arrancar npm start para levantar el servidor de desarrollo. El puerto usado para la API Rest es el 9000. Se ha utilizado nodemon versión 1.18.10, con lo cual la aplicación se cargará automáticamente si se realiza algún cambio.

## Credenciales de acceso.

Las configuraciones de acceso y del puerto se encuentran en el archivo .env ubicado en la raíz del proyecto backend..

## Consideraciones

### Colecciones usuarios y bancos.

En la colección usuarios, los campos correspondientes a la cuenta bancaria fueron embebidos, a diferencia del ejemplo enviado por Pago Fácil. La razón de esto es que una persona puede tener más de una cuenta bancaria y muchas personas utilizan los sistemas de pago automático de los bancos.

Dado lo anterior se creó la colección bancos, la cual posee el campo nombre con el propósito de tener la referencia del banco en el sub documento cuentas_bancarias de la colección usuarios. De esta forma, la aplicación es más mantenible y escalable, dado que otras colecciones pueden utilizar bancos y éstos a su vez pueden ser mantenidos en la base de datos.

### Colección transacción

En esta colección se agregó  el campo total_a_pagar, el cual corresponde al cálculo de la comisión por transacción, lo cual tiene sentido en una base de datos NoSql. Además, tener guardado ese dato sirve para la realización de históricos de transacciones.
