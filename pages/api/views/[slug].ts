import * as firestore from '@google-cloud/firestore'
import * as db from '@lib/db'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'POST') {
    const increment = firestore.FieldValue.increment(1)

    const allRef = db.pageviews.doc('all')
    const slugRef = db.pageviews.doc(req.query.slug.toString())

    await Promise.all([
      allRef.set({ count: increment }, { merge: true }),
      slugRef.set({ count: increment }, { merge: true })
    ])
    const views = (await slugRef.get()).data().count

    // 此处打日志，请关注终端控制台输出，而非浏览器上的控制台输出
    // console.log('[views] post increment:', views)
    return res.status(200).json({
      total: views
    })
  }

  if (req.method === 'GET') {
    const snapshot = await db.pageviews.doc(req.query.slug.toString()).get()

    const views = snapshot.data()?.count || 0

    return res.status(200).json({ total: views })
  }
}
