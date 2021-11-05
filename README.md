# Java web-service 2021 - 20Yhp

## React Shopping
Bancken web server gjord i Spring Boot för products, skapa en frontend som använder backend. 
Spring Boot koden består av en autentiseringsdel, och frontenden skall kunna hantera den med användare (alltså, man skall kunna logga in för att använda funktionerna).

Frontenden hantera backend samt att man kan autentisera sig (logga in och logga ut).


## Reddit Clone
Enklare version av reddit (Reddit - Dive into anything).

Web server och en frontend:

Registrera användare
Logga in på användare
Logga ut från användare
Se posts (alla)
Skapa posts (men bara om man har en användare och är inloggad) En post bestå av minst en titel, en text och vem som gjorde den.
Ta bort posts (bara sina egna posts på sin användare, och man måste vara inloggad)
 
Hantera ”upvotes” och ”downvotes”. På varje post skall man kunna göra en ”upvote” för att säga att man gillar den, eller ”downvote” för att säga att man ogillade den. Antalet upvotes och downvotes skall visas upp för en post (på valfritt ställe). Man måste vara inloggad för att kunna använda denna funktion och man kan bara ”upvote” eller ”downvote” en gång. Du kan samtidigt bara göra ena eller den andra. Man skall inte kunna både ”upvote” och ”downvote”.


- Backend Java och Spring Boot
- Frontend React
- Databas MySQL

## Databas

```mysql

CREATE DATABASE reddit_clone;

CREATE USER 'reddit_clone_user'@'localhost' IDENTIFIED BY 'reddit_clone_password';

GRANT ALL PRIVILEGES ON reddit_clone.* TO 'reddit_clone_user'@'localhost';

FLUSH PRIVILEGES;
```
