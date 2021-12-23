from main import app, time, datetime


@app.template_filter("formatdatetime")
def format_datetime(value):
    if value is None:
        return ""

    now_timestamp = time.time()
    offset = datetime.fromtimestamp(now_timestamp) - datetime.utcfromtimestamp(
        now_timestamp
    )
    result = datetime.fromtimestamp(int(value / 1000)) + offset
    return result.strftime("%Y-%m-%d %H:%M")
