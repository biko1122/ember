import { Route, Routes } from 'react-router-dom'
import { Navbar } from '@/components/Navbar/Navbar'
import { Footer } from '@/components/Footer/Footer'
import { CartDrawer } from '@/components/CartDrawer/CartDrawer'
import { ScrollToTop } from '@/components/ScrollToTop/ScrollToTop'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute'

import { Home } from '@/pages/Home/Home'
import { Menu } from '@/pages/Menu/Menu'
import { ProductDetails } from '@/pages/ProductDetails/ProductDetails'
import { Offers } from '@/pages/Offers/Offers'
import { Rewards } from '@/pages/Rewards/Rewards'
import { About } from '@/pages/About/About'
import { Branches } from '@/pages/Branches/Branches'
import { Cart } from '@/pages/Cart/Cart'
import { Checkout } from '@/pages/Checkout/Checkout'
import { OrderConfirmation } from '@/pages/OrderConfirmation/OrderConfirmation'
import { Orders } from '@/pages/Orders/Orders'
import { Login } from '@/pages/Login/Login'
import { Signup } from '@/pages/Signup/Signup'
import { Account } from '@/pages/Account/Account'
import { NotFound } from '@/pages/NotFound/NotFound'

/**
 * Every route in the app, plus the chrome that wraps them.
 * Add a page by creating it in src/pages and adding one <Route> below.
 */
export function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <ScrollToTop />
      <Navbar />

      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:itemId" element={<ProductDetails />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/about" element={<About />} />
          <Route path="/branches" element={<Branches />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderNumber" element={<OrderConfirmation />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
    </>
  )
}
