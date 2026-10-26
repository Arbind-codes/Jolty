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
      phone: '',
      isLoggedIn: false
    },
    viewMode: 'list' // 'list' | 'map'
  };

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

  // Route Controller
  function navigateTo(route) {
    if (!route) route = 'home';
    route = route.replace('#', '').toLowerCase();

    // Map aliased routes
    if (route === 'services') route = 'mechanics';
    if (route === 'about' || route === 'process') route = 'home';

    const validRoutes = ['home', 'mechanics', 'tracking', 'login'];
    if (!validRoutes.includes(route)) {
      route = 'home';
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

    // Update Header Context
    updateHeaderUI(route);

    // Scroll to top cleanly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Ensure URL hash reflects state
    if (window.location.hash !== `#${route}`) {
      window.history.pushState(null, '', `#${route}`);
    }
  }

  function updateHeaderUI(route) {
    const locationChip = document.getElementById('headerLocationChip');
    const headerHelpBtn = document.getElementById('headerHelpBtn');
    const headerUserIcon = document.getElementById('headerUserIcon');

    if (AppState.user.isLoggedIn && headerUserIcon) {
      headerUserIcon.textContent = 'account_circle';
      headerUserIcon.classList.add('text-jolty-green');
    }

    if (route === 'tracking') {
      if (headerHelpBtn) {
        headerHelpBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] mr-1">call</span><span>SOS 24/7</span>';
        headerHelpBtn.href = 'tel:18001088899';
      }
    } else {
      if (headerHelpBtn) {
        headerHelpBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] mr-1">emergency</span><span>Get Help</span>';
        headerHelpBtn.href = '#mechanics';
      }
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

  // Login Form Interactions
  function setupLogin() {
    const form = document.getElementById('loginForm');
    const mobileInput = document.getElementById('mobile-number');
    const validIcon = document.getElementById('phone-valid-icon');
    const otpBtn = document.getElementById('otp-btn');
    const otpBtnText = document.getElementById('otp-btn-text');
    const googleBtn = document.getElementById('googleLoginBtn');
    const appleBtn = document.getElementById('appleLoginBtn');

    if (mobileInput && validIcon) {
      mobileInput.addEventListener('input', () => {
        mobileInput.value = mobileInput.value.replace(/[^0-9]/g, '');
        if (mobileInput.value.length === 10) {
          validIcon.classList.remove('hidden');
        } else {
          validIcon.classList.add('hidden');
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!mobileInput || mobileInput.value.length < 10) {
          showToast('Please enter a valid 10-digit mobile number', 'error');
          if (mobileInput) mobileInput.focus();
          return;
        }

        otpBtn.disabled = true;
        otpBtnText.textContent = 'Sending OTP...';
        otpBtn.classList.add('opacity-80');

        setTimeout(() => {
          otpBtnText.textContent = 'OTP Sent!';
          otpBtn.classList.remove('bg-jolty-amber');
          otpBtn.classList.add('bg-jolty-green', 'text-white');

          setTimeout(() => {
            AppState.user.isLoggedIn = true;
            AppState.user.phone = mobileInput.value;
            showToast('Phone verified! Signed in successfully.', 'check_circle');

            // Return to previous screen or home
            const dest = AppState.previousRoute === 'login' ? 'home' : AppState.previousRoute;
            navigateTo(dest);

            otpBtn.disabled = false;
            otpBtn.classList.remove('opacity-80', 'bg-jolty-green', 'text-white');
            otpBtn.classList.add('bg-jolty-amber', 'text-jolty-ink');
            otpBtnText.textContent = 'Send OTP';
          }, 900);
        }, 700);
      });
    }

    function handleSocial(provider) {
      showToast(`Connecting with ${provider}...`, 'sync');
      setTimeout(() => {
        AppState.user.isLoggedIn = true;
        showToast(`Connected with ${provider}. Welcome back!`, 'check_circle');
        const dest = AppState.previousRoute === 'login' ? 'home' : AppState.previousRoute;
        navigateTo(dest);
      }, 800);
    }

    if (googleBtn) googleBtn.addEventListener('click', () => handleSocial('Google'));
    if (appleBtn) appleBtn.addEventListener('click', () => handleSocial('Apple'));
  }

  // App Initialization
  function init() {
    setupAddressSynchronization();
    setupGpsDetection();
    setupAddressModal();
    setupBookingModal();
    setupMechanicsView();
    setupLiveTracking();
    setupLogin();

    // Listen to hash change for back/forward navigation
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      navigateTo(hash);
    });

    // Initial Route Check
    const initialHash = window.location.hash.replace('#', '') || 'home';
    navigateTo(initialHash);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
