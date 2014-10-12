from flask import Flask, jsonify
from functools import wraps


class MyFlask(Flask):
   
    @staticmethod
    def pre(*args, **kwargs):
        """method run before request"""

    @staticmethod
    def pro(return_value, *args, **kwargs):
        """method run after request"""
        return jsonify(return_value)

    def route(self, rule, **options):
        """extended Flask.route - add to function pre and pro method """
        old_decorator = super().route(rule, **options)

        def decorator(f):
            @wraps(f)
            def func(*args, **kwargs):
                self.pre(*args, **kwargs)
                return_value = f(*args, **kwargs)
                return self.pro(return_value, *args, **kwargs)

            old_decorator(func)
            return f

        return decorator

app = MyFlask(__name__)

@app.route("/")
def hello():
    return {'message': 'Hello world!'}

print(hello())

if __name__ == "__main__":
    app.run()