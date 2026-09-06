import { Link, useParams } from 'react-router-dom'
import { AppImage } from '@/components/AppImage/AppImage'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { Tag, ProductTags } from '@/components/Tag/Tag'
import { FavoriteButton } from '@/components/FavoriteButton/FavoriteButton'
import { QuantitySelector } from '@/components/QuantitySelector/QuantitySelector'
import { ProductOptions } from '@/components/ProductOptions/ProductOptions'
import { ProductGrid } from '@/components/ProductGrid/ProductGrid'
import { SectionHeader } from '@/components/SectionHeader/SectionHeader'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { useProductSelections } from '@/hooks/useProductSelections'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getItemById, getRelatedItems } from '@/data/menu'
import { getCategoryName } from '@/data/categories'
import { formatPrice, calculateDiscountPercentage } from '@/utils/money'
import styles from './ProductDetails.module.css'

/** Full page for one product, reached from a card or a direct link. */
export function ProductDetails() {
  const { itemId } = useParams()
  const item = getItemById(itemId)

  if (!item) {
    return (
      <div className={`page-container ${styles.notFound}`}>
        <EmptyState
          icon="search"
          title="We could not find that item"
          description="It may have come off the menu. Have a look at what we are serving today."
          actionLabel="Back to the menu"
          actionTo="/menu"
        />
      </div>
    )
  }

  return <ProductDetailsContent key={item.id} item={item} />
}

/** Split out so `key` resets the option state when the product changes. */
function ProductDetailsContent({ item }) {
  const addToCart = useAddToCart()
  const { selections, selectOption, isSelected, quantity, setQuantity, totalPrice } =
    useProductSelections(item)

  useDocumentTitle(item.name, item.description)

  const discount = calculateDiscountPercentage(item.price, item.oldPrice)
  const relatedItems = getRelatedItems(item)

  return (
    <>
      <div className={`page-container ${styles.page}`}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/menu">Menu</Link>
          <Icon name="chevronRight" size={14} />
          <Link to={`/menu?category=${item.category}`}>{getCategoryName(item.category)}</Link>
          <Icon name="chevronRight" size={14} />
          <span aria-current="page">{item.name}</span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.mediaColumn}>
            <div className={styles.mediaWrap}>
              <AppImage
                src={item.image}
                alt={item.name}
                ratio="hero"
                priority
                className={styles.image}
              />
              {discount > 0 && (
                <Tag tone="primary" className={styles.discountBadge}>
                  −{discount}%
                </Tag>
              )}
              <FavoriteButton item={item} className={styles.favorite} />
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.tags}>
              <ProductTags item={item} />
            </div>

            <h1 className={styles.name}>{item.name}</h1>
            <p className={styles.description}>{item.description}</p>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(item.price)}</span>
              {item.oldPrice && (
                <span className={styles.oldPrice}>{formatPrice(item.oldPrice)}</span>
              )}
              {item.calories != null && (
                <span className={styles.calories}>{item.calories} kcal</span>
              )}
            </div>

            <ProductOptions item={item} selectOption={selectOption} isSelected={isSelected} />

            <div className={styles.addRow}>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
              <Button
                size="lg"
                fullWidth
                onClick={() => addToCart(item, selections, quantity)}
              >
                Add to basket · {formatPrice(totalPrice)}
              </Button>
            </div>

            <p className={styles.note}>
              <Icon name="info" size={16} />
              Allergen information is available at every branch. Ask our team if you are unsure.
            </p>
          </div>
        </div>
      </div>

      {relatedItems.length > 0 && (
        <section className={`page-container ${styles.related}`} aria-labelledby="related-title">
          <SectionHeader
            id="related-title"
            eyebrow="You might also like"
            title={`More ${getCategoryName(item.category).toLowerCase()}`}
            linkTo={`/menu?category=${item.category}`}
            linkLabel="See all"
          />
          <ProductGrid items={relatedItems} />
        </section>
      )}
    </>
  )
}
