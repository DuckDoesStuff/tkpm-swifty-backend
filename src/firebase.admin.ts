import { initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

export const app = initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const storage = getStorage(app);

export const deleteAllUsers = (nextPageToken?) => {
  let uids = []
  admin
    .auth()
    .listUsers(100, nextPageToken)
    .then((listUsersResult) => {
      uids = uids.concat(listUsersResult.users.map((userRecord) => userRecord.uid))
      console.log(uids)
      if (listUsersResult.pageToken) {
        deleteAllUsers(listUsersResult.pageToken);
      }
    })
    .catch((error) => {
      console.log('Error listing users:', error);
    }).finally(() => {
      admin.auth().deleteUsers(uids)
    })
};