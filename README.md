# React-CRUD-App

This spa provides Create-Read-Update-Delete operations on MySQL database.

Admin logins
Admin can upload product with image as Base64 string then server saves this image with unique name in "/photos" dir.
Admin can delete product
Admin can update product
Admin can fetch product/products

Here are used packages:
  
  - Server Side (ExpressJS):
    - cors (to handle public request)
    - dotenv (to declare global constant variables)
    - jsonwebtoken (to provide autharization)
    - mysql (to establish connection with mysql database)
    - uuid (to create unique ids)
    
  - Client Side (ReactJS):
    - axios (to handle http requests)
    - js-cookie (to handle tokens with cookies)
    - react-router-dom (to handle browser routes)
