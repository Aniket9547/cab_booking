// Mobile Menu Toggle
    
    // ================== Mobile Menu ==================
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navMobile = document.getElementById("navMobile");

    mobileMenuBtn.addEventListener("click", () => {
        navMobile.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navMobile.contains(e.target)) {
            navMobile.classList.remove("active");
        }
    });

    // ================== Car type rates ==================
    const carRates = {
        economy: 40,
        comfort: 50,
        luxury: 100,
        suv: 150,
        minivan: 200
    };

    // DOM Elements
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');
    const carTypeSelect = document.getElementById('carType');
    const fareEstimate = document.getElementById('fareEstimate');
    const distanceValue = document.getElementById('distanceValue');
    const rateValue = document.getElementById('rateValue');
    const totalFare = document.getElementById('totalFare');

    // ================== Distance Function (dummy) ==================
    function calculateDistance(pickup, destination) {
        return Math.floor(Math.random() * 45) + 5; // Random 5-50 km
    }

    // ================== Fare Estimate ==================
    function updateFareEstimate() {
        const pickup = pickupInput.value.trim();
        const destination = destinationInput.value.trim();
        const carType = carTypeSelect.value;

        if (pickup && destination && carType) {
            const distance = calculateDistance(pickup, destination);
            const rate = carRates[carType];
            const fare = (distance * rate).toFixed(2);

            distanceValue.textContent = `${distance} km`;
            rateValue.textContent = `₹${rate.toFixed(2)}/km`;
            totalFare.textContent = `₹${fare}`;

            fareEstimate.classList.add('active');
        } else {
            fareEstimate.classList.remove('active');
        }
    }

    pickupInput.addEventListener('input', updateFareEstimate);
    destinationInput.addEventListener('input', updateFareEstimate);
    carTypeSelect.addEventListener('change', updateFareEstimate);

    // ================== Cab Tracking Modal ==================

const cabModal = document.getElementById('cabTrackingModal');
const closeBtn = document.getElementById('closeTracking');
const cancelBtn = document.getElementById('cancelRideBtn');
const callBtn = document.querySelector('.call-btn');

// ================== Show Modal Function ==================
function showCabTracking() {
    cabModal.style.display = 'flex';

    const etaTime = document.getElementById('etaTime');
    const progressFill = document.getElementById('progressFill');
    const cabMarker = document.getElementById('cabMarker');

    let timeLeft = 15;
    let progress = 0;

    const timer = setInterval(() => {
        timeLeft--;
        etaTime.textContent = timeLeft;

        progress = ((8 - timeLeft) / 10) * 80;
        progressFill.style.width = `${progress}%`;

        const cabPosition = 30 + (progress / 80 * 40);
        cabMarker.style.left = `${cabPosition}%`;

        const progressPoints = document.querySelectorAll('.progress-point');
        if (progress >= 40) progressPoints[1].classList.add('active');
        if (progress >= 80) {
            progressPoints[2].classList.add('active');
            clearInterval(timer);
            document.querySelector('.tracking-status p').textContent = 'Your driver has arrived!';
            etaTime.textContent = '0';
        }

        if (timeLeft <= 0) clearInterval(timer);
    }, 6000);

    // Store timer in modal dataset so we can clear later
    cabModal.dataset.timerId = timer;
}

// ================== Global Listeners ==================
// Close Modal
closeBtn.onclick = function () {
    cabModal.style.display = 'none';
    clearInterval(cabModal.dataset.timerId);
};

// Cancel Ride
cancelBtn.onclick = function () {
    if (confirm('Are you sure you want to cancel your ride?')) {
        alert('Your ride has been cancelled.');
        cabModal.style.display = 'none';
        clearInterval(cabModal.dataset.timerId);
    }
};

// Call Driver
callBtn.onclick = function () {
    alert('Calling Rajesh Kumar...');
};

// Optional: Click outside modal to close
window.onclick = function (event) {
    if (event.target === cabModal) {
        cabModal.style.display = "none";
        clearInterval(cabModal.dataset.timerId);
    }
};



    // ================== Booking Form ==================
    const bookingForm = document.getElementById("bookingForm");

    bookingForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = {
            pickup: document.getElementById("pickup").value,
            destination: document.getElementById("destination").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            payment: document.getElementById("payment").value,
            passengerCount: document.getElementById("passengerCount").value,
            carType: document.getElementById("carType").value,
            distance: document.getElementById("distanceValue").textContent,
            fare: document.getElementById("totalFare").textContent
        };

        try {
            const response = await fetch("/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                bookingForm.reset();
                fareEstimate.classList.remove('active');

                // ✅ Show tracking only after save success
                showCabTracking();
            } else {
                alert(result.error || "❌ Booking failed");
            }
        } catch (error) {
            alert("❌ Error submitting booking");
            console.error(error);
        }
    });

