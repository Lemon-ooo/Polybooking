<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Booking;
use App\Models\BookingGuest;
use Illuminate\Http\Request;

// Get booking 3
$booking = Booking::find(3);
echo "Booking 3: ID={$booking->id}, Status={$booking->status}\n";
echo "Guests count: " . $booking->guests()->count() . "\n";

// List guests
$guests = BookingGuest::where('booking_id', 3)->get();
echo "BookingGuest records:\n";
foreach ($guests as $g) {
    echo "  - ID: {$g->id}, Name: '{$g->name}', Age: {$g->age}, Verified: " . ($g->verified ? 'yes' : 'no') . "\n";
}

// Check assigned room
$assigned = \App\Models\AssignedRoom::where('booking_id', 3)->where('status', 'assigned')->first();
echo "\nAssignedRoom: " . ($assigned ? "Found (ID={$assigned->assigned_room_id})" : "NOT FOUND") . "\n";

// Simulate POST request with form data (verified=1 for all guests)
$request = new Request([
    'guests' => [
        14 => ['name' => 'Guest 1', 'age' => 30, 'verified' => 1],
        15 => ['name' => 'Guest 2', 'age' => 5, 'verified' => 1],
        16 => ['name' => 'Guest 3', 'age' => 3, 'verified' => 1],
    ]
]);

// Test the checkin
echo "\n=== Testing Checkin ===\n";
$controller = new \App\Http\Controllers\Web\AdminCheckinController();
$response = $controller->checkin($request, $booking);

echo "Response status: " . $response->getStatusCode() . "\n";
echo "Response type: " . get_class($response) . "\n";

if (method_exists($response, 'getTargetUrl')) {
    echo "Redirect to: " . $response->getTargetUrl() . "\n";
}

// Check final state
$booking->refresh();
echo "\nFinal booking status: {$booking->status}\n";

$assigned->refresh();
echo "Final assigned room status: {$assigned->status}\n";
