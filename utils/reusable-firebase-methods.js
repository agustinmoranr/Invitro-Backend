// Many firebase-methods are frequently reusable in code. That's why this file exists

async function getSubCollectionDoc(collectionRef, docId, subCollection, array, message, dataId, data, errorMessage) {
    //Get subcollection docs
    return await collectionRef
    .doc(docId)
    .collection(subCollection)
    .get()

    .then((snapshot) => {
        return snapshot.forEach((doc) => {
            if(!doc.exists) {
                return array.push({message: message});
            }
            // Push each doc into an Array
            else {
                return array.push({
                    [dataId]: doc.id,
                    [data]: doc.data()
                });
            }
        });
    })
    .catch(err => {
        console.log(errorMessage, err);
        throw new Error('Error getting subcollection document', err.message); 
    }); 
}

async function updateAuthenticationValue(getUserQuery, authService, property, value) {
    // Get user 
    await getUserQuery
    .then(async (userRecord) => {
        console.log('user', userRecord.email);
        //Update a property value
        return await authService.updateUser(userRecord.uid, {
            [property]: value
        })
        .then((userRecord) => {
            return console.log('Successfully updated user. New data:', userRecord);
        });
    })
    .catch((error) => {
        throw new Error('Error updating authentication value', error.message);
    });
}


module.exports = {
    getSubCollectionDoc,
    updateAuthenticationValue
};
