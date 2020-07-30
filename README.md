# Invitro-Backend

![](https://i.imgur.com/dAgqj8q.jpg)

##### Sistema gestor de exámenes clínicos.

## Repositories related with Invitro-backend project.

- https://github.com/MauricioFa/InVitro-massive-user-creation

### Frontend Repository

- https://github.com/IntiDev/InVitro

## Documentación.

#### Please checkout our [in vitro wiki](https://github.com/IntiDev/InVitro/wiki) Here you can access to the complete documentation for API using.

### API Rutes
- Login
    - API: https://invitro-api.herokuapp.com/login
    - Methods 
        - /Login POST 
- users CRUD
    - https://invitro-api.herokuapp.com/user
    - Methods
        - /user GET
        - /user/userId GET
        - /user POST
        - /user/userId PUT
- Create Multiple Users Through csv File.
    - API: https://invitro-api.herokuapp.com/uploadcsv
    - Methods: 
        - /uploadCSV POST
- Consults Creation
    - API: https://invitro-api.herokuapp.com/consult
    - Methods
        - /consult/userId POST 
        - /consult/userId PUT
- Exams Assigment
    - API: https://invitro-api.herokuapp.com/exam
    - Methods
        - /exam/userId POST
- Upload results file.
    - API: https://invitro-api.herokuapp.com/result
    - Methods 
         - /result/userId POST

## Development 

API REST builded with:
- Node.JS + Express.JS
- Firebase Ecosystem 
    - Firebase Authetication
    - Firestore
    - Firebase Storage
    - Firebase cloud Functions
- Deployed in Heroku.

### Collections
- Users
    - Define all personal data from user.
- ClinicHistory
    - Define all the consults that user is going to be taking through time as sub-documents.
- Exams
    - Define all the exams assigned to a pacient.

**Each user has a personal document into each collection.**

**Each document ID is defined by user identity-Number**

**indentity-Number is an unique combination of numbers/letters (or both) defined on user document-type**

### Sub-collections.
- Consults
    - contains all the pacient consults as documents.
- ExamsAssigned
    - contains all the pacient exams as documents.

### collections Data

**User**

```json
const users = [
    {
        "userId": "MOORO25631EREW25",
        "UserData": {
            "lastName": "User",
            "name": "New",
            "numberContact": 555555,
            "email": "newuser@gmail.com",
            "rol": "Admin",
            "identityNumber": "MOORO25631EREW25",
            "userStatus": true,
            "documentType": "INE"
        }
    }
]
```

**ClinicHistory**

```json
const clinicHistory = [
    {
        "userId": "MOORO25631EREW25",
        "consults": [
            {
                "consultId": "15-7-2020-23:45:9",
                "consult": {
                    "consultId": "15-7-2020-23:45:9",
                    "date": "15-07-2020",
                    "details":"Pacient presents strong headache"
                }
            }
        ] 
    }
]
```

**Exams** 

```json
const exam = [
    {
        "userId": "MOORO25631EREW25",
        "examsAssigned": [
            {
                "examId": "3QUf7iM5zwyhrX1ajsGIe",
                "exam": {
                    "consultId": "15-7-2020-23:45:9",
                    "examId": "3QUf7iM5zwyhrX1ajsGIe",
                    "typeExam": "Sangre",
                    "indications": "Take exam with at least 5 hours fasting",
                    "aditionalData": "Continue taking current treatment",
                    "pdfURL": "https://firebasestorage.googleapis.com/v0/b/in-vitro-470ae.appspot.com/o/C66ZE-3Og4iRBAQbQIh60.pdf?alt=media",
                    "status": true
                }
            }
        ]
    }
]
```

**DB structure in Firestore.**

~~~
Firestore 
        |Collection|        |Document|        |Sub-Collection|     |Sub-Document|
        +
        + Users ------------UserDocument
        +                               
        +
        + ClinicHistory-----UserDocument---------Consults----------consultDocument   
        +                                                                       
        +                                                                                  
        + Exams-------------UserDocument-------ExamsAssigned--------examDocument
~~~
