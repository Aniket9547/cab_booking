const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Disable button + show loading
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch("/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Message sent successfully!");
      form.reset();
      sendBtn.textContent = "Sent ✅";
    } else {
      alert("❌ Failed to send message. Try again.");
      sendBtn.disabled = false;
      sendBtn.textContent = "Send Message";
    }
  } catch (err) {
    alert("⚠️ Server error, please try later.");
    console.error(err);
    sendBtn.disabled = false;
    sendBtn.textContent = "Send Message";
  }
});