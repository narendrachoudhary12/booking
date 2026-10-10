# Dashboard backend (Laravel)

API code behind the host, admin and user dashboards. Copy these files into
the Laravel project on the server, keeping the same paths.

| File | What it is |
| --- | --- |
| `database/migrations/2026_10_10_000001_add_dashboard_tables.php` | New tables and booking columns |
| `app/Http/Middleware/RequireUserType.php` | Admin-only / partner-only route guard |
| `app/Support/Platform.php` | Platform settings (commission, cancellation window, support contacts) |
| `app/Services/RoomInventory.php` | Price and availability of a room per day |
| `app/Services/PayoutLedger.php` | What the platform owes each hotel |
| `app/Http/Controllers/Api/HostManageController.php` | Partner: rooms, listing, calendar, rates, analytics, reviews, payouts, channel manager |
| `app/Http/Controllers/Api/AdminDashboardController.php` | Admin: overview, bookings, payments, refunds, payouts, analytics, settings |
| `app/Http/Controllers/Api/UserBookingActionController.php` | Guest: cancel a booking; public availability and platform info |
| `database/migrations/2026_10_10_000003_widen_bookings_pay_method.php` | Lets `bookings.pay_method` hold any payment method |
| `database/migrations/2026_10_10_000002_create_newsletter_subscribers_table.php` | Emails from the "unlock hotel deals" form |
| `app/Http/Controllers/Api/NewsletterController.php` | Saves those emails; admin list of subscribers |
| `routes/dashboard_api.php` | All the new routes |

## Install

1. Copy the files.
2. Add one line at the bottom of `routes/api.php`:

   ```php
   require __DIR__ . '/dashboard_api.php';
   ```

3. Run the migration and clear the route cache:

   ```bash
   php artisan migrate
   php artisan route:clear
   ```

The routes use the `auth:api` guard (Passport). If the existing logged-in
routes use another guard, change it at the top of `routes/dashboard_api.php`.

## How the three dashboards connect

- **Guest books** (existing flow) → the booking shows in the partner's
  Bookings and in the admin's bookings and activity.
- **Guest pays outside the website** → admin: Awaiting Payment → Confirm
  (amount, method, reference) → the booking becomes paid and confirmed.
- **Guest cancels** (`POST /my/bookings/{ref}/cancel`) → allowed for unpaid
  bookings, and for confirmed ones until the free-cancellation window set in
  admin Settings closes. A paid booking gets a refund request.
- **Refund** → admin: Refunds → send the money, then "Mark as refunded".
  The guest sees the refund state in their dashboard.
- **Payout** → after check-out a paid booking is owed to the hotel, minus
  the commission from admin Settings. Admin: Hotel Payouts → Record payout.
  The partner sees it under Earnings & Payouts.
- **Room types and prices** set by the partner are the same `hotel_rooms`
  rows guests book, and keep `hotels.price_start_from` up to date.
- **Reviews** written by guests show in the partner's Guest Reviews; the
  partner's reply is saved on the review (`owner_reply`).
- **Channel manager** details saved by the partner wait for an admin to
  switch them on (admin: Channel Manager).

## Still to connect in the existing booking code

Closed dates, special prices and minimum stays are saved in `room_inventory`,
but the existing controller that creates a booking does not read them yet.
Where it works out the price and checks that a room is free, use:

```php
use App\Services\RoomInventory;

$quote = RoomInventory::quote($room, $checkIn, $checkOut);
// ['nights', 'total' (one room), 'available', 'min_stay', 'bookable']

if (!$quote['bookable'] || $quote['available'] < $quantity) {
    // not available for these dates
}

$lineTotal = $quote['total'] * $quantity;
```

`GET /api/hotels/{hotelId}/availability?check_in=&check_out=` returns the
same quote for every room type, for the hotel page.
