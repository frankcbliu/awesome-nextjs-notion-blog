import * as firestore from '@google-cloud/firestore'
import * as db from '@lib/db'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uuid, helpful, prevState } = req.body

    const increment = firestore.FieldValue.increment(1)
    const decrement = firestore.FieldValue.increment(-1)

    const slugRef = db.feedbacks.doc(req.query.slug)
    const voterRef = db.db
      .collection(`/${db.collections.feedbacks}/${req.query.slug}/voters`)
      .doc(uuid)

    await db.db.runTransaction(async (tx) => {
      const feedback =
        helpful === true ? 'helpful' : helpful === false ? 'unHelpful' : null

      const payload = {} as any

      // Calculate total feedback count for current slug
      if (prevState === null && feedback !== null) {
        payload.count = increment
      } else if (prevState !== null && feedback === null) {
        payload.count = decrement
      }

      if (feedback === 'helpful') {
        payload.helpful = increment
      } else if (feedback === 'unHelpful') {
        payload.unHelpful = increment
      }

      if (prevState !== null) {
        payload[prevState] = decrement
      }

      tx.set(slugRef, payload, { merge: true })
      tx.set(voterRef, { feedback }, { merge: true })
    })

    const data = (await slugRef.get()).data()

    return res.status(200).json({
      helpful: data.helpful,
      unHelpful: data.unHelpful
    })
  }

  if (req.method === 'GET') {
    const { slug, uuid } = req.query
    const [snapshot, voter] = await Promise.all([
      db.feedbacks.doc(slug).get(),
      db.db
        .collection(`/${db.collections.feedbacks}/${req.query.slug}/voters`)
        .doc(uuid)
        .get()
    ])

    const { helpful, unHelpful } = snapshot.data() || {}
    const feedback = voter.data()?.feedback || null

    return res.status(200).json({ helpful, unHelpful, feedback })
  }
}
