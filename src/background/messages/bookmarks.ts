import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { setBookmarks } from "~utils/bookmarks"

const STORAGE_KEY = "bookmarks"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { message } = req.body || {}

  switch (message) {
    case "get":
      const bookmarks = await getBookmarks()
      res.send(bookmarks)
      break
    case "delete":
      const response = await deleteBookmark(req.body.id)
      res.send(response)
    case "set":
    // const response = await setBookmarks()
    // res.send(response)
  }

  res.send({
    message
  })
}

export default handler

async function getBookmarks() {
  const storage = new Storage({ area: "local" })
  let storageValue = await storage.get(STORAGE_KEY)
  if (!storageValue) {
    await setBookmarks()
    storageValue = await storage.get(STORAGE_KEY)
    if (!storageValue) return []
  }
  return JSON.parse(storageValue)
}

async function deleteBookmark(id: string) {
  try {
    const storage = new Storage({ area: "local" })
    const storageValue = await storage.get(STORAGE_KEY)
    const bookmarks = JSON.parse(storageValue)
    const filteredBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id)
    storage.set(STORAGE_KEY, JSON.stringify(filteredBookmarks))

    await chrome.bookmarks.remove(id)
    return "success"
  } catch (err) {
    console.warn("error while removing bookmark:", err)
    return "error"
  }
}
