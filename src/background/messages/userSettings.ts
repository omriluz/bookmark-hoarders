import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getUserSettings, setUserSettings } from "~utils/userSettings"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { message } = req.body || {}
  switch (message) {
    case "get":
      const userSettings = await getUserSettings()
      res.send(userSettings)
      break
    case "set":
      setUserSettings()
      break
  }
}

export default handler
