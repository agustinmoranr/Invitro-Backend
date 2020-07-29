Firebase Cloud Functions for exams project (Platzi master final project)
===

Installation
---

1. Clone the repo.
2. Install with:
    npm install -g firebase-tools
3. `firebase logout` appears if previous account is logged.
4. Type `firebase login` to access to firebase project with your account.
5. Start the project and install dependencies with `firebase init functions`
6. Choose between Javascript or Typescript languages.
7. Use ESLint to catch probable bugs and enforce style.
8. Install minimun dependencies to work.
9. If everything is ok, Firebase initialization complete!
10. Change "$RESOURCE_DIR" for "functions" (if you don´t change the folder's name) in firebase.json file.

Edit
---

You can edit index.js in order to include the cloud functions you need.

Deploy
---

To deploy all the functions contained in index.js:
* Type in console `firebase deploy --only functions`

To deploy a specific function included in index.js:
* Type `firebase deploy --only functions: <your function's name>`

To delete a specific function in firebase web platform:
* Type `firebase functions:delete <your function's name>`

To see firebase logs
* Type `firebase functions:log`

Structure
---

### Sending email when user created

* Location: functions/components/users and utilities
* Libraries: nodemailer (send emails through gmail service)

IMPORTANT: If using Gmail, turn on the access for less secure apps trough https://www.google.com/settings/security/lesssecureapps. Otherwise, you'll receive the error "535-5.7.8 Username and Password not accepted".


Environment variables
---

* Get environment variables from FB server: `firebase functions:config:get`
* Set variables: `firebase functions:config:set configuration.<variable>="<value>" ...`
* Call variables inside yor file: `functions.config().<variable>`
* Delete variables: `firebase functions:config:unset configuration.<variable>`
* Download to local in order to test your functions: `firebase functions:get | ac .runtimeconfig.json`
* Emulate authentication environment: `firebase functions:shell`
