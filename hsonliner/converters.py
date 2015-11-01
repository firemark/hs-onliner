from werkzeug.routing import BaseConverter, ValidationError
from datetime import datetime


class DateConverter(BaseConverter):
    date_format = "%d-%m-%Y"

    @classmethod
    def to_python(cls, value):
        try:
            return datetime.strptime(value, cls.date_format).date()
        except (ValueError, TypeError) as e:
            raise ValidationError(e.message)

    @classmethod
    def get(cls, value, default_value=None):
        try:
            return cls.to_python(value)
        except ValidationError:
            return default_value

    @classmethod
    def to_url(cls, value):
        return value.strftime(cls.date_format)


class TimeConverter(BaseConverter):
    time_format = "%H:%M"

    @classmethod
    def to_python(cls, value):
        try:
            return datetime.strptime(value, cls.time_format).time()
        except ValueError as e:
            raise ValidationError(e.message)

    @classmethod
    def to_url(cls, value):
        return value.strftime(cls.time_format)