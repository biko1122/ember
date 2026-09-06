import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { CheckoutStepper } from '@/components/CheckoutStepper/CheckoutStepper'
import { CartSummary } from '@/components/CartSummary/CartSummary'
import { Button } from '@/components/Button/Button'
import { Icon } from '@/components/Icon/Icon'
import { OrderTypeStep } from '@/pages/Checkout/steps/OrderTypeStep'
import { CustomerDetailsStep } from '@/pages/Checkout/steps/CustomerDetailsStep'
import { FulfilmentStep } from '@/pages/Checkout/steps/FulfilmentStep'
import { PaymentStep } from '@/pages/Checkout/steps/PaymentStep'
import { ReviewStep } from '@/pages/Checkout/steps/ReviewStep'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { useOrders } from '@/hooks/useOrders'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ORDER_TYPES, getOrderType } from '@/data/orderTypes'
import { validateCustomerDetails, validateDeliveryAddress } from '@/utils/validation'
import styles from './Checkout.module.css'

const STEPS = [
  { id: 'order-type', label: 'Order type' },
  { id: 'details', label: 'Your details' },
  { id: 'fulfilment', label: 'Where to' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
]

/**
 * Five-step checkout. One page, one step visible at a time, with all the form
 * values held here so the review step can show everything at once.
 */
export function Checkout() {
  const navigate = useNavigate()
  const { lines, totals, orderType, branchId, promo, isEmpty, setBranchId, clearCart } = useCart()
  const { user, saveAddress } = useAuth()
  const { placeOrder } = useOrders()
  const { isMember, previewPointsForOrder, earnFromOrder } = useLoyalty()

  useDocumentTitle('Checkout', 'Confirm your details and place your order.')

  const [currentStepId, setCurrentStepId] = useState(STEPS[0].id)
  const [errors, setErrors] = useState({})
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [placeOrderError, setPlaceOrderError] = useState(null)

  const [form, setForm] = useState(() => ({
    // Step 2 — who the order is for
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    // Step 3 — delivery address
    area: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    instructions: '',
    saveAddress: false,
    // Step 3 — dine in
    tableNumber: '',
    // Step 4
    paymentMethod: 'cash',
  }))

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const currentIndex = STEPS.findIndex((step) => step.id === currentStepId)
  const orderTypeConfig = getOrderType(orderType)

  /** Which checks a step has to pass before we let people move on. */
  const validateCurrentStep = () => {
    if (currentStepId === 'details') {
      return validateCustomerDetails(form)
    }

    if (currentStepId === 'fulfilment') {
      if (orderTypeConfig.requiresAddress) return validateDeliveryAddress(form)
      if (orderTypeConfig.requiresBranch && !branchId) {
        return { branchId: 'Choose the branch you want to order from.' }
      }
    }

    return {}
  }

  const goToNextStep = () => {
    const stepErrors = validateCurrentStep()

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setErrors({})
    setCurrentStepId(STEPS[Math.min(currentIndex + 1, STEPS.length - 1)].id)
  }

  const goToPreviousStep = () => {
    setErrors({})
    setCurrentStepId(STEPS[Math.max(currentIndex - 1, 0)].id)
  }

  const deliveryAddress = useMemo(
    () => ({
      area: form.area,
      street: form.street,
      building: form.building,
      floor: form.floor,
      apartment: form.apartment,
      instructions: form.instructions,
    }),
    [form],
  )

  /**
   * DEMO NOTE: this saves the order to this browser and shows a confirmation.
   * Nothing is sent to a kitchen and no payment is taken — see
   * services/ordersService.js.
   */
  const handlePlaceOrder = async () => {
    // Guard against a double click landing two orders.
    if (isPlacingOrder) return

    setIsPlacingOrder(true)
    setPlaceOrderError(null)

    const result = await placeOrder({
      lines,
      totals,
      orderType,
      branchId: orderTypeConfig.requiresBranch ? branchId : null,
      customer: { fullName: form.fullName, phone: form.phone, email: form.email },
      deliveryAddress: orderTypeConfig.requiresAddress ? deliveryAddress : null,
      tableNumber: orderType === ORDER_TYPES.DINE_IN ? form.tableNumber : null,
      paymentMethod: form.paymentMethod,
      promoCode: promo?.code ?? null,
      // Recorded on the order so the confirmation and the history agree, even
      // if the earn rate changes later.
      pointsEarned: isMember ? previewPointsForOrder(totals) : 0,
    })

    if (result.error) {
      setPlaceOrderError(result.error)
      setIsPlacingOrder(false)
      return
    }

    if (form.saveAddress && orderTypeConfig.requiresAddress) {
      saveAddress({ label: form.area, ...deliveryAddress })
    }

    // Points post after the order is safely saved, and never block it.
    await earnFromOrder(result.order)

    clearCart()
    navigate(`/orders/${result.order.orderNumber}`, { replace: true })
  }

  // Nothing to check out — send people back to the basket. The order is
  // cleared as part of placing it, so skip this while that is happening.
  if (isEmpty && !isPlacingOrder) {
    return <Navigate to="/cart" replace />
  }

  return (
    <>
      <PageHeader eyebrow="Almost there" title="Checkout" />

      <div className={`page-container ${styles.layout}`}>
        <div className={styles.main}>
          <CheckoutStepper
            steps={STEPS}
            currentStepId={currentStepId}
            onStepClick={setCurrentStepId}
          />

          <div className={styles.stepPanel}>
            {currentStepId === 'order-type' && <OrderTypeStep />}

            {currentStepId === 'details' && (
              <CustomerDetailsStep form={form} errors={errors} onChange={updateField} />
            )}

            {currentStepId === 'fulfilment' && (
              <FulfilmentStep
                form={form}
                errors={errors}
                onChange={updateField}
                orderType={orderType}
                branchId={branchId}
                onBranchChange={(id) => {
                  setBranchId(id)
                  setErrors((current) => ({ ...current, branchId: undefined }))
                }}
              />
            )}

            {currentStepId === 'payment' && (
              <PaymentStep
                selectedMethod={form.paymentMethod}
                onChange={(method) => updateField('paymentMethod', method)}
              />
            )}

            {currentStepId === 'review' && (
              <ReviewStep
                form={form}
                orderType={orderType}
                branchId={branchId}
                onEditStep={setCurrentStepId}
              />
            )}
          </div>

          {placeOrderError && (
            <p className={styles.placeOrderError} role="alert">
              <Icon name="alert" size={17} />
              {placeOrderError}
            </p>
          )}

          {currentStepId === 'review' && isMember && previewPointsForOrder(totals) > 0 && (
            <p className={styles.pointsPreview}>
              <Icon name="gift" size={17} />
              This order earns you{' '}
              <strong>{previewPointsForOrder(totals).toLocaleString('en-GB')} points</strong>.
            </p>
          )}

          <div className={styles.stepActions}>
            {currentIndex > 0 && (
              <Button variant="ghost" onClick={goToPreviousStep} iconBefore="arrowLeft">
                Back
              </Button>
            )}

            {currentStepId === 'review' ? (
              <Button onClick={handlePlaceOrder} isLoading={isPlacingOrder} size="lg">
                Place order
              </Button>
            ) : (
              <Button onClick={goToNextStep} iconAfter="arrowRight">
                Continue
              </Button>
            )}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <CartSummary title="Your order" />
        </aside>
      </div>
    </>
  )
}
