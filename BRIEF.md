# Brief for Aryan — a better Kali Puja site

Make a better website for Kali Puja 2026 at KarmYog Ashram and Mandir, Kolkata. The live page works. It still feels too much like a payment page. The next version should feel like walking into the mandir on puja night.

Live page, leave it up: https://karmyog-ashram-mandir.vercel.app

Build the new site in your own repository, or on a branch here. Send Ram a preview link. Do not replace the live address until he says so.

## What it has to feel like

A mandir and a puja in Kolkata. Devotion first. The offering comes after the person has seen Maa, the pratima, and the grounds.

The Canara QR stays at the bottom, after the closing lines. It is not the hero, and it is not a checkout.

Phone first. A person should reach a seva, choose it, and land in their UPI app without hunting.

## Keep these exactly

Do not invent a street address, a muhurat, a new amount, or another payee. No address was supplied for this page. Do not copy an address from another KarmYog project.

Date on the page: Sunday, 8 November 2026.

Payee, from the QR itself: **KarmYog for 21st Century Foundation**, Canara Bank, UPI ID `230608554002875@cnrb`. The QR image is `assets/canara-upi.png`. Do not redraw it. A scan has no amount filled in, so the UPI app asks the person to type the rupees. The Pay button prefills the chosen amount. That behaviour is in `app.js`. Keep it.

The page never asks for a card, an OTP, a PIN, or the devotee’s name.

Closing lines, keep the words:

> Every offering is an expression of devotion. Every contribution helps create a celebration filled with faith, light and togetherness.

> Let us come together to make Kali Puja 2026 divine and memorable.

### Catalogue

Bhog and Prasadam, ₹100 a person:

| Persons | Amount |
| --- | --- |
| 20 | ₹2,000 |
| 50 | ₹5,000 |
| 100 | ₹10,000 |
| 200 | ₹20,000 |

Maa Kali Pratima: ₹2,000, ₹5,000, ₹10,000, ₹15,000, ₹20,000.

Pandal and illumination: ₹10,000, ₹20,000, ₹30,000, ₹40,000.

Divine plants, monthly: ₹500, ₹1,000, ₹1,500, ₹2,000.

Purohit seva: ₹1,000, ₹2,000, ₹3,000, ₹4,000.

Pushpanjali and floral seva, no fixed amount. The devotee types the rupees. The three names are Individual Pushpanjali Seva, Floral Offering, and Special Pushparghya Seva. Keep the spelling Pushparghya.

Deepdaan: ₹500, ₹1,000, ₹1,500, ₹2,000.

Decoration and seva support: ₹500, ₹1,000, ₹2,000, ₹5,000.

## Photographs

These three are the ashram’s own. Use them.

| File | Use |
| --- | --- |
| `assets/temple-maa.jpg` | Maa’s face. This opens the page now. |
| `assets/temple-pratima.jpg` | The full pratima. It belongs with the pratima seva. |
| `assets/temple-night.jpg` | The grounds at night. It belongs with the pandal seva. |

`temple-maa.jpg` and `temple-pratima.jpg` still have a “Sumit” mark. Leave the mark until a clean file is given.

The `scene-*.jpg` files are stand-in pictures for bhog, plants, the purohit, flowers, diyas, and decoration. They are not photographs of this mandir. Replace a stand-in only when a real photograph of that seva arrives. Do not invent another face of Maa.

## What you can change

The look, the type, the motion, the way a seva is chosen, and how Kolkata puja night is felt on the page. Bengali lines are welcome beside the English. The current Bengali labels are ভোগ ও প্রসাদ, মা কালী প্রতিমা, মণ্ডপ ও আলো, মাসিক উদ্ভিদ সেবা, পুরোহিত সেবা, পুষ্পাঞ্জলি, দীপদান, সাজসজ্জা.

Make it richer than this first page. Keep one job obvious: choose a seva, then offer it.
