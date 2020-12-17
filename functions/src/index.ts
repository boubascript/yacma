import * as functions from "firebase-functions";
import admin from "firebase-admin";
import redis from "redis";
import asyncRedis from "async-redis";

//@ts-ignore https://github.com/firebase/firebase-tools/issues/2378
import * as tools from "firebase-tools";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://yacma-295322.firebaseio.com",
});

const db = admin.firestore();
const usersRef = db.collection("users");

const REDISHOST = functions.config().redis?.host || "localhost";
const REDISPORT = functions.config().redis?.port || 6379;

const client = redis.createClient(REDISPORT, REDISHOST);
client.on("error", (err) => console.error("ERR:REDIS:", err));

const redisClient = asyncRedis.decorate(client);

const logger = functions.logger;

const options: functions.RuntimeOptions = {
  timeoutSeconds: 540,
  memory: "2GB",
  vpcConnector:
    "projects/yacma-295322/locations/us-east1/connectors/yacma-connector",
};
/**
 *
 * @param {string} data.path the document or collection path to delete.
 */
export const deleteCourse = functions
  .region("us-east1")
  .runWith(options)
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

      const courseId = path.split("/").pop();
      const batch = db.batch();
      const usersToUpdate = await usersRef
        .where("courses", "array-contains", courseId)
        .get();

      logger.log(
        `Removing course id from ${usersToUpdate.docs.length} users...`
      );
      usersToUpdate.docs.forEach((user) => {
        batch.update(usersRef.doc(user.id), {
          courses: admin.firestore.FieldValue.arrayRemove(courseId),
        });
      });

      await batch.commit();

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
  .region("us-east1")
  .runWith(options)
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
    await tools.firestore.delete(path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      // token: functions.config().fb.token
    });
    await redisClient.del(path);
  } catch (err) {
    logger.error(`Error deleting resource: ${path}`);
    throw new Error(err);
  }
};
