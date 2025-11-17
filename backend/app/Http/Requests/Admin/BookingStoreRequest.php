<?php
// app/Http/Requests/Admin/BookingStoreRequest.php
namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;

class BookingStoreRequest extends FormRequest {
 public function authorize(): bool
{
    return true; // để khỏi 403
}

public function rules(): array
{
    return [
        'user_id' => ['required', 'integer', 'exists:users,id'],

        'special_request' => ['nullable', 'string'],

        // ITEMS (phòng) – BẮT BUỘC
        'items' => ['required', 'array', 'min:1'],
        'items.*.room_type_id'   => ['required', 'integer', 'exists:room_types,id'],
        'items.*.check_in_date'  => ['required', 'date', 'after_or_equal:today'],
        'items.*.check_out_date' => ['required', 'date', 'after:items.*.check_in_date'],
        'items.*.num_guests'     => ['required', 'integer', 'min:1'],

        // SERVICES – TÙY CHỌN
        'services' => ['nullable', 'array'],

        // Chỉ validate khi thực sự có service_id (nullable)
        'services.*.service_id' => ['nullable', 'integer', 'exists:services,id'],
        'services.*.quantity'   => ['nullable', 'integer', 'min:1'],
        'services.*.price'      => ['nullable', 'numeric', 'min:0'],
    ];
}



}
