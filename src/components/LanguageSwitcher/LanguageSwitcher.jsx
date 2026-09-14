import { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon/Icon'
import styles from './LanguageSwitcher.module.css'

/**
 * The header's language control.
 *
 * The site has no translation layer yet, so this only sets the document's
 * `lang` — the copy stays English either way. It deliberately does not flip
 * `dir` to RTL: mirroring the whole layout under English text reads as a bug,
 * not as Arabic. When real strings arrive, this component is the one place
 * that has to start writing the choice somewhere shared instead of straight
 * onto <html>, and the direction flip belongs in that same change.
 *
 * The label shows the language you would switch *to*, which is how every
 * two-language site does it: tapping "العربية" is a promise, not a status.
 */
const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'العربية', name: 'العربية' },
]

export function LanguageSwitcher() {
  const [code, setCode] = useState('en')

  const current = LANGUAGES.find((language) => language.code === code)
  const next = LANGUAGES.find((language) => language.code !== code)

  useEffect(() => {
    document.documentElement.lang = current.code
  }, [current])

  return (
    <button
      type="button"
      className={styles.switcher}
      onClick={() => setCode(next.code)}
      lang={next.code}
      title={`Switch to ${next.name}`}
    >
      <Icon name="globe" size={19} />
      <span className={styles.label}>{next.label}</span>
      <span className="visually-hidden">Switch language to {next.name}</span>
    </button>
  )
}
