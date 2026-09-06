import { PageHeader } from '@/components/PageHeader/PageHeader'
import { BranchCard } from '@/components/BranchCard/BranchCard'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { branches } from '@/data/branches'
import { restaurant } from '@/config/restaurant'
import styles from './Branches.module.css'

/** Every branch, with hours, services and a link out to maps. */
export function Branches() {
  useDocumentTitle(
    'Locations',
    `Find your nearest ${restaurant.name} branch — opening hours, delivery areas and contact details.`,
  )

  return (
    <>
      <PageHeader
        eyebrow="Locations"
        title="Find your nearest kitchen"
        description={`${branches.length} branches across Cairo, Giza and Alexandria. Every one of them cooks to the same standard.`}
      />

      <div className={`page-container ${styles.page}`}>
        <ul className={styles.grid}>
          {branches.map((branch) => (
            <li key={branch.id}>
              <BranchCard branch={branch} />
            </li>
          ))}
        </ul>

        <p className={styles.note}>
          Opening hours can change on public holidays — call the branch on {restaurant.contact.phone}{' '}
          if you are making a special trip.
        </p>
      </div>
    </>
  )
}
