// Many firebase-methods are frequently reusable in code. That's why this file exists

async function getSubCollectionDoc(collectionRef, docId, subCollection, array, message, dataId, data, errorMessage) {
    return await collectionRef
    .doc(docId)
    .collection(subCollection)
    .get()

    .then((snapshot) => {
        return snapshot.forEach((doc) => {
            if(!doc.exists) {
                return array.push({message: message});
            }
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
    }); 
}

async function updateAuthenticationValue(getUserQuery, authService, property, value) {
    await getUserQuery
    .then(async (userRecord) => {
        console.log('user', userRecord.toJSON());
        return await authService.updateUser(userRecord.uid, {
            [property]: value
        })
        .then((userRecord) => {
            return console.log('Successfully updated user', userRecord.toJSON());
        });
    });
}


module.exports = {
    getSubCollectionDoc,
    updateAuthenticationValue
};
