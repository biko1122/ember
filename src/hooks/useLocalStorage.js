import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '@/utils/storage'

/**
 * useState that survives a page reload.
 * Same API as useState, plus the value is mirrored into localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue))

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset]
}
