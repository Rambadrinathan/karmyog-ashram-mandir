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
  var current = null;

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

  function showDialog() {
    if (!current) return;
    title.textContent = current.seva;
    detail.textContent = current.detail;
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
      note: btn.getAttribute("data-note")
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
    window.location.href = url;
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
