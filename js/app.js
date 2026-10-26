/**
 * Jolty Web Application — Core Controller & User Flows
 * Matches Stitch Project 9279876243502578812 & design.md
 */

(function () {
  'use strict';

  // Application Global State
  const AppState = {
    currentRoute: 'home',
    previousRoute: 'home',
    selectedService: 'all',
    selectedMechanic: {
      id: 'rajesh',
      name: 'Rajesh Auto Works & 24/7 Rescue',
      shortName: 'Rajesh Kumar',
      eta: '12 mins',
      distance: '1.8 km',
      vehicle: 'White Maruti Eeco (DL 3C AB 9812)',
      rating: '4.9',
      reviews: 184,
      phone: '+91 98765 43210'
    },
    activeOrder: {
      orderId: 'JOLT-84920',
      status: 'en_route',
      stepIndex: 2, // 1: Confirmed, 2: On The Way, 3: Arrived, 4: Service Done
      joltyFee: 149,
      repairPriceEstimate: 'Quoted on inspection',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    user: {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      vehicle: 'DL 01 AB 7890 (Hyundai Creta)',
      isLoggedIn: false
    },
    tempAuthData: null,
    viewMode: 'list' // 'list' | 'map'
  };

  // Demo Session Management (Browser LocalStorage Boundary)
  function loadDemoSession() {
    try {
      const stored = localStorage.getItem('jolty_demo_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.isLoggedIn) {
          AppState.user.isLoggedIn = true;
          AppState.user.phone = parsed.phone || '+91 98765 43210';
          AppState.user.name = parsed.name || 'Aarav Sharma';
          return true;
        }
      }
    } catch (err) {
      console.warn('Could not read demo session from localStorage:', err);
    }
    AppState.user.isLoggedIn = false;
    return false;
  }

  function saveDemoSession(phone, name) {
    const sessionObj = {
      isLoggedIn: true,
      phone: phone || '+91 98765 43210',
      name: name || 'Aarav Sharma',
      timestamp: Date.now()
    };
    try {
      localStorage.setItem('jolty_demo_session', JSON.stringify(sessionObj));
    } catch (err) {
      console.warn('Could not save demo session to localStorage:', err);
    }
    AppState.user.isLoggedIn = true;
    AppState.user.phone = sessionObj.phone;
    AppState.user.name = sessionObj.name;
  }

  function clearDemoSession() {
    try {
      localStorage.removeItem('jolty_demo_session');
    } catch (err) {
      console.warn('Could not remove demo session from localStorage:', err);
    }
    AppState.user.isLoggedIn = false;
    AppState.tempAuthData = null;
  }

  // Toast Notification Controller
  function showToast(message, icon = 'info', duration = 3200) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    if (toastIcon) toastIcon.textContent = icon;

    toast.classList.add('visible');

    if (window._toastTimeout) clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, duration);
  }

  // Synchronize Authentication Gating & UI Consistency
  function syncAuthStateUI() {
    const authGate = document.getElementById('authGateContainer');
    const appContainer = document.getElementById('appContainer');

    const bannerUserName = document.getElementById('bannerUserName');
    const bannerUserPhone = document.getElementById('bannerUserPhone');
    const bannerUserNameMob = document.getElementById('bannerUserNameMob');
    const bannerUserPhoneMob = document.getElementById('bannerUserPhoneMob');
    const profileHeadline = document.getElementById('profileHeadline');
    const profilePhoneDisplay = document.getElementById('profilePhoneDisplay');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserPhone = document.getElementById('dropdownUserPhone');

    if (AppState.user.isLoggedIn) {
      // User is authenticated: Hide login experience, reveal authenticated app
      if (authGate) authGate.classList.add('hidden');
      if (appContainer) appContainer.classList.remove('hidden');

      const name = AppState.user.name || 'Aarav Sharma';
      const phone = AppState.user.phone || '+91 98765 43210';

      if (bannerUserName) bannerUserName.textContent = name;
      if (bannerUserPhone) bannerUserPhone.textContent = phone;
      if (bannerUserNameMob) bannerUserNameMob.textContent = name.split(' ')[0] || name;
      if (bannerUserPhoneMob) bannerUserPhoneMob.textContent = phone;

      if (profileHeadline) profileHeadline.textContent = name;
      if (profilePhoneDisplay) profilePhoneDisplay.textContent = phone;

      if (dropdownUserName) dropdownUserName.textContent = name;
      if (dropdownUserPhone) dropdownUserPhone.textContent = phone;

      updateHeaderUI(AppState.currentRoute);
    } else {
      // User is not authenticated: Show ONLY login experience, hide all app content
      if (authGate) authGate.classList.remove('hidden');
      if (appContainer) appContainer.classList.add('hidden');

      // Reset login form steps
      const stepPhone = document.getElementById('authStepPhone');
      const stepOtp = document.getElementById('authStepOtp');
      if (stepPhone) stepPhone.classList.remove('hidden');
      if (stepOtp) stepOtp.classList.add('hidden');

      const phoneError = document.getElementById('authPhoneError');
      const otpError = document.getElementById('authOtpError');
      if (phoneError) phoneError.classList.add('hidden');
      if (otpError) otpError.classList.add('hidden');

      const otpInput = document.getElementById('authOtpInput');
      if (otpInput) otpInput.value = '';
    }
  }

  // Route Controller
  function navigateTo(route) {
    if (!route) route = 'home';
    route = route.replace('#', '').toLowerCase();

    // Map aliased routes
    if (route === 'services') route = 'mechanics';
    if (route === 'process') route = 'tracking';

    const validRoutes = ['home', 'mechanics', 'tracking', 'about', 'profile'];
    if (!validRoutes.includes(route)) {
      route = 'home';
    }

    // Authentication gating: protect all views before login
    if (!AppState.user.isLoggedIn) {
      syncAuthStateUI();
      return;
    }

    AppState.previousRoute = AppState.currentRoute;
    AppState.currentRoute = route;

    // Update Screen Views
    validRoutes.forEach(r => {
      const screenEl = document.getElementById(`screen-${r}`);
      if (screenEl) {
        if (r === route) {
          screenEl.classList.add('active');
        } else {
          screenEl.classList.remove('active');
        }
      }
    });

    // Update Bottom Navigation Highlights
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      const itemRoute = item.getAttribute('data-route');
      if (itemRoute === route) {
        item.classList.add('text-jolty-ink', 'font-bold');
        item.classList.remove('text-jolty-muted');
      } else {
        item.classList.remove('text-jolty-ink', 'font-bold');
        item.classList.add('text-jolty-muted');
      }
    });

    // Update Desktop Nav Links
    const desktopLinks = document.querySelectorAll('#mainHeader nav a');
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${route}`) {
        link.classList.add('text-jolty-ink', 'font-semibold');
        link.classList.remove('text-jolty-muted', 'font-medium');
      } else {
        link.classList.remove('text-jolty-ink', 'font-semibold');
        link.classList.add('text-jolty-muted', 'font-medium');
      }
    });

    // Update Header Context
    updateHeaderUI(route);

    // If dropdown is open, refresh its dynamic items
    const menu = document.getElementById('userDropdownMenu');
    if (menu && menu.classList.contains('open')) {
      renderUserDropdownItems();
    }

    // Scroll to top cleanly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Ensure URL hash reflects state
    if (window.location.hash !== `#${route}`) {
      window.history.pushState(null, '', `#${route}`);
    }
  }

  function updateHeaderUI(route) {
    const headerHelpBtn = document.getElementById('headerHelpBtn');
    const headerUserIcon = document.getElementById('headerUserIcon');

    if (headerUserIcon) {
      if (AppState.user.isLoggedIn) {
        headerUserIcon.textContent = 'account_circle';
        headerUserIcon.classList.add('text-jolty-green');
      } else {
        headerUserIcon.textContent = 'person';
        headerUserIcon.classList.remove('text-jolty-green');
      }
    }

    if (route === 'tracking') {
      if (headerHelpBtn) {
        headerHelpBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] mr-1">call</span><span>SOS 24/7</span>';
        headerHelpBtn.href = 'tel:18005658924';
      }
    } else {
      if (headerHelpBtn) {
        headerHelpBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] mr-1">emergency</span><span>Get Help</span>';
        headerHelpBtn.href = '#mechanics';
      }
    }
  }

  // Dynamic Header User Dropdown Controller
  function renderUserDropdownItems() {
    const container = document.getElementById('userDropdownItems');
    const summaryCard = document.getElementById('dropdownUserSummary');
    const userName = document.getElementById('dropdownUserName');
    const userPhone = document.getElementById('dropdownUserPhone');

    if (!container) return;

    if (AppState.user.isLoggedIn) {
      if (userName) userName.textContent = AppState.user.name || 'Aarav Sharma';
      if (userPhone) userPhone.textContent = AppState.user.phone || '+91 98765 43210';
      if (summaryCard) summaryCard.style.display = 'flex';
    } else {
      if (userName) userName.textContent = 'Guest Traveler';
      if (userPhone) userPhone.textContent = 'Not signed in';
      if (summaryCard) summaryCard.style.display = 'none';
    }

    const current = AppState.currentRoute;
    let html = '';

    if (AppState.user.isLoggedIn) {
      if (current !== 'home') {
        html += `
          <a href="#home" class="dropdown-nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-jolty-ink hover:bg-jolty-cream font-label-md transition-colors" role="menuitem">
            <span class="material-symbols-outlined text-[20px] text-jolty-amber" style="font-variation-settings: 'FILL' 1;">home</span>
            <span class="font-semibold text-[14px]">Home</span>
          </a>
        `;
      }
      if (current !== 'profile') {
        html += `
          <a href="#profile" class="dropdown-nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-jolty-ink hover:bg-jolty-cream font-label-md transition-colors" role="menuitem">
            <span class="material-symbols-outlined text-[20px] text-jolty-amber" style="font-variation-settings: 'FILL' 1;">person</span>
            <span class="font-semibold text-[14px]">View Profile</span>
          </a>
        `;
      }
      if (current !== 'about') {
        html += `
          <a href="#about" class="dropdown-nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-jolty-ink hover:bg-jolty-cream font-label-md transition-colors" role="menuitem">
            <span class="material-symbols-outlined text-[20px] text-jolty-amber" style="font-variation-settings: 'FILL' 1;">info</span>
            <span class="font-semibold text-[14px]">About Jolty</span>
          </a>
        `;
      }
      html += `
        <div class="h-px bg-jolty-line/70 my-1"></div>
        <button type="button" id="dropdownLogoutBtn" class="dropdown-nav-item flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-error hover:bg-error-container/40 font-label-md transition-colors cursor-pointer" role="menuitem">
          <span class="material-symbols-outlined text-[20px] text-error">logout</span>
          <span class="font-semibold text-[14px]">Sign Out / Reset Demo</span>
        </button>
      `;
    }

    container.innerHTML = html;

    // Attach click listener to logout action in dropdown
    const logoutBtn = document.getElementById('dropdownLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeUserMenu();
        performLogout();
      });
    }

    // Attach click listeners to links to close menu on selection
    const links = container.querySelectorAll('a.dropdown-nav-item');
    links.forEach(link => {
      link.addEventListener('click', () => {
        closeUserMenu();
      });
    });
  }

  function closeUserMenu() {
    const menu = document.getElementById('userDropdownMenu');
    const btn = document.getElementById('headerUserBtn');
    if (menu) menu.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function toggleUserMenu() {
    const menu = document.getElementById('userDropdownMenu');
    const btn = document.getElementById('headerUserBtn');
    if (!menu) return;

    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeUserMenu();
    } else {
      renderUserDropdownItems();
      menu.classList.add('open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  function setupUserMenu() {
    const btn = document.getElementById('headerUserBtn');
    const wrapper = document.getElementById('userMenuWrapper');

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleUserMenu();
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (wrapper && !wrapper.contains(e.target)) {
        closeUserMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeUserMenu();
      }
    });

    // Initialize Profile screen listeners
    setupProfileScreen();
  }

  function performLogout() {
    clearDemoSession();
    syncAuthStateUI();
    showToast('Signed out. Authenticated website content is now hidden.', 'logout', 3500);
  }

  function setupProfileScreen() {
    // In-page Logout button on profile screen
    const profileLogoutBtn = document.getElementById('profileLogoutBtn');
    if (profileLogoutBtn) {
      profileLogoutBtn.addEventListener('click', () => {
        performLogout();
      });
    }

    // Interactive preferences & vehicles
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        showToast('Profile editing enabled for Aarav Sharma', 'edit');
      });
    }

    const addVehicleBtn = document.getElementById('addVehicleBtn');
    if (addVehicleBtn) {
      addVehicleBtn.addEventListener('click', () => {
        showToast('Opening vehicle registration portal...', 'add_circle');
      });
    }

    const manageVehicleBtn = document.getElementById('manageVehicleBtn');
    if (manageVehicleBtn) {
      manageVehicleBtn.addEventListener('click', () => {
        showToast('FASTag & Vehicle settings: Active DL 01 AB 7890', 'tune');
      });
    }

    const fogAlertsToggle = document.getElementById('fogAlertsToggle');
    if (fogAlertsToggle) {
      fogAlertsToggle.addEventListener('change', () => {
        if (fogAlertsToggle.checked) {
          showToast('Highway breakdown & fog alerts turned ON', 'notifications_active');
        } else {
          showToast('Highway breakdown alerts paused', 'notifications_off');
        }
      });
    }

    const prefPayment = document.getElementById('prefPayment');
    if (prefPayment) {
      prefPayment.addEventListener('click', () => {
        showToast('UPI: aarav@okhdfcbank • ₹450 Wallet Credits', 'account_balance_wallet');
      });
    }
  }

  // Address Synchronization
  function setupAddressSynchronization() {
    if (!window.JoltyLocation) return;

    window.JoltyLocation.subscribe(addr => {
      if (!addr) return;

      const fullAddr = addr.formattedAddress || 'NH-48, near Manesar Toll Plaza, Gurugram, Haryana';
      const shortAddr = addr.shortAddress || 'NH 48, near Manesar Toll, Gurgaon';
      const milestone = addr.milestone || 'NH-48 • KM 42';

      // 1. Header Location Chip
      const headerLocText = document.getElementById('headerLocationText');
      if (headerLocText) headerLocText.textContent = shortAddr;

      // 2. Hero Input on Landing
      const heroInput = document.getElementById('hero-location-input');
      if (heroInput && document.activeElement !== heroInput) {
        heroInput.value = shortAddr;
      }

      // 3. Mechanics Breakdown Spot
      const mechSpot = document.getElementById('mechanicsLocationSpot');
      if (mechSpot) mechSpot.textContent = shortAddr;

      // 4. Booking Modal Breakdown Location
      const bookingLocText = document.getElementById('bookingModalLocationText');
      if (bookingLocText) bookingLocText.textContent = fullAddr;

      // 5. Tracking Screen Address and Milestone
      const trackingAddr = document.getElementById('trackingAddressDisplay');
      if (trackingAddr) trackingAddr.textContent = fullAddr;

      const trackingMilestone = document.getElementById('trackingMilestoneDisplay');
      if (trackingMilestone) {
        trackingMilestone.textContent = addr.isEstimate
          ? `Estimated based on device position (${addr.accuracy ? `~${addr.accuracy}m` : 'Corridor'})`
          : 'Verified manual customer breakdown location';
      }

      const trackingMilestoneBadge = document.getElementById('trackingMilestoneBadge');
      if (trackingMilestoneBadge) trackingMilestoneBadge.textContent = milestone;

      // 6. Modal manual input sync
      const modalInput = document.getElementById('modalManualInput');
      if (modalInput && !modalInput.value) {
        modalInput.value = fullAddr;
      }
    });

    // Listen to manual typing changes on Hero input
    const heroInput = document.getElementById('hero-location-input');
    if (heroInput) {
      heroInput.addEventListener('change', () => {
        const val = heroInput.value.trim();
        if (val) {
          window.JoltyLocation.setAddress(val, 'manual_hero');
          showToast(`Location updated: ${val}`, 'check_circle');
        }
      });
    }
  }

  // GPS Trigger Action (Explicit Click Only)
  function setupGpsDetection() {
    const gpsBtn = document.getElementById('detect-gps-btn');
    const gpsIcon = document.getElementById('gps-icon');
    const gpsLabel = document.getElementById('gps-label');
    const modalGpsBtn = document.getElementById('modalGpsDetectBtn');
    const modalGpsIcon = document.getElementById('modalGpsIcon');
    const modalGpsText = document.getElementById('modalGpsText');

    async function handleGpsTrigger() {
      if (gpsBtn) {
        gpsBtn.classList.add('animate-pulse', 'pointer-events-none');
        if (gpsLabel) gpsLabel.textContent = 'Locating...';
      }
      if (modalGpsBtn) {
        modalGpsBtn.classList.add('animate-pulse', 'pointer-events-none');
        if (modalGpsText) modalGpsText.textContent = 'Detecting current GPS...';
      }

      try {
        const result = await window.JoltyLocation.detectCurrentPosition();
        showToast(`GPS Location Locked: ${result.shortAddress}`, 'verified');

        // Close address modal if open
        closeAddressModal();
      } catch (err) {
        console.warn('[GPS Detection] Error encountered:', err);
        showToast(err.message || 'Location access unavailable. Please enter manually.', 'warning', 4500);
      } finally {
        if (gpsBtn) {
          gpsBtn.classList.remove('animate-pulse', 'pointer-events-none');
          if (gpsLabel) gpsLabel.textContent = 'GPS';
        }
        if (modalGpsBtn) {
          modalGpsBtn.classList.remove('animate-pulse', 'pointer-events-none');
          if (modalGpsText) modalGpsText.textContent = 'Detect Location via Device GPS';
        }
      }
    }

    if (gpsBtn) gpsBtn.addEventListener('click', handleGpsTrigger);
    if (modalGpsBtn) modalGpsBtn.addEventListener('click', handleGpsTrigger);
  }

  // Address Modal Dialog Controller
  function openAddressModal() {
    const modal = document.getElementById('addressModalBackdrop');
    const input = document.getElementById('modalManualInput');
    const current = window.JoltyLocation ? window.JoltyLocation.getAddress() : null;

    if (input && current) {
      input.value = current.formattedAddress || current.shortAddress || '';
    }

    if (modal) {
      modal.classList.add('active');
      setTimeout(() => { if (input) input.focus(); }, 100);
    }
  }

  function closeAddressModal() {
    const modal = document.getElementById('addressModalBackdrop');
    if (modal) modal.classList.remove('active');
  }

  function setupAddressModal() {
    const openTriggers = [
      document.getElementById('headerLocationChip'),
      document.getElementById('changeLocationBtn'),
      document.getElementById('bookingChangeLocBtn')
    ];

    openTriggers.forEach(btn => {
      if (btn) btn.addEventListener('click', openAddressModal);
    });

    const closeBtn = document.getElementById('closeAddressModalBtn');
    const cancelBtn = document.getElementById('cancelAddressModalBtn');
    const saveBtn = document.getElementById('saveAddressModalBtn');
    const modal = document.getElementById('addressModalBackdrop');
    const input = document.getElementById('modalManualInput');

    if (closeBtn) closeBtn.addEventListener('click', closeAddressModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeAddressModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAddressModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAddressModal();
        closeBookingModal();
      }
    });

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const val = input ? input.value.trim() : '';
        if (val) {
          window.JoltyLocation.setAddress(val, 'manual_modal');
          showToast('Breakdown location confirmed', 'check_circle');
          closeAddressModal();
        } else {
          showToast('Please type your milestone or location', 'error');
        }
      });
    }

    // Quick preset landmark chips
    const presetChips = document.querySelectorAll('.preset-loc-chip');
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim();
        if (input) input.value = text;
      });
    });
  }

  // Booking / Checkout Modal Controller
  function openBookingModal(mechanic) {
    if (mechanic) {
      AppState.selectedMechanic = mechanic;
    }

    const modal = document.getElementById('bookingModalBackdrop');
    const mechName = document.getElementById('bookingModalMechName');
    const mechEta = document.getElementById('bookingModalMechEta');

    if (mechName && AppState.selectedMechanic) {
      mechName.textContent = AppState.selectedMechanic.name;
    }
    if (mechEta && AppState.selectedMechanic) {
      mechEta.textContent = `ETA ~${AppState.selectedMechanic.eta} • Verified Pro`;
    }

    // Update current location in booking modal
    const current = window.JoltyLocation ? window.JoltyLocation.getAddress() : null;
    const locText = document.getElementById('bookingModalLocationText');
    if (locText && current) {
      locText.textContent = current.formattedAddress || current.shortAddress;
    }

    if (modal) modal.classList.add('active');
  }

  function closeBookingModal() {
    const modal = document.getElementById('bookingModalBackdrop');
    if (modal) modal.classList.remove('active');
  }

  function setupBookingModal() {
    const closeBtn = document.getElementById('closeBookingModalBtn');
    const modal = document.getElementById('bookingModalBackdrop');
    const confirmBtn = document.getElementById('confirmDispatchBtn');

    if (closeBtn) closeBtn.addEventListener('click', closeBookingModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeBookingModal();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        confirmBtn.disabled = true;
        confirmBtn.classList.add('opacity-80', 'animate-pulse');
        confirmBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">sync</span><span>Dispatching Partner...</span>';

        setTimeout(() => {
          confirmBtn.disabled = false;
          confirmBtn.classList.remove('opacity-80', 'animate-pulse');
          confirmBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">bolt</span><span>Confirm & Dispatch Mechanic (₹149)</span>';

          closeBookingModal();

          // Sync tracker display with chosen mechanic
          syncTrackerWithSelectedMechanic();

          // Transition to Tracking View
          navigateTo('tracking');
          showToast(`Assistance Dispatched! ${AppState.selectedMechanic.name} is on the way.`, 'verified_user', 4000);
        }, 800);
      });
    }

    // Bind "Choose Mechanic" buttons
    const chooseBtns = document.querySelectorAll('.choose-mechanic-btn');
    chooseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mech = {
          id: btn.getAttribute('data-mechanic-id'),
          name: btn.getAttribute('data-mechanic-name'),
          shortName: btn.getAttribute('data-mechanic-name').split(' ')[0],
          eta: btn.getAttribute('data-eta'),
          vehicle: btn.getAttribute('data-vehicle') || 'Maruti Eeco Service Van',
          distance: '1.8 km',
          phone: '+91 98765 43210'
        };
        openBookingModal(mech);
      });
    });
  }

  function syncTrackerWithSelectedMechanic() {
    const mech = AppState.selectedMechanic;
    if (!mech) return;

    const mechTitle = document.getElementById('assignedMechanicTitle');
    const markerName = document.getElementById('markerMechanicName');
    const vehicleModel = document.getElementById('trackingVehicleModel');
    const etaTitle = document.getElementById('trackingEtaTitle');
    const clockEta = document.getElementById('trackingClockEta');

    if (mechTitle) mechTitle.textContent = mech.name;
    if (markerName) markerName.textContent = mech.shortName || 'Mechanic';
    if (vehicleModel) vehicleModel.textContent = mech.vehicle;
    if (etaTitle) etaTitle.textContent = `Arriving in ${mech.eta}`;
    if (clockEta) clockEta.textContent = `ETA ~${mech.eta}`;
  }

  // Mechanics View List / Map Tab Toggle & Filtering
  function setupMechanicsView() {
    const btnList = document.getElementById('btnListView');
    const btnMap = document.getElementById('btnMapView');
    const listContainer = document.getElementById('listViewContainer');
    const mapContainer = document.getElementById('mapViewContainer');

    if (btnList && btnMap) {
      btnList.addEventListener('click', () => {
        btnList.classList.add('bg-jolty-paper', 'text-jolty-ink', 'font-semibold', 'shadow-sm');
        btnList.classList.remove('text-jolty-muted');
        btnList.setAttribute('aria-selected', 'true');

        btnMap.classList.remove('bg-jolty-paper', 'text-jolty-ink', 'font-semibold', 'shadow-sm');
        btnMap.classList.add('text-jolty-muted');
        btnMap.setAttribute('aria-selected', 'false');

        if (listContainer) listContainer.classList.remove('hidden');
        if (mapContainer) mapContainer.classList.add('hidden');
      });

      btnMap.addEventListener('click', () => {
        btnMap.classList.add('bg-jolty-paper', 'text-jolty-ink', 'font-semibold', 'shadow-sm');
        btnMap.classList.remove('text-jolty-muted');
        btnMap.setAttribute('aria-selected', 'true');

        btnList.classList.remove('bg-jolty-paper', 'text-jolty-ink', 'font-semibold', 'shadow-sm');
        btnList.classList.add('text-jolty-muted');
        btnList.setAttribute('aria-selected', 'false');

        if (mapContainer) mapContainer.classList.remove('hidden');
        if (listContainer) listContainer.classList.add('hidden');
      });
    }

    // Filter Pills
    const filterPills = document.querySelectorAll('.service-pill');
    const mechanicCards = document.querySelectorAll('.mechanic-card');

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-filter');

        filterPills.forEach(p => {
          p.classList.remove('bg-jolty-ink', 'text-jolty-paper', 'font-semibold');
          p.classList.add('bg-jolty-paper', 'text-jolty-muted');
        });
        pill.classList.remove('bg-jolty-paper', 'text-jolty-muted');
        pill.classList.add('bg-jolty-ink', 'text-jolty-paper', 'font-semibold');

        mechanicCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Landing service card click triggers
    const serviceLinks = document.querySelectorAll('[data-service-filter]');
    serviceLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = link.getAttribute('data-service-filter');
        navigateTo('mechanics');

        // Trigger corresponding pill
        const targetPill = document.querySelector(`.service-pill[data-filter="${filter}"]`);
        if (targetPill) targetPill.click();
      });
    });
  }

  // Live Tracking Simulator Animation & Highway Route
  function setupLiveTracking() {
    const marker = document.getElementById('mechanic-marker');
    const recenterBtn = document.getElementById('recenter-btn');
    const trafficBtn = document.getElementById('traffic-toggle-btn');
    const shareBtn = document.getElementById('share-trip-btn');
    const cancelBtn = document.getElementById('cancel-request-btn');
    const distText = document.getElementById('trackingDistanceText');

    if (!marker) return;

    // Simulated Highway Waypoints on NH-48
    const waypoints = [
      { left: '28%', top: '68%', dist: '2.1 km away', eta: '12 mins' },
      { left: '42%', top: '58%', dist: '1.7 km away', eta: '9 mins' },
      { left: '56%', top: '48%', dist: '1.2 km away', eta: '6 mins' },
      { left: '68%', top: '38%', dist: '0.6 km away', eta: '3 mins' },
      { left: '76%', top: '30%', dist: 'Arriving at vehicle!', eta: '1 min' }
    ];
    let stepIndex = 0;

    setInterval(() => {
      stepIndex = (stepIndex + 1) % waypoints.length;
      const wp = waypoints[stepIndex];
      marker.style.left = wp.left;
      marker.style.top = wp.top;
      if (distText) distText.textContent = wp.dist;
    }, 4200);

    if (recenterBtn) {
      recenterBtn.addEventListener('click', () => {
        marker.classList.add('scale-125');
        setTimeout(() => marker.classList.remove('scale-125'), 350);
        showToast('Map centered on active dispatch unit', 'my_location');
      });
    }

    if (trafficBtn) {
      trafficBtn.addEventListener('click', () => {
        showToast('NH-48 Expressway Traffic: Smooth transit conditions', 'traffic');
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const shareData = {
          title: 'My Jolty Live Rescue Status',
          text: `Tracking ${AppState.selectedMechanic.name} (${AppState.selectedMechanic.vehicle}) on NH-48.`,
          url: window.location.href
        };

        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (err) {}
        } else {
          try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Live tracking link copied to clipboard!', 'content_copy');
          } catch (e) {
            showToast('Tracking URL: ' + window.location.href, 'link');
          }
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        const confirmed = confirm(
          `Are you sure you want to cancel? ${AppState.selectedMechanic.name} is already en route to your spot on NH-48.`
        );
        if (confirmed) {
          showToast('Request cancelled. Connecting to dispatch dispatcher...', 'info', 4000);
          setTimeout(() => navigateTo('home'), 1200);
        }
      });
    }
  }

  // ==========================================================================
  // DEMO PHONE OTP AUTHENTICATION & SUPABASE BOUNDARY
  // ==========================================================================
  /**
   * SUPABASE ARCHITECTURAL BOUNDARY:
   * 
   * CURRENT STATUS: Explicit Demo-Only Flow
   * - Used for friends & evaluators to preview and test the complete application.
   * - Accepts any 10-digit mobile number; validates with fixed demo OTP '123456'.
   * - Explicitly states to the user that no SMS is sent.
   * - Stores session in browser localStorage under 'jolty_demo_session'.
   * - No fabricated Supabase URLs, keys, or fake client tokens are exposed.
   * 
   * PRODUCTION SUPABASE PHONE OTP INTEGRATION BLUEPRINT:
   * When deploying to production with live SMS gateways:
   * 1. Initialize Supabase Auth client with valid environment variables:
   *    import { createClient } from '@supabase/supabase-js';
   *    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
   * 
   * 2. Replace handleSendOtp():
   *    const { data, error } = await supabase.auth.signInWithOtp({
   *      phone: '+91' + phoneNumber,
   *      options: { channel: 'sms' }
   *    });
   * 
   * 3. Replace handleVerifyOtp():
   *    const { data: { session }, error } = await supabase.auth.verifyOtp({
   *      phone: '+91' + phoneNumber,
   *      token: enteredOtp,
   *      type: 'sms'
   *    });
   * 
   * 4. Session Persistence & Listener:
   *    supabase.auth.onAuthStateChange((event, session) => {
   *      AppState.user.isLoggedIn = !!session;
   *      if (session) {
   *        AppState.user.phone = session.user.phone;
   *      }
   *      syncAuthStateUI();
   *    });
   */

  function setupDemoAuth() {
    const mobileInput = document.getElementById('authMobileInput');
    const nameInput = document.getElementById('authUserNameInput');
    const phoneValidIcon = document.getElementById('authPhoneValidIcon');
    const sendOtpBtn = document.getElementById('authSendOtpBtn');
    const sendOtpBtnText = document.getElementById('authSendOtpBtnText');
    const phoneError = document.getElementById('authPhoneError');
    const phoneErrorText = document.getElementById('authPhoneErrorText');

    const stepPhone = document.getElementById('authStepPhone');
    const stepOtp = document.getElementById('authStepOtp');
    const targetPhoneText = document.getElementById('authTargetPhoneText');

    const otpInput = document.getElementById('authOtpInput');
    const otpError = document.getElementById('authOtpError');
    const otpErrorText = document.getElementById('authOtpErrorText');
    const verifyOtpBtn = document.getElementById('authVerifyOtpBtn');
    const verifyOtpBtnText = document.getElementById('authVerifyOtpBtnText');
    const autoFillBtn = document.getElementById('authAutoFillOtpBtn');
    const backToPhoneBtn = document.getElementById('authBackToPhoneBtn');
    const quickDemoBtn = document.getElementById('authQuickDemoBtn');
    const bannerSignOutBtn = document.getElementById('bannerSignOutBtn');

    // Phone input typing & formatting
    if (mobileInput) {
      mobileInput.addEventListener('input', () => {
        mobileInput.value = mobileInput.value.replace(/[^0-9]/g, '');
        if (phoneError) phoneError.classList.add('hidden');
        if (mobileInput.value.length === 10) {
          if (phoneValidIcon) phoneValidIcon.classList.remove('hidden');
        } else {
          if (phoneValidIcon) phoneValidIcon.classList.add('hidden');
        }
      });

      mobileInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (sendOtpBtn) sendOtpBtn.click();
        }
      });
    }

    // Step 1: Send OTP Action
    if (sendOtpBtn) {
      sendOtpBtn.addEventListener('click', () => {
        const phone = mobileInput ? mobileInput.value.trim() : '';
        if (phone.length < 10) {
          if (phoneError && phoneErrorText) {
            phoneErrorText.textContent = 'Please enter a valid 10-digit Indian mobile number.';
            phoneError.classList.remove('hidden');
          }
          if (mobileInput) mobileInput.focus();
          return;
        }

        const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Aarav Sharma';
        AppState.tempAuthData = { phone: `+91 ${phone}`, name: name };

        // Button feedback
        sendOtpBtn.disabled = true;
        if (sendOtpBtnText) sendOtpBtnText.textContent = 'Generating test code...';
        sendOtpBtn.classList.add('opacity-80');

        setTimeout(() => {
          sendOtpBtn.disabled = false;
          sendOtpBtn.classList.remove('opacity-80');
          if (sendOtpBtnText) sendOtpBtnText.textContent = 'Continue with Phone';

          if (stepPhone) stepPhone.classList.add('hidden');
          if (stepOtp) stepOtp.classList.remove('hidden');
          if (targetPhoneText) targetPhoneText.textContent = AppState.tempAuthData.phone;
          if (otpInput) {
            otpInput.value = '';
            otpInput.focus();
          }
          if (otpError) otpError.classList.add('hidden');

          showToast('Demo OTP is 123456 (No SMS sent)', 'key', 4000);
        }, 350);
      });
    }

    // Auto-fill OTP button
    if (autoFillBtn && otpInput) {
      autoFillBtn.addEventListener('click', () => {
        otpInput.value = '123456';
        if (otpError) otpError.classList.add('hidden');
        otpInput.focus();
        showToast('Demo code 123456 filled', 'magic_button', 2000);
      });
    }

    // Step 2: Verify OTP Action
    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener('click', () => {
        const code = otpInput ? otpInput.value.trim() : '';
        if (code !== '123456') {
          if (otpError && otpErrorText) {
            otpErrorText.textContent = 'Incorrect test OTP. Enter fixed demo code 123456.';
            otpError.classList.remove('hidden');
          }
          if (otpInput) {
            otpInput.focus();
            otpInput.select();
          }
          return;
        }

        // Correct fixed OTP (123456)
        verifyOtpBtn.disabled = true;
        if (verifyOtpBtnText) verifyOtpBtnText.textContent = 'Verifying...';

        setTimeout(() => {
          verifyOtpBtn.disabled = false;
          if (verifyOtpBtnText) verifyOtpBtnText.textContent = 'Verify & Enter Jolty';

          const authData = AppState.tempAuthData || {
            phone: mobileInput && mobileInput.value.length === 10 ? `+91 ${mobileInput.value}` : '+91 98765 43210',
            name: nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Aarav Sharma'
          };

          saveDemoSession(authData.phone, authData.name);
          syncAuthStateUI();
          showToast(`Welcome to Jolty, ${authData.name}!`, 'check_circle', 3500);
          navigateTo('home');
        }, 350);
      });
    }

    // Enter key in OTP input
    if (otpInput) {
      otpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (verifyOtpBtn) verifyOtpBtn.click();
        }
      });
    }

    // Back to phone button
    if (backToPhoneBtn) {
      backToPhoneBtn.addEventListener('click', () => {
        if (stepOtp) stepOtp.classList.add('hidden');
        if (stepPhone) stepPhone.classList.remove('hidden');
        if (mobileInput) mobileInput.focus();
      });
    }

    // Quick 1-Click Test Login
    if (quickDemoBtn) {
      quickDemoBtn.addEventListener('click', () => {
        const testName = 'Aarav Sharma';
        const testPhone = '+91 98765 43210';
        saveDemoSession(testPhone, testName);
        syncAuthStateUI();
        showToast('Signed in as Aarav Sharma (Demo Session)', 'bolt', 3000);
        navigateTo('home');
      });
    }

    // Banner Sign Out Button
    if (bannerSignOutBtn) {
      bannerSignOutBtn.addEventListener('click', () => {
        performLogout();
      });
    }

    // Social login simulation in auth card
    const googleBtn = document.getElementById('authSocialGoogle');
    const appleBtn = document.getElementById('authSocialApple');

    function simulateSocial(provider) {
      showToast(`Connecting test account via ${provider}...`, 'sync', 2000);
      setTimeout(() => {
        saveDemoSession('+91 98765 43210', `Aarav Sharma (${provider})`);
        syncAuthStateUI();
        showToast(`Signed in with ${provider} (Demo)`, 'check_circle', 3000);
        navigateTo('home');
      }, 500);
    }

    if (googleBtn) googleBtn.addEventListener('click', () => simulateSocial('Google'));
    if (appleBtn) appleBtn.addEventListener('click', () => simulateSocial('Apple'));
  }

  // App Initialization
  function init() {
    // 1. Check existing demo session from localStorage
    loadDemoSession();

    // 2. Setup all UI controllers
    setupDemoAuth();
    setupAddressSynchronization();
    setupGpsDetection();
    setupAddressModal();
    setupBookingModal();
    setupMechanicsView();
    setupLiveTracking();
    setupUserMenu();

    // 3. Sync initial visual state (auth gate vs app)
    syncAuthStateUI();

    // 4. Listen to hash change for back/forward navigation
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      navigateTo(hash);
    });

    // 5. Initial Route Check if logged in
    if (AppState.user.isLoggedIn) {
      const initialHash = window.location.hash.replace('#', '') || 'home';
      navigateTo(initialHash);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
