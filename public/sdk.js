/**
 * EvocCheckout SDK — PayU + COD checkout modal
 *
 * Usage:
 *   <script src="sdk.js"></script>
 *   <div id="evoc-checkout-root"></div>
 *   <script>
 *     const checkout = new EvocCheckout({
 *       storeId: '...',
 *       apiBase: 'http://localhost:5002/api',
 *       container: '#evoc-checkout-root',
 *       product: { id, name, price, quantity },
 *       onOrderCreated(orderId, paymentMethod) {},
 *       onError(err) {},
 *     });
 *     checkout.init();    // opens the modal
 *     checkout.close();    // closes it
 *   </script>
 *
 * Alternatively import as ES module:
 *   import EvocCheckout from './sdk.js';
 */
class EvocCheckout {
  constructor({
    storeId,
    apiBase,
    container,
    product, // { id, name, price, quantity }
    onOrderCreated,
    onError,
  }) {
    if (!storeId || !container || !product) {
      throw new Error('storeId, container, and product are required');
    }
    this.storeId = storeId;
    this.apiBase = apiBase.replace(/\/$/, '');
    this.container =
      typeof container === 'string' ? document.querySelector(container) : container;
    this.product = product;
    this.onOrderCreated = onOrderCreated || (() => {});
    this.onError = onError || ((e) => console.error('[EvocCheckout]', e));
    this._state = {
      screen: 1,
      phone: null,
      customer: null,
      address: null,
      paymentSettings: null,
      orderResult: null,
      loading: false,
    };
    this._payuLoaded = false;
    this._root = null;
    this._destroy = null;
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  init() {
    this._render();
    this._initCheckout();
  }

  close() {
    if (this._destroy) this._destroy();
    this.container.innerHTML = '';
  }

  // ─── Screen Router ──────────────────────────────────────────────────────────

  _navigate(screen) {
    this._state.screen = screen;
    this._render();
  }

  // ─── API Helpers ────────────────────────────────────────────────────────────

  async _post(endpoint, body) {
    const res = await fetch(`${this.apiBase}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API error');
    return data;
  }

  async _initCheckout() {
    try {
      const data = await this._post('/checkout/init', {
        storeId: this.storeId,
        productId: this.product.id,
        productName: this.product.name,
        amount: this.product.price * (this.product.quantity || 1),
      });
      this._state.paymentSettings = data.paymentSettings;
      this._render();
    } catch (e) {
      this.onError(e);
    }
  }

  // ─── Render Engine ────────────────────────────────────────────────────────────

  _render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'evoc-checkout';
    wrapper.innerHTML = this._styles();
    wrapper.appendChild(this._modal());
    this.container.appendChild(wrapper);
    this._root = wrapper;
    this._attachEvents();
    // Expose destroy fn
    this._destroy = () => {
      if (this._root && this._root.parentNode) {
        this._root.parentNode.removeChild(this._root);
      }
    };
  }

  _modal() {
    const overlay = document.createElement('div');
    overlay.className = 'evoc-overlay';
    overlay.innerHTML = `
      <div class="evoc-modal">
        <div class="evoc-modal__header">
          <span class="evoc-modal__logo">🛒</span>
          <span class="evoc-modal__title">Checkout</span>
          <button class="evoc-modal__close" data-action="close">&times;</button>
        </div>
        <div class="evoc-modal__body" id="evoc-body">
          ${this._screenHtml()}
        </div>
        <div class="evoc-modal__footer" id="evoc-footer"></div>
      </div>`;
    return overlay;
  }

  _screenHtml() {
    switch (this._state.screen) {
      case 1: return this._screen1();
      case 2: return this._screen2();
      case 3: return this._screen3();
      case 4: return this._screen4();
      case 5: return this._screen5();
      case 'success': return this._screenSuccess();
      default: return '<p>Unknown screen</p>';
    }
  }

  _attachEvents() {
    const root = this._root;
    if (!root) return;
    // Close button
    root.querySelector('[data-action="close"]')?.addEventListener('click', () => this.close());
    root.querySelector('.evoc-overlay')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('evoc-overlay')) this.close();
    });
    // Delegated actions
    root.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const screen = e.target.closest('[data-screen]')?.dataset.screen;
      if (action) this._handleAction(action, e.target);
      if (screen) this._navigate(Number(screen));
    });
    root.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = e.currentTarget.id;
      if (id) this._handleSubmit(id);
    });
    // Loading state toggles
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-loading]');
      if (btn && btn.disabled) e.preventDefault();
    });
  }

  _handleAction(action, el) {
    switch (action) {
      case 'close': this.close(); break;
      case 'verify-otp': this._verifyOtp(); break;
      case 'save-address': this._saveAddress(); break;
      case 'pay-online': this._payOnline(); break;
      case 'pay-cod': this._payCod(); break;
      case 'back': this._navigate(Math.max(1, this._state.screen - 1)); break;
    }
  }

  _handleSubmit(id) {
    switch (id) {
      case 'form-phone': this._submitPhone(); break;
      case 'form-otp': this._submitOtp(); break;
      case 'form-address': this._submitAddress(); break;
    }
  }

  _submitPhone() {
    const input = this._root?.querySelector('#evoc-phone');
    const phone = input?.value.replace(/\D/g, '');
    if (!phone || phone.length !== 10) {
      input?.classList.add('evoc-input--error');
      return;
    }
    this._state.phone = phone;
    this._navigate(3);
    this._sendOtp();
  }

  _setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Loading...' : btn.dataset.label || btn.textContent;
  }

  // ─── Screens ────────────────────────────────────────────────────────────────

  // Screen 1: Order Summary
  _screen1() {
    const { product } = this;
    const qty = product.quantity || 1;
    const total = product.price * qty;
    return `
      <div class="evoc-screen">
        <h2 class="evoc-screen__title">Order Summary</h2>
        <div class="evoc-card">
          <div class="evoc-card__row">
            <span>${product.name}</span>
            <span>₹${product.price.toLocaleString()}</span>
          </div>
          <div class="evoc-card__row">
            <span>Quantity</span>
            <span>×${qty}</span>
          </div>
          <div class="evoc-card__divider"></div>
          <div class="evoc-card__row evoc-card__row--bold">
            <span>Total</span>
            <span>₹${total.toLocaleString()}</span>
          </div>
        </div>
        <button class="evoc-btn evoc-btn--primary" data-screen="2" style="width:100%;margin-top:16px">
          Proceed to Checkout →
        </button>
      </div>`;
  }

  // Screen 2: Phone Number
  _screen2() {
    return `
      <div class="evoc-screen">
        <h2 class="evoc-screen__title">Verify your number</h2>
        <p class="evoc-screen__sub">We'll send you an OTP to continue</p>
        <form id="form-phone">
          <div class="evoc-field">
            <label>Phone Number</label>
            <div class="evoc-input-group">
              <span class="evoc-input-group__prefix">+91</span>
              <input
                type="tel"
                id="evoc-phone"
                class="evoc-input"
                placeholder="Enter 10-digit number"
                maxlength="10"
                pattern="[0-9]{10}"
                required
                inputmode="numeric"
              />
            </div>
          </div>
          <button
            type="submit"
            class="evoc-btn evoc-btn--primary"
            data-action="send-otp"
            data-label="Send OTP"
            style="width:100%;margin-top:16px"
          >Send OTP</button>
        </form>
      </div>`;
  }

  // Screen 3: OTP Verification
  _screen3() {
    return `
      <div class="evoc-screen">
        <h2 class="evoc-screen__title">Enter OTP</h2>
        <p class="evoc-screen__sub">Code sent to +91 ${this._state.phone}</p>
        <form id="form-otp">
          <div class="evoc-field">
            <label>6-digit code</label>
            <input
              type="text"
              id="evoc-otp"
              class="evoc-input evoc-input--center"
              placeholder="• • • • • •"
              maxlength="6"
              pattern="[0-9]{6}"
              inputmode="numeric"
              required
              autocomplete="one-time-code"
            />
          </div>
          <button
            type="submit"
            class="evoc-btn evoc-btn--primary"
            data-action="verify-otp"
            data-label="Verify & Continue"
            style="width:100%;margin-top:16px"
          >Verify & Continue</button>
          <button
            type="button"
            class="evoc-btn evoc-btn--ghost"
            data-action="back"
            style="width:100%;margin-top:8px"
          >← Back</button>
        </form>
      </div>`;
  }

  // Screen 4: Address Form
  _screen4() {
    const c = this._state.customer || {};
    return `
      <div class="evoc-screen">
        <h2 class="evoc-screen__title">${c.isNew ? 'Enter your address' : 'Confirm address'}</h2>
        <form id="form-address">
          <div class="evoc-field">
            <label>Full Name</label>
            <input type="text" id="evoc-name" class="evoc-input" placeholder="Rahul Sharma" value="${c.name || ''}" required />
          </div>
          <div class="evoc-field">
            <label>Email</label>
            <input type="email" id="evoc-email" class="evoc-input" placeholder="rahul@example.com" value="${c.email || ''}" />
          </div>
          <div class="evoc-field">
            <label>Address</label>
            <input type="text" id="evoc-addr" class="evoc-input" placeholder="House No. 123, Street Name" value="${c.addressLine || ''}" required />
          </div>
          <div class="evoc-grid-2">
            <div class="evoc-field">
              <label>City</label>
              <input type="text" id="evoc-city" class="evoc-input" placeholder="Mumbai" value="${c.city || ''}" required />
            </div>
            <div class="evoc-field">
              <label>State</label>
              <input type="text" id="evoc-state" class="evoc-input" placeholder="Maharashtra" value="${c.state || ''}" required />
            </div>
          </div>
          <div class="evoc-grid-2">
            <div class="evoc-field">
              <label>Pincode</label>
              <input type="text" id="evoc-pin" class="evoc-input" placeholder="400001" maxlength="6" inputmode="numeric" value="${c.pincode || ''}" required />
            </div>
            <div class="evoc-field">
              <label>Landmark <span style="font-weight:400">(optional)</span></label>
              <input type="text" id="evoc-landmark" class="evoc-input" placeholder="Near metro station" value="${c.landmark || ''}" />
            </div>
          </div>
          <button
            type="submit"
            class="evoc-btn evoc-btn--primary"
            data-action="save-address"
            data-label="Continue to Payment"
            style="width:100%;margin-top:16px"
          >Continue to Payment →</button>
          <button type="button" class="evoc-btn evoc-btn--ghost" data-action="back" style="width:100%;margin-top:8px">← Back</button>
        </form>
      </div>`;
  }

  // Screen 5: Payment Selection
  _screen5() {
    const ps = this._state.paymentSettings || {};
    return `
      <div class="evoc-screen">
        <h2 class="evoc-screen__title">Choose payment method</h2>
        <div class="evoc-payment-list">
          ${ps.payNowEnabled ? `
            <button class="evoc-payment-card" data-action="pay-online">
              <div class="evoc-payment-card__icon">💳</div>
              <div class="evoc-payment-card__info">
                <div class="evoc-payment-card__name">Pay Online (PayU)</div>
                <div class="evoc-payment-card__desc">Credit/Debit/UPI/Net Banking</div>
              </div>
              <div class="evoc-payment-card__arrow">→</div>
            </button>` : ''}
          ${ps.raisePayEnabled ? `
            <button class="evoc-payment-card" data-action="pay-cod">
              <div class="evoc-payment-card__icon">📦</div>
              <div class="evoc-payment-card__info">
                <div class="evoc-payment-card__name">Cash on Delivery</div>
                <div class="evoc-payment-card__desc">Pay when you receive your order</div>
              </div>
              <div class="evoc-payment-card__arrow">→</div>
            </button>` : ''}
        </div>
        <button type="button" class="evoc-btn evoc-btn--ghost" data-action="back" style="width:100%;margin-top:8px">← Back</button>
      </div>`;
  }

  // Success screen
  _screenSuccess() {
    const r = this._state.orderResult || {};
    return `
      <div class="evoc-screen evoc-screen--center">
        <div class="evoc-success__icon">✅</div>
        <h2>Order Placed!</h2>
        <p>Order <strong>${r.orderNumber || ''}</strong> has been placed.</p>
        ${r.paymentMethod === 'COD' ? `<p>Pay <strong>₹${r.total?.toLocaleString()}</strong> on delivery.</p>` : ''}
        ${r.paymentMethod === 'PAYU' ? `<p>Complete your payment to confirm.</p>` : ''}
        <button class="evoc-btn evoc-btn--primary" data-action="close" style="width:100%;margin-top:16px">Done</button>
      </div>`;
  }

  // ─── Action Handlers ─────────────────────────────────────────────────────────

  _submitPhone() {
    const input = this._root?.querySelector('#evoc-phone');
    const phone = input?.value.replace(/\D/g, '');
    if (!phone || phone.length !== 10) {
      input?.classList.add('evoc-input--error');
      return;
    }
    this._state.phone = phone;
    this._navigate(3);
    this._sendOtp();
  }

  async _sendOtp() {
    const btn = this._root?.querySelector('[data-action="send-otp"]');
    this._setLoading(btn, true);
    try {
      await this._post('/checkout/send-otp', { phone: this._state.phone });
    } catch (e) {
      this.onError(e);
    } finally {
      this._setLoading(btn, false);
    }
  }

  _submitOtp() {
    const input = this._root?.querySelector('#evoc-otp');
    const code = input?.value.replace(/\D/g, '');
    if (!code || code.length !== 6) return;
    this._state.otpCode = code;
    this._verifyOtp();
  }

  async _verifyOtp() {
    const btn = this._root?.querySelector('[data-action="verify-otp"]');
    this._setLoading(btn, true);
    try {
      const result = await this._post('/checkout/verify-otp', {
        phone: this._state.phone,
        code: this._state.otpCode,
      });
      this._state.customer = result.customer;
      this._navigate(4);
    } catch (e) {
      this.onError(e);
      const input = this._root?.querySelector('#evoc-otp');
      input?.classList.add('evoc-input--error');
    } finally {
      this._setLoading(btn, false);
    }
  }

  _submitAddress() {
    const get = (id) => this._root?.querySelector(`#${id}`)?.value?.trim();
    this._state.address = {
      name: get('evoc-name'),
      email: get('evoc-email'),
      addressLine: get('evoc-addr'),
      city: get('evoc-city'),
      state: get('evoc-state'),
      pincode: get('evoc-pin'),
      landmark: get('evoc-landmark'),
    };
    this._saveAddress();
  }

  async _saveAddress() {
    const btn = this._root?.querySelector('[data-action="save-address"]');
    this._setLoading(btn, true);
    try {
      await this._post('/checkout/save-address', {
        phone: this._state.phone,
        ...this._state.address,
      });
      this._navigate(5);
    } catch (e) {
      this.onError(e);
    } finally {
      this._setLoading(btn, false);
    }
  }

  async _createOrder(paymentMethod) {
    const ps = this._state.paymentSettings;
    const addr = this._state.address;
    const shippingAddress = {
      line1: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark,
    };
    const total = this.product.price * (this.product.quantity || 1);

    const result = await this._post('/checkout/create-order', {
      storeId: this.storeId,
      paymentMethod,
      items: [
        {
          productId: this.product.id,
          name: this.product.name,
          price: this.product.price,
          quantity: this.product.quantity || 1,
        },
      ],
      customerPhone: this._state.phone,
      customerEmail: addr.email,
      customerName: addr.name,
      shippingAddress,
      billingAddress: shippingAddress,
      subtotal: total,
      tax: 0,
      shipping: 0,
      total,
    });

    this._state.orderResult = result;
    this.onOrderCreated(result.orderId, paymentMethod);
    return result;
  }

  async _payCod() {
    try {
      const result = await this._createOrder('COD');
      this._navigate('success');
    } catch (e) {
      this.onError(e);
    }
  }

  async _payOnline() {
    try {
      const result = await this._createOrder('PAYU');
      await this._launchPayU(result);
    } catch (e) {
      this.onError(e);
    }
  }

  async _launchPayU(orderResult) {
    // Load PayU Checkout Plus SDK if not already loaded
    if (!window.bolt) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://jssdk.payu.in/bolt/bolt.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load PayU SDK'));
        document.head.appendChild(script);
      });
    }

    const data = {
      key: orderResult.providerData.key,
      txnid: orderResult.txnid,
      amount: String(orderResult.total),
      productinfo: orderResult.orderNumber,
      firstname: (this._state.address.name || 'Customer').split(' ')[0],
      email: this._state.address.email || '',
      phone: this._state.phone,
      surl: `${window.location.origin}/checkout/success`,
      furl: `${window.location.origin}/checkout/failed`,
    };

    window.bolt.launch(data, {
      responseHandler: async (boltResponse) => {
        // Handle SUCCESS / FAILED / CANCEL
        const status = boltResponse.status === 'SUCCESS' ? 'success' : 'failed';
        await this._post('/checkout/verify-payment', {
          orderId: orderResult.orderId,
          paymentMethod: 'PAYU',
          status,
          txnid: orderResult.txnid,
        });
        if (status === 'success') {
          this._navigate('success');
        } else {
          this.onError(new Error('Payment ' + status));
        }
      },
      catchException: (boltResponse) => {
        this.onError(new Error(boltResponse.exceptionMessage || 'PayU error'));
      },
    });
  }

  // ─── Styles ─────────────────────────────────────────────────────────────────

  _styles() {
    return `<style>
    .evoc-checkout * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
    .evoc-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999;
    }
    .evoc-modal {
      background: #111827; border-radius: 16px; width: 100%; max-width: 480px;
      margin: 16px; max-height: 90vh; display: flex; flex-direction: column;
      overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    .evoc-modal__header {
      display: flex; align-items: center; gap: 10px; padding: 16px 20px;
      border-bottom: 1px solid #1f2937; color: #fff;
    }
    .evoc-modal__logo { font-size: 20px; }
    .evoc-modal__title { flex: 1; font-weight: 600; font-size: 16px; }
    .evoc-modal__close {
      background: none; border: none; color: #9ca3af; font-size: 24px; cursor: pointer;
      line-height: 1; padding: 0 4px;
    }
    .evoc-modal__close:hover { color: #fff; }
    .evoc-modal__body { padding: 20px; overflow-y: auto; flex: 1; }
    .evoc-screen__title {
      color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 8px;
    }
    .evoc-screen__sub { color: #9ca3af; font-size: 13px; margin-bottom: 20px; }
    .evoc-screen--center { text-align: center; color: #fff; padding: 32px 0; }
    .evoc-success__icon { font-size: 48px; margin-bottom: 16px; }
    .evoc-card {
      background: #1f2937; border-radius: 12px; padding: 16px;
    }
    .evoc-card__row {
      display: flex; justify-content: space-between; color: #d1d5db; font-size: 14px;
      padding: 4px 0;
    }
    .evoc-card__row--bold { color: #fff; font-weight: 700; font-size: 16px; }
    .evoc-card__divider { height: 1px; background: #374151; margin: 8px 0; }
    .evoc-field { margin-bottom: 14px; }
    .evoc-field label { display: block; color: #9ca3af; font-size: 12px; margin-bottom: 6px; font-weight: 500; }
    .evoc-input {
      width: 100%; background: #1f2937; border: 1px solid #374151; border-radius: 8px;
      color: #fff; padding: 10px 14px; font-size: 14px; outline: none;
      transition: border-color 0.2s;
    }
    .evoc-input:focus { border-color: #3b82f6; }
    .evoc-input--error { border-color: #ef4444 !important; }
    .evoc-input--center { text-align: center; font-size: 20px; letter-spacing: 8px; }
    .evoc-input-group { display: flex; }
    .evoc-input-group__prefix {
      background: #1f2937; border: 1px solid #374151; border-right: none;
      border-radius: 8px 0 0 8px; color: #9ca3af; padding: 10px 12px;
      font-size: 14px; line-height: 1.4;
    }
    .evoc-input-group .evoc-input {
      border-radius: 0 8px 8px 0; flex: 1;
    }
    .evoc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .evoc-btn {
      display: block; width: 100%; padding: 12px 16px; border-radius: 8px;
      font-size: 14px; font-weight: 600; border: none; cursor: pointer;
      transition: opacity 0.2s, background 0.2s;
    }
    .evoc-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .evoc-btn--primary { background: #3b82f6; color: #fff; }
    .evoc-btn--primary:hover:not(:disabled) { background: #2563eb; }
    .evoc-btn--ghost { background: transparent; color: #9ca3af; border: 1px solid #374151; }
    .evoc-btn--ghost:hover:not(:disabled) { background: #1f2937; }
    .evoc-payment-list { display: flex; flex-direction: column; gap: 10px; }
    .evoc-payment-card {
      display: flex; align-items: center; gap: 14px; padding: 16px;
      background: #1f2937; border: 1px solid #374151; border-radius: 12px;
      cursor: pointer; text-align: left; color: #fff; transition: border-color 0.2s;
    }
    .evoc-payment-card:hover { border-color: #3b82f6; }
    .evoc-payment-card__icon { font-size: 28px; }
    .evoc-payment-card__info { flex: 1; }
    .evoc-payment-card__name { font-weight: 600; font-size: 15px; }
    .evoc-payment-card__desc { color: #9ca3af; font-size: 12px; margin-top: 2px; }
    .evoc-payment-card__arrow { color: #3b82f6; font-size: 18px; }
    </style>`;
  }
}

window.EvocCheckout = EvocCheckout;