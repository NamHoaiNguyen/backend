# Auth

Add form-based cookie authentication to app.


## Authentication
*  Add auth router
*  Create user with POST /auth/signup
	*  validate required fields
	*  Check if email is unique
	*  hash password with bcrypt
	*  insert into db

*  Login user with POST /auth/login
        *  check if email in db
        *  compare password with hashed password in db
