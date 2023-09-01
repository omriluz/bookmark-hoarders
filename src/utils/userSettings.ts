import { Storage } from "@plasmohq/storage"


const USER_SETTINGS_STORAGE_KEY = "USER_SETTINGS"

export async function getUserSettings() {
    const storage = new Storage()
    let userSettings = await storage.get(USER_SETTINGS_STORAGE_KEY)
    if (!userSettings) {
      const basicDefaultUserSettings = {
        deleteOnClick: false
      }
      await storage.set(USER_SETTINGS_STORAGE_KEY, basicDefaultUserSettings)
  
      userSettings = await storage.get(USER_SETTINGS_STORAGE_KEY)
    }
    return userSettings
  }


export async   function setUserSettings() {
    let functionName = arguments.callee.name
    console.log("hello from ", functionName)
  }
  