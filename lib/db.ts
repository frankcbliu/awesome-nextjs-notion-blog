import * as firestore from '@google-cloud/firestore'
import * as config from './config'

export let db: firestore.Firestore = null
export let images: firestore.CollectionReference = null
export let pageviews: firestore.CollectionReference = null
export let feedbacks: firestore.CollectionReference = null

export const collections = {
  images: config.firebaseCollectionImages,
  pageviews: config.firebaseCollectionPageviews,
  feedbacks: config.firebaseCollectionFeedbacks
}

if (config.isPreviewImageSupportEnabled) {
  db = new firestore.Firestore({
    projectId: config.googleProjectId,
    credentials: config.googleApplicationCredentials
  })

  images = db.collection(collections.images)
  pageviews = db.collection(collections.pageviews)
  feedbacks = db.collection(collections.feedbacks)
}
