@extends('client.layout')

@section('content')
  <h1>Phòng hiện có</h1>

  @if ($rooms->count() === 0)
    <p>Chưa có phòng.</p>
  @else
    <ul>
      @foreach ($rooms as $room)
        <li>
          <strong>{{ $room->name ?? ('Phòng #' . $room->id) }}</strong>
          @if(optional($room->roomType)->name)
            – {{ $room->roomType->name }}
          @endif
          @if(!is_null($room->price))
            – {{ number_format($room->price, 0, ',', '.') }} đ/đêm
          @endif
        </li>
      @endforeach
    </ul>

    {{ $rooms->links() }}
  @endif
@endsection
