import { Storage } from "@plasmohq/storage"

const METADATA_API_ENDPOINT = "https://jsonlink.io/api/extract?url="
const STORAGE_KEY = "bookmarks"
const STACK_SIZE = 30

async function getMetadataFromUrl(url: string) {
  if (!url) return
  try {
    const res = await fetch(`${METADATA_API_ENDPOINT}${url}`)
    const metadata = await res.json()
    return metadata
  } catch (err) {
    console.warn("exited with error: ", err)
  }
}

export async function getBookmarkUrls() {
  const tree = await chrome.bookmarks.search("https://")
  const filteredTree = tree.filter(
    ({ url }) => url.startsWith("https://") && !url.endsWith(".pdf")
  )
  return filteredTree
}

export async function setBookmarks() {
  console.log('got to setbookmarks');
  
  const storage = new Storage({ area: "local" })
  const storageValue = await storage.get(STORAGE_KEY)
  let bookmarkAmount = 0
  if (storageValue) {
    bookmarkAmount = JSON.parse(storageValue).length || 0
  }

  if (bookmarkAmount < STACK_SIZE) {
    const tree = await getBookmarkUrls()
    const metadata = await Promise.all(
      tree
        .slice(bookmarkAmount, STACK_SIZE)
        .map(async ({ url, id }) => {
          try {
            const metadata = await getMetadataFromUrl(url)
            return { ...metadata, id }
          } catch (error) {
            return null
          }
        })
        .filter(Boolean)
    )

    await storage.set(STORAGE_KEY, JSON.stringify(metadata))
  }
}
