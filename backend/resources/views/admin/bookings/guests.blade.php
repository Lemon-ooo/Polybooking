<div class="card mb-3">
    <div class="card-header">Xác nhận khách</div>
    <div class="card-body">

        @foreach ($booking->guests as $guest)
            <form method="POST"
                  action="{{ route('admin.guests.verify',
                    [$booking->id, $guest->id]) }}"
                  class="mb-2">
                @csrf

                <label>
                    <input type="checkbox"
                        onchange="this.form.submit()"
                        {{ $guest->verified ? 'checked disabled' : '' }}>
                    {{ $guest->name }} ({{ $guest->age }} tuổi)
                </label>
            </form>
        @endforeach

        @php
            $verified = $booking->guests->where('verified', true)->count();
            $total = $booking->adults + $booking->children;
        @endphp

        <p><b>Đã xác nhận:</b> {{ $verified }}/{{ $total }}</p>

        @if ($booking->status === 'paid' && $verified === $total)
            <form method="POST"
                  action="{{ route('admin.bookings.checkin.final', $booking->id) }}">
                @csrf
                <button class="btn btn-success">
                    CHECK-IN
                </button>
            </form>
        @endif

    </div>
</div>
