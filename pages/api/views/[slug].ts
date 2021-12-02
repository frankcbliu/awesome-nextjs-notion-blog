import * as firestore from '@google-cloud/firestore'
import * as db from '@lib/db'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const increment = firestore.FieldValue.increment(1)

    const allRef = db.pageviews.doc('all')
    const slugRef = db.pageviews.doc(req.query.slug)

    await Promise.all([
      allRef.set({ count: increment }, { merge: true }),
      slugRef.set({ count: increment }, { merge: true })
    ])
    const views = (await slugRef.get()).data().count

    return res.status(200).json({
      total: views
    })
  }

  if (req.method === 'GET') {
    const snapshot = await db.pageviews.doc(req.query.slug).get()

    const views = snapshot.data()?.count || 0

    return res.status(200).json({ total: views })
  }
}
