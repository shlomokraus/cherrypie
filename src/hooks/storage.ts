import { useState, useEffect } from "react";

export const useStorage = (key, defaultValue?) => {
  const [loaded, setLoaded] = useState(false);
  const [storageItem, updateStorage] = useState(defaultValue);

  useEffect(
    () => {
      /**
       * Fallback for localstorage
       */
      if (!chrome.storage) {
        window.addEventListener(
          "storage",
          e => {
            console.log("Event", e);
            const val = e.detail.newval;
            if(val!==storageItem){
              updateStorage(value);
            }
          },
          false
        );

        let value = localStorage.getItem(key);
        if(value){
          value = JSON.parse(value)
        } else {
          value = defaultValue;
        }

        updateStorage(value);
        setLoaded(true);
        return
      }

      chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (!(key in changes)) {
          return;
        }

        let updated = changes[key];

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

        setLoaded(true);
      });

      return () => {
        console.log("Should unsubscribe here");
      };
    },
    [key]
  );

  const updateStorageItem = async value => {
    if (!chrome.storage) {
      return localStorage.setItem(key, JSON.stringify(value));
    }

    return chrome.storage.sync.set({ [key]: value });
  };

  return [storageItem, updateStorageItem, loaded];
};
