from main import *
from flask import Blueprint

blueprint = Blueprint("home", __name__, url_prefix='/')


@blueprint.route("/")
def index():
    return redirect(url_for("board.lists"))
