### This file is a temporary docs holder for me to reference the steps -

1. Create a user on super tokens to access the dashboard -
   URL: `http://localhost:3000/api/v1/auth/dashboard/`

```
curl --location --request POST 'http://localhost:3567/recipe/dashboard/user' \
--header 'rid: dashboard' \
--header 'Content-Type: application/json' \
--data-raw '{"email": "user@email","password": "password"}'
```
