from flask import (
    Flask,
    request,
    render_template,
    redirect,
    url_for,
    abort,
    flash,
    session,
    jsonify,
)
from flask_wtf.csrf import CSRFProtect

import os
from dotenv import load_dotenv
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

import math
import time
from datetime import datetime, timedelta

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv()
user_id = os.getenv("USER_ID")
user_pw = os.getenv("USER_PW")

app = Flask(__name__)

csrf = CSRFProtect(app)

app.config["SECRET_KEY"] = "dev"
app.config["PERMENENT_SESSION_LIFETIME"] = timedelta(minutes=60)

app.config[
    "MONGO_URI"
] = f"mongodb+srv://{user_id}:{user_pw}@cluster0.yhhud.mongodb.net/flask-board-inflearn?retryWrites=true&w=majority"
mongo = PyMongo(app)

BOARD_IMAGE_PATH = BASE_DIR / "main" / "static" / "upload_images"
BOARD_ATTACH_FILE_PATH = BASE_DIR / "main" / "static" / "upload_files"

ALLOWED_EXTENSIONS = set(["txt", "pdf", "png", "jpg", "jpeg", "gif"])

app.config["BOARD_IMAGE_PATH"] = BOARD_IMAGE_PATH
app.config["BOARD_ATTACH_FILE_PATH"] = BOARD_ATTACH_FILE_PATH
app.config["MAX_CONTENT_LENGTH"] = 15 * 1024 * 1024

# 이미지 저장 폴더가 없다면 해당 폴더 생성
if not os.path.exists(app.config["BOARD_IMAGE_PATH"]):
    os.mkdir(app.config["BOARD_IMAGE_PATH"])
# 첨부파일 저장 폴더가 없다면 해당 폴더 생성
if not os.path.exists(app.config["BOARD_ATTACH_FILE_PATH"]):
    os.mkdir(app.config["BOARD_ATTACH_FILE_PATH"])

from .common import (
    login_required,
    hash_password,
    check_password,
    allowed_file,
    get_file_extension,
    random_generator,
    check_filename,
    board_delete_attach_file,
)
from .filter import format_datetime
from . import home
from . import member
from . import board

app.register_blueprint(home.blueprint)
app.register_blueprint(member.blueprint)
app.register_blueprint(board.blueprint)
