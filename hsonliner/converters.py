from werkzeug.routing import BaseConverter, ValidationError
from datetime import date

class DateConverter(BaseConverter):
    date_format = "%d-%M-%Y"

    @classmethod
    def to_python(cls, value):
        try:
            return date.strptime(value, cls.date_format)
        except ValueError:
            raise ValidationError()

    @classmethod
    def to_url(cls, value):
        return value.strftime(cls.date_format)
