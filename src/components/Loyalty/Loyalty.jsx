import { Link } from 'react-router-dom'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { Tag } from '@/components/Tag/Tag'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { LoadingRegion, Skeleton } from '@/components/Skeleton/Skeleton'
import { useLoyalty } from '@/context/LoyaltyContext'
import { loyaltySettings } from '@/config/restaurant'
import { earningRules, pointsToCurrency, rewards } from '@/data/loyalty'
import { formatPrice } from '@/utils/money'
import { formatOrderDate } from '@/utils/orders'
import styles from './Loyalty.module.css'

/**
 * Ember Rewards, on screen.
 *
 * These all read from LoyaltyContext rather than taking a balance as a prop,
 * so the number on the account page and the number in the navbar can never
 * disagree. See config/restaurant.js for the rules they describe.
 */

export const formatPoints = (points = 0) => Math.round(points).toLocaleString('en-GB')

/* -- Tier badge ------------------------------------------------------------ */

export function TierBadge({ tier, className = '' }) {
  return (
    <span className={`${styles.tierBadge} ${className}`} data-tier={tier.id}>
      <Icon name="medal" size={15} strokeWidth={2} />
      {tier.name}
    </span>
  )
}

/* -- Progress bar ---------------------------------------------------------- */

function ProgressBar({ percentage, label }) {
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span className={styles.fill} style={{ width: `${percentage}%` }} />
    </div>
  )
}

/* -- The balance card ------------------------------------------------------ */

/**
 * The headline panel: balance, what it is worth, tier, and how far off the
 * next reward is. `variant="panel"` is the account page; "banner" is the wider
 * version used at the top of the rewards page.
 */
export function LoyaltyBalanceCard({ variant = 'panel' }) {
  const { isMember, isLoading, error, balance, tier, tierProgress, nextReward } = useLoyalty()

  if (!isMember) {
    return (
      <div className={`${styles.balanceCard} ${styles[variant]}`}>
        <div className={styles.balanceHead}>
          <div>
            <p className={styles.eyebrow}>{loyaltySettings.programName}</p>
            <h2 className={styles.balanceTitle}>Earn on every order</h2>
          </div>
        </div>
        <p className={styles.guestCopy}>
          Join and we will drop {formatPoints(loyaltySettings.joiningBonus)} points into your
          account straight away — enough for a free portion of fries and a drink.
        </p>
        <div className={styles.guestActions}>
          <Button to="/signup" size="lg">
            Join Ember Rewards
          </Button>
          <Button to="/login" variant="outline" size="lg">
            I already have an account
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <LoadingRegion label="Loading your points" className={`${styles.balanceCard} ${styles[variant]}`}>
        <Skeleton width="9rem" height="0.8rem" />
        <Skeleton shape="title" width="11rem" height="3rem" style={{ marginTop: '0.75rem' }} />
        <Skeleton width="100%" height="0.5rem" style={{ marginTop: '1.75rem' }} />
        <Skeleton width="70%" height="0.8rem" style={{ marginTop: '0.75rem' }} />
      </LoadingRegion>
    )
  }

  if (error) {
    return (
      <div className={`${styles.balanceCard} ${styles[variant]}`}>
        <p className={styles.error} role="alert">
          <Icon name="alert" size={18} />
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className={`${styles.balanceCard} ${styles[variant]}`}>
      <div className={styles.balanceHead}>
        <div>
          <p className={styles.eyebrow}>{loyaltySettings.programName}</p>
          <p className={styles.balanceValue}>
            {formatPoints(balance)}
            <span className={styles.balanceUnit}>points</span>
          </p>
          <p className={styles.balanceWorth}>
            Worth about {formatPrice(pointsToCurrency(balance))} off your next order
          </p>
        </div>

        <TierBadge tier={tier} />
      </div>

      {nextReward ? (
        <div className={styles.progressBlock}>
          <div className={styles.progressLabels}>
            <span>
              {formatPoints(balance)} / {formatPoints(nextReward.cost)}
            </span>
            <span className={styles.progressGoal}>{nextReward.name}</span>
          </div>

          <ProgressBar
            percentage={Math.min(100, Math.round((balance / nextReward.cost) * 100))}
            label={`Progress towards ${nextReward.name}`}
          />

          <p className={styles.progressCaption}>
            <Icon name="gift" size={15} />
            {formatPoints(nextReward.cost - balance)} points until your next reward
          </p>
        </div>
      ) : (
        <p className={styles.progressCaption}>
          <Icon name="sparkle" size={15} />
          Every reward is unlocked. Go and spend some.
        </p>
      )}

      {tierProgress.nextTier && (
        <p className={styles.tierCaption}>
          {formatPoints(tierProgress.pointsToNextTier)} more lifetime points to reach{' '}
          <strong>{tierProgress.nextTier.name}</strong> — {tierProgress.nextTier.perk.toLowerCase()}.
        </p>
      )}
    </div>
  )
}

/* -- Tier ladder ----------------------------------------------------------- */

export function TierLadder() {
  const { isMember, tier: currentTier, tierProgress } = useLoyalty()

  return (
    <ol className={styles.tierLadder}>
      {loyaltySettings.tiers.map((tier) => {
        const isCurrent = isMember && tier.id === currentTier.id
        const isReached = isMember && tierProgress.tier.threshold >= tier.threshold

        return (
          <li key={tier.id} className={styles.tierStep} data-current={isCurrent} data-reached={isReached}>
            <div className={styles.tierStepHead}>
              <TierBadge tier={tier} />
              {isCurrent && <Tag tone="primary">You are here</Tag>}
            </div>
            <p className={styles.tierThreshold}>
              {tier.threshold === 0
                ? 'From your first order'
                : `${formatPoints(tier.threshold)} lifetime points`}
            </p>
            <p className={styles.tierPerk}>{tier.perk}</p>
          </li>
        )
      })}
    </ol>
  )
}

/* -- How it works ---------------------------------------------------------- */

export function EarningRules() {
  return (
    <ul className={styles.rules}>
      {earningRules.map((rule) => (
        <li key={rule.title} className={styles.rule}>
          <span className={styles.ruleIcon}>
            <Icon name={rule.icon} size={20} />
          </span>
          <div>
            <h3 className={styles.ruleTitle}>{rule.title}</h3>
            <p className={styles.ruleDescription}>{rule.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/* -- Rewards --------------------------------------------------------------- */

function RewardCard({ reward, balance, isMember, isRedeeming, onRedeem }) {
  const canAfford = isMember && balance >= reward.cost
  const shortfall = reward.cost - balance

  return (
    <li className={styles.reward} data-affordable={canAfford}>
      <span className={styles.rewardIcon}>
        <Icon name={reward.icon} size={22} />
      </span>

      <div className={styles.rewardBody}>
        <h3 className={styles.rewardName}>{reward.name}</h3>
        <p className={styles.rewardDescription}>{reward.description}</p>
      </div>

      <div className={styles.rewardFooter}>
        <span className={styles.rewardCost}>{formatPoints(reward.cost)} pts</span>

        {!isMember ? (
          <Button to="/signup" size="sm" variant="outline">
            Join to unlock
          </Button>
        ) : (
          <Button
            size="sm"
            variant={canAfford ? 'primary' : 'ghost'}
            disabled={!canAfford}
            isLoading={isRedeeming}
            onClick={() => onRedeem(reward)}
          >
            {canAfford ? 'Redeem' : `${formatPoints(shortfall)} to go`}
          </Button>
        )}
      </div>
    </li>
  )
}

export function RewardsGrid({ onRedeem }) {
  const { isMember, balance, redeemingRewardId } = useLoyalty()

  return (
    <ul className={styles.rewardsGrid}>
      {[...rewards]
        .sort((a, b) => a.cost - b.cost)
        .map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            balance={balance}
            isMember={isMember}
            isRedeeming={redeemingRewardId === reward.id}
            onRedeem={onRedeem}
          />
        ))}
    </ul>
  )
}

/* -- History --------------------------------------------------------------- */

export function PointsHistory({ limit }) {
  const { isLoading, history } = useLoyalty()

  if (isLoading) {
    return (
      <LoadingRegion label="Loading your points history" className={styles.history}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={styles.historyRow}>
            <div className={styles.historyText}>
              <Skeleton width="11rem" />
              <Skeleton width="7rem" height="0.7rem" />
            </div>
            <Skeleton width="4rem" />
          </div>
        ))}
      </LoadingRegion>
    )
  }

  if (history.length === 0) {
    return (
      <EmptyState
        icon="sparkle"
        title="No points yet"
        description="Place your first order and your points will show up here straight away."
        actionLabel="Browse the menu"
        actionTo="/menu"
      />
    )
  }

  const shown = limit ? history.slice(0, limit) : history

  return (
    <ul className={styles.history}>
      {shown.map((entry) => {
        const isEarn = entry.points > 0

        return (
          <li key={entry.id} className={styles.historyRow}>
            <span className={styles.historyIcon} data-earn={isEarn}>
              <Icon name={isEarn ? 'plus' : 'gift'} size={16} strokeWidth={2.2} />
            </span>

            <div className={styles.historyText}>
              {entry.orderNumber ? (
                <Link to={`/orders/${entry.orderNumber}`} className={styles.historyReason}>
                  {entry.reason}
                </Link>
              ) : (
                <p className={styles.historyReason}>{entry.reason}</p>
              )}
              <p className={styles.historyDate}>{formatOrderDate(entry.at)}</p>
            </div>

            <span className={styles.historyPoints} data-earn={isEarn}>
              {isEarn ? '+' : '−'}
              {formatPoints(Math.abs(entry.points))}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
