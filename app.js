(function () {
  var PA = "230608554002875@cnrb";
  var PN = "KARMYOG FOR 21ST CENTURY FOUNDATION";
  var tiers = Array.prototype.slice.call(document.querySelectorAll(".tier"));
  var dock = document.getElementById("dock");
  var dockLabel = document.getElementById("dock-label");
  var dockAmount = document.getElementById("dock-amount");
  var dockPay = document.getElementById("dock-pay");
  var dialog = document.getElementById("pay-dialog");
  var form = document.getElementById("pay-form");
  var title = document.getElementById("dialog-title");
  var detail = document.getElementById("dialog-detail");
  var amountField = document.getElementById("amount-field");
  var amountInput = document.getElementById("amount-input");
  var amountError = document.getElementById("amount-error");
  var payGo = document.getElementById("pay-go");
  var copyBtn = document.getElementById("copy-upi");
  var closeBtn = document.getElementById("dialog-close");
  var dialogQr = document.getElementById("dialog-qr");
  var amountQr = document.getElementById("amount-qr");
  var amountQrSum = document.getElementById("amount-qr-sum");
  var amountQrCode = document.getElementById("amount-qr-code");
  var amountQrBack = document.getElementById("amount-qr-back");
  var offerAmount = document.getElementById("offer-amount");
  var offerCovers = document.getElementById("offer-covers");
  var offerIncludes = document.getElementById("offer-includes");
  var current = null;
  var qrShown = false;
  // A phone can hand the upi:// link to GPay, PhonePe or Paytm. A computer cannot,
  // so there the amount QR is the way to pay.
  var isPhone = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    || (navigator.userAgentData && navigator.userAgentData.mobile)
    || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

  function rupees(n) {
    return "\u20B9" + Number(n).toLocaleString("en-IN");
  }

  function parseAmount(raw) {
    var cleaned = String(raw || "").replace(/[\u20B9,\s]/g, "");
    if (!/^\d+$/.test(cleaned)) return null;
    var n = Number(cleaned);
    if (n < 1 || n > 1000000) return null;
    return n;
  }

  function upiUrl(amount, note) {
    return "upi://pay?pa=" + PA
      + "&pn=" + encodeURIComponent(PN)
      + "&mc=0825&cu=INR&am=" + amount.toFixed(2)
      + "&tn=" + encodeURIComponent(note + " Rs " + amount);
  }

  function chosenAmount() {
    if (!current) return null;
    if (current.amount) return current.amount;
    return parseAmount(amountInput.value);
  }

  function paintPayButton() {
    var amount = chosenAmount();
    if (!current) return;
    var raw = String(amountInput.value || "").replace(/[\u20B9,\s]/g, "");
    if (!current.amount && raw && !/^\d+$/.test(raw)) {
      amountError.textContent = "Enter a whole amount in rupees.";
    } else if (!current.amount && /^\d+$/.test(raw) && Number(raw) > 1000000) {
      amountError.textContent = "Enter an amount up to \u20B910,00,000.";
    } else {
      amountError.textContent = "";
    }
    if (amount) payGo.setAttribute("data-upi", upiUrl(amount, current.note));
    else payGo.removeAttribute("data-upi");
    payGo.textContent = amount ? "Pay " + rupees(amount) : "Pay in UPI app";
  }

  // Same upi:// link as the Pay button, drawn as a QR, so a scan fills in the amount.
  function showAmountQR(amount, url) {
    if (typeof window.qrcode !== "function") return false;
    var qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();
    amountQrCode.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
    amountQrCode.setAttribute("aria-label", "UPI QR for " + rupees(amount) + " to KarmYog for 21st Century Foundation");
    amountQrSum.textContent = rupees(amount);
    dialogQr.hidden = true;
    amountField.hidden = true;
    amountQr.hidden = false;
    offerAmount.hidden = true;
    qrShown = true;
    payGo.textContent = isPhone ? "Open UPI app · " + rupees(amount) : "Done";
    amountQr.scrollIntoView({ block: "start" });
    return true;
  }

  function hideAmountQR() {
    qrShown = false;
    amountQr.hidden = true;
    dialogQr.hidden = false;
    offerAmount.hidden = false;
  }

  function showDialog() {
    if (!current) return;
    title.textContent = current.seva;
    detail.textContent = current.detail;
    hideAmountQR();
    offerAmount.textContent = current.amount ? rupees(current.amount) : "Any amount";
    offerIncludes.textContent = "";
    (current.includes || []).forEach(function (line) {
      var li = document.createElement("li");
      li.textContent = line;
      offerIncludes.appendChild(li);
    });
    offerCovers.hidden = !(current.includes && current.includes.length);
    var open = !current.amount;
    amountField.hidden = !open;
    amountError.textContent = "";
    if (open) {
      amountInput.value = "";
    }
    paintPayButton();
    if (!dialog.open) dialog.showModal();
    if (open) amountInput.focus();
  }

  function selectTier(btn) {
    tiers.forEach(function (tier) {
      tier.setAttribute("aria-pressed", tier === btn ? "true" : "false");
    });
    current = {
      seva: btn.getAttribute("data-seva"),
      detail: btn.getAttribute("data-detail"),
      amount: btn.getAttribute("data-amount") ? Number(btn.getAttribute("data-amount")) : null,
      note: btn.getAttribute("data-note"),
      includes: (btn.getAttribute("data-includes") || "").split("|").filter(Boolean)
    };
    dock.hidden = false;
    document.body.classList.add("has-dock");
    dockLabel.textContent = current.seva;
    dockAmount.textContent = current.amount ? rupees(current.amount) : "Any amount";
    showDialog();
  }

  tiers.forEach(function (btn) {
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", function () {
      selectTier(btn);
    });
  });

  dockPay.addEventListener("click", showDialog);
  amountQrBack.addEventListener("click", function () {
    var keep = amountInput.value;
    showDialog();
    if (!current.amount) { amountInput.value = keep; paintPayButton(); }
  });
  closeBtn.addEventListener("click", function () { dialog.close(); });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  amountInput.addEventListener("input", paintPayButton);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var amount = chosenAmount();
    if (!amount) {
      amountError.textContent = current && current.amount ? "" : "Enter the amount in rupees.";
      if (!current || !current.amount) amountInput.focus();
      return;
    }
    var url = upiUrl(amount, current.note);
    payGo.setAttribute("data-upi", url);
    if (qrShown && !isPhone) {
      dialog.close();
      return;
    }
    var drawn = showAmountQR(amount, url);
    if (isPhone || !drawn) window.location.href = url;
  });

  copyBtn.addEventListener("click", function () {
    var done = function () {
      copyBtn.textContent = "Copied";
      window.setTimeout(function () { copyBtn.textContent = "Copy"; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(PA).then(done).catch(function () {
        fallbackCopy();
        done();
      });
      return;
    }
    fallbackCopy();
    done();
  });

  function fallbackCopy() {
    var area = document.createElement("textarea");
    area.value = PA;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
})();
