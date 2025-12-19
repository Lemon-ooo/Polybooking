<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sự kiện mới</title>
</head>
<body style="font-family: Arial, sans-serif">
    <h2>🎉 {{ $event->title }}</h2>

    @if($event->banner)
        <img src="{{ $event->banner }}" alt="Event Banner" style="max-width:100%;margin-bottom:15px">
    @endif

    <p><strong>Thời gian diễn ra:</strong></p>
    <p>
        {{ \Carbon\Carbon::parse($event->start_date)->format('d/m/Y') }}
        →
        {{ \Carbon\Carbon::parse($event->end_date)->format('d/m/Y') }}
    </p>

    <p>{{ $event->description }}</p>

    <hr>
    <p>
        📍 Poly Homestay <br>
        Hẹn gặp bạn trong sự kiện!
    </p>
</body>
</html>
