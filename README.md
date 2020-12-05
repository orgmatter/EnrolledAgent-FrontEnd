Requirements to run project

##
install Redis databse
install mongo database

copy .env.example to form .env

Run npm install in the following folders
## common, admin, app


install nodemon by running `npm i -g nodemon`

to start project 
### windows users run - `npm run dev-win`
### linux and mac users run - `npm run dev`

this should be run from the appropriate folder ie `admin` and `app`


please avoid working on any backend file, the views for each part of the app is located in the views folder,


to start work, pull from master, create a branch with name of page you are working on,
when you are done, commit, switch to master pull latest updates, switch back to your branch, 
merge master into your branch, fix any merge conflicts, push and do a pull request to master.

ensure to set the full path to the public folder on your .env file

[https://developer.twitter.com/en/docs/authentication/guides/log-in-with-twitter]


#Google sigin integration
[https://developers.google.com/identity/sign-in/web/backend-auth]


#Linkedin  integration
[https://www.linkedin.com/developers/]
[https://www.linkedin.com/developers/apps/new]
[https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin]

	{
				"role" : "dbOwner",
				"db" : "admin"
			},
			{
				"role" : "userAdminAnyDatabase",
				"db" : "admin"
			},
			{
				"role" : "readWriteAnyDatabase",
				"db" : "admin"
			},
			{
				"role" : "root",
				"db" : "admin"
			}

            b78c8a91852b
            enrolled 
            wiseminds

            	{
		"_id" : "test.enrolled",
		"userId" : UUID("ed596f4c-cf8b-4912-b892-bd684226d4a4"),
		"user" : "enrolled",
		"db" : "test",
		"roles" : [
			{
				"role" : "readWrite",
				"db" : "enrolled"
			},
			{
				"role" : "dbAdmin",
				"db" : "enrolled"
			}
		],
		"mechanisms" : [
			"SCRAM-SHA-1",
			"SCRAM-SHA-256"
		]
	},
	{
		"_id" : "test.wiseminds",
		"userId" : UUID("afb29963-c4a6-46a2-952c-df41eb03e271"),
		"user" : "wiseminds",
		"db" : "test",
		"roles" : [
			{
				"role" : "dbOwner",
				"db" : "admin"
			},
			{
				"role" : "userAdminAnyDatabase",
				"db" : "admin"
			},
			{
				"role" : "readWriteAnyDatabase",
				"db" : "admin"
			},
			{
				"role" : "root",
				"db" : "admin"
			}
		],
		"mechanisms" : [
			"SCRAM-SHA-1",
			"SCRAM-SHA-256"
		]
	}