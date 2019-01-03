import { useState, useEffect } from "react";

export const useStorage = (key, defaultValue?) => {
  const [loaded, setLoaded] = useState(false);
  const [storageItem, updateStorage] = useState(defaultValue);

  useEffect(
    () => {
      chrome.storage.onChanged.addListener(function(changes, namespace) {

        if (!(key in changes)) {
          return;
        }

        let updated = changes[key];
        console.log("Got updated for ", key, "with value", updated)

        if (updated) {
          updateStorage(updated.newValue);
        } else {
          updateStorage(updated);
        }
      });

      chrome.storage.sync.get([key], result => {
        let value = result[key];
        if (!value) {
          chrome.storage.sync.set({ [key]: defaultValue });
        } else {
          updateStorage(value);
        }

        console.log("Setting loaded to true");
        setLoaded(true);
      });
    },
    [key]
  );

  const updateStorageItem = async value => {
    console.log("Setting", value, "for key", key);
    return chrome.storage.sync.set({ [key]: value });
  };

  return [storageItem, updateStorageItem, loaded];
};
