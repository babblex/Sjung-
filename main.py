from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template ("index.html")

@app.errorhandler(404)
def error_page_not_found(error):
    return "Sorry, the page you are looking for does not exist.", error

@app.errorhandler(500)
def internal_error(error):
    return "An internal python error occurred. Please contact the tech team!", error

if __name__ == "__main__":
    app.run()