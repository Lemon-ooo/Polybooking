<?php
namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;

class AssignRoomRequest extends FormRequest {
  public function authorize(): bool { return $this->user()?->can('manage-bookings') ?? false; }
  public function rules(): array {
    return ['room_id'=>['required','integer','exists:rooms,room_id']];
  }
}