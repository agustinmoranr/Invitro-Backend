
const test = require("firebase-functions-test")(
  {//ATTENTON: Fill all missing values before testing
    databaseURL: "",
    projectId: "",
    storageBucket: "",
  },
  "./test/credentials.json"
);

//ATTENTON: Fill all missing values before testing
test.mockConfig({
  "configuration": {
    "email": "",
    "password": ""
  }
});

const functions = require('./../index')

describe('functions', ()=>{
    after(()=>{
        test.cleanup()
    })

    describe('createUserTest', ()=>{
        it('createUser', (done) =>{
            const createUserWrap = test.wrap(functions.createUser)
            //ATTENTON: Fill all missing values before testing
            const data = {"displayName": "Pepe", "email": ""}
            createUserWrap(data)
            .then(()=>{
                return done()
            })
            .catch(error=>{
                done(error)
            })
        })
    })
})