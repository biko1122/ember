import { PageHeader } from '@/components/PageHeader/PageHeader'
import { SectionHeader } from '@/components/SectionHeader/SectionHeader'
import {
  EarningRules,
  LoyaltyBalanceCard,
  PointsHistory,
  RewardsGrid,
  TierLadder,
} from '@/components/Loyalty/Loyalty'
import { useLoyalty } from '@/context/LoyaltyContext'
import { useToast } from '@/context/ToastContext'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { loyaltySettings } from '@/config/restaurant'
import styles from './Rewards.module.css'

/**
 * Ember Rewards — the programme explained, plus the member's own balance,
 * catalogue and history when they are signed in.
 *
 * DEMO NOTE: points are simulated in the browser. See context/LoyaltyContext.
 */
export function Rewards() {
  const { isMember, redeem } = useLoyalty()
  const { showToast } = useToast()

  useDocumentTitle(
    'Ember Rewards',
    `Earn ${loyaltySettings.pointsPerEgp} point for every EGP you spend, and turn them into free food.`,
  )

  const handleRedeem = async (reward) => {
    const result = await redeem(reward.id)

    if (result.error) {
      showToast(result.error, { variant: 'error' })
      return
    }

    showToast(`${reward.name} is yours — we will apply it to your next order.`)
  }

  return (
    <>
      <PageHeader
        eyebrow={loyaltySettings.programName}
        title="Every order earns you something"
        description={`Collect ${loyaltySettings.pointsPerEgp} point for every EGP you spend, then swap them for the food you already order.`}
      />

      <div className={`page-container ${styles.page}`}>
        <LoyaltyBalanceCard variant="banner" />

        <section aria-labelledby="how-it-works-title" className={styles.section}>
          <SectionHeader
            id="how-it-works-title"
            eyebrow="How it works"
            title="Four things worth knowing"
          />
          <EarningRules />
        </section>

        <section aria-labelledby="rewards-title" className={styles.section}>
          <SectionHeader
            id="rewards-title"
            eyebrow="The catalogue"
            title="What your points are worth"
            description="Redeem whenever you like — rewards are applied to your next order."
          />
          <RewardsGrid onRedeem={handleRedeem} />
        </section>

        <section aria-labelledby="tiers-title" className={styles.section}>
          <SectionHeader
            id="tiers-title"
            eyebrow="Tiers"
            title="Order more, earn faster"
            description="Tiers are worked out from the points you have earned over your lifetime, not your balance — spending your points never sets you back."
          />
          <TierLadder />
        </section>

        {isMember && (
          <section aria-labelledby="history-title" className={styles.section}>
            <SectionHeader
              id="history-title"
              eyebrow="Your activity"
              title="Points history"
              linkTo="/account"
              linkLabel="Go to my account"
            />
            <div className={styles.historyPanel}>
              <PointsHistory />
            </div>
          </section>
        )}

        <p className={styles.demoNote}>
          Prototype note: Ember Rewards is simulated in your browser for this preview. Points,
          tiers and redemptions move to the server in the next phase.
        </p>
      </div>
    </>
  )
}
