import * as functions from "firebase-functions";
import admin from "firebase-admin";

//@ts-ignore https://github.com/firebase/firebase-tools/issues/2378
import * as tools from "firebase-tools";

admin.initializeApp();

const logger = functions.logger;

/**
 *
 * @param {string} data.path the document or collection path to delete.
 */
export const deleteCourse = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "2GB",
  })
  .https.onCall(async (data, context) => {
    try {
      // Only allow admin users to execute this function.
      if (!(context.auth && context.auth.token)) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Must be user"
        );
      }

      const path = data.path;
      logger.log(
        `User ${context.auth.uid} has requested to delete path ${path}`
      );

      await deleteResource(data.path);

      return { path };
    } catch (err) {
      return { error: err };
    }
  });

/**
 *
 * @param {string} data.path the document or collection path to delete.
 */
export const deletePost = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "2GB",
  })
  .https.onCall(async (data, context) => {
    try {
      // Only allow admin users to execute this function.
      if (!(context.auth && context.auth.token)) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Must be user"
        );
      }

      const path = data.path;
      logger.log(
        `User ${context.auth.uid} has requested to delete path ${path}`
      );

      await deleteResource(data.path);

      return { path };
    } catch (err) {
      return { error: err };
    }
  });

/**
 * Initiate a recursive delete of documents at a given path.
 *
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 *
 * @param {string} path the document or collection path to delete.
 */
const deleteResource = async (path: string) => {
  try {
    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    const res = await tools.firestore.delete(path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      // token: functions.config().fb.token
    });
    console.log(res);
  } catch (err) {
    logger.error(`Error deleting resource: ${path}`);
    throw new Error(err);
  }
};
