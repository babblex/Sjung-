from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    """Function that returns the web application's start page

    Returns:
        template: index.html
    """
    return render_template("index.html")

@app.errorhandler(404)
def error_page_not_found(error):
    """Function that handles an 404 error

    Returns:
        str: 404
    """
    return "Sorry, the page you are looking for does not exist.", 404

@app.errorhandler(500)
def internal_error(error):
    """Function that handles an 500 error

    Returns:
        str: 500
    """
    return "An internal python error occurred. Please contact the tech team!", 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)