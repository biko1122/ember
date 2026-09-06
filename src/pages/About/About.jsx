import { PageHeader } from '@/components/PageHeader/PageHeader'
import { AppImage } from '@/components/AppImage/AppImage'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { restaurant } from '@/config/restaurant'
import { branches } from '@/data/branches'
import styles from './About.module.css'

/** What we stand for — kept short and specific rather than filler copy. */
const values = [
  {
    icon: 'flame',
    title: 'Cooked, not reheated',
    description:
      'Every burger hits the grill when your order lands. Nothing is pre-cooked and held.',
  },
  {
    icon: 'leaf',
    title: 'Short supplier list',
    description:
      'One butcher, one baker, one produce market. We have used the same three since day one.',
  },
  {
    icon: 'star',
    title: 'A menu we can defend',
    description:
      'If a dish is not better than what you would make at home, it comes off the menu.',
  },
  {
    icon: 'user',
    title: 'Paid properly',
    description:
      'Our kitchen teams are salaried, trained in-house and share in every branch’s tips.',
  },
]

const milestones = [
  { year: '2016', text: 'One counter, three stools, one charcoal grill in Zamalek.' },
  { year: '2019', text: 'The Double Crispy Stack arrives and immediately outsells everything.' },
  { year: '2022', text: 'Our own bakery opens, so every bun is baked the morning it is served.' },
  { year: '2026', text: `${branches.length} branches, same grill, same standard.` },
]

export function About() {
  useDocumentTitle(
    'Our story',
    `How ${restaurant.name} started, what we cook, and the standards we hold ourselves to.`,
  )

  return (
    <>
      <PageHeader
        eyebrow={`Since ${restaurant.foundedYear}`}
        title="One grill, one obsession"
        description={`${restaurant.name} began as a single counter with a charcoal grill that never quite cooled down. Ten years on, we still cook the same way.`}
      />

      <div className={`page-container ${styles.page}`}>
        {/* Story ---------------------------------------------------------- */}
        <section className={styles.story} aria-labelledby="story-title">
          <AppImage
            src="/assets/images/restaurant/restaurant-interior.svg"
            alt="The dining room at our Zamalek branch"
            ratio="wide"
            className={styles.storyImage}
          />

          <div className={styles.storyText}>
            <h2 id="story-title">How it started</h2>
            <p>
              Two cooks, a second-hand grill and a stubborn belief that fast food does not have to
              taste like a compromise. We opened with six things on the menu and sold out by nine
              o&rsquo;clock on the first night.
            </p>
            <p>
              We have added a few dishes since, but the rule has not changed: if we would not
              happily eat it on our own day off, it does not go out of the kitchen.
            </p>

            <Button to="/menu" iconAfter="arrowRight">
              See what we cook
            </Button>
          </div>
        </section>

        {/* Values --------------------------------------------------------- */}
        <section aria-labelledby="values-title">
          <h2 id="values-title" className={styles.sectionTitle}>
            What we hold ourselves to
          </h2>

          <ul className={styles.valueGrid}>
            {values.map((value) => (
              <li key={value.title} className={styles.value}>
                <span className={styles.valueIcon}>
                  <Icon name={value.icon} size={22} />
                </span>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueText}>{value.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline ------------------------------------------------------- */}
        <section aria-labelledby="timeline-title">
          <h2 id="timeline-title" className={styles.sectionTitle}>
            A short history
          </h2>

          <ol className={styles.milestones}>
            {milestones.map((milestone) => (
              <li key={milestone.year} className={styles.milestone}>
                <span className={styles.milestoneYear}>{milestone.year}</span>
                <p className={styles.milestoneText}>{milestone.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Gallery -------------------------------------------------------- */}
        <section className={styles.gallery} aria-label="Photos from our kitchens">
          <AppImage
            src="/assets/images/restaurant/restaurant-grill.svg"
            alt="A cook working the open grill"
            ratio="square"
            className={styles.galleryImage}
          />
          <AppImage
            src="/assets/images/restaurant/restaurant-team.svg"
            alt="Our kitchen team before service"
            ratio="square"
            className={styles.galleryImage}
          />
          <AppImage
            src="/assets/images/restaurant/restaurant-bakery.svg"
            alt="Buns coming out of our bakery"
            ratio="square"
            className={styles.galleryImage}
          />
        </section>

        {/* Contact -------------------------------------------------------- */}
        <section id="contact" className={styles.contact} aria-labelledby="contact-title">
          <div>
            <h2 id="contact-title" className={styles.sectionTitle}>
              Talk to us
            </h2>
            <p className={styles.contactText}>
              Something not right with an order, or just want to tell us about a dish? We answer
              every message.
            </p>
          </div>

          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <Icon name="phone" size={18} />
              <a href={`tel:${restaurant.contact.phone}`}>{restaurant.contact.phone}</a>
            </li>
            <li className={styles.contactItem}>
              <Icon name="mail" size={18} />
              <a href={`mailto:${restaurant.contact.email}`}>{restaurant.contact.email}</a>
            </li>
            <li className={styles.contactItem}>
              <Icon name="clock" size={18} />
              {restaurant.contact.supportHours}
            </li>
          </ul>
        </section>

        {/* Legal ---------------------------------------------------------- */}
        <section id="privacy" className={styles.legal} aria-labelledby="privacy-title">
          <h2 id="privacy-title" className={styles.legalTitle}>
            Privacy Policy
          </h2>
          <p>
            This site is a front-end demo. Everything you enter — your account, your basket, your
            saved addresses and your order history — is stored in your own browser using
            localStorage. Nothing is transmitted to a server, and no analytics or tracking scripts
            run on this site. Clearing your browser data removes all of it permanently.
          </p>
        </section>

        <section id="terms" className={styles.legal} aria-labelledby="terms-title">
          <h2 id="terms-title" className={styles.legalTitle}>
            Terms &amp; Conditions
          </h2>
          <p>
            {restaurant.name} is a fictional restaurant built as a demonstration project. Orders
            placed here are not sent to any kitchen, no payment is processed, and no food will
            arrive. Prices, branches and menu items are illustrative. Replace this text with your
            real terms before using this site commercially.
          </p>
        </section>
      </div>
    </>
  )
}
