from main import request, redirect, url_for, flash, session
from main import app, ALLOWED_EXTENSIONS
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

from string import digits, ascii_uppercase, ascii_lowercase
import random
import os
import re

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("id") is None or session.get("id") == "":
            flash("로그인 후 사용 가능한 기능입니다.")
            return redirect(url_for("member.member_login", next_url=request.url))
        return f(*args, **kwargs)

    return decorated_function


def hash_password(password):
    return generate_password_hash(password)


def check_password(hashed_password, user_password):
    return check_password_hash(hashed_password, user_password)


# 파일 확장자 검증
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1] in ALLOWED_EXTENSIONS


# 파일 확장자 가져오기
def get_file_extension(filename):
    return "." in filename and filename.rsplit(".", 1)[1]


# 랜덤한 파일명 생성
def random_generator(length=8):
    char = ascii_lowercase + ascii_uppercase + digits
    return "".join(random.sample(char, length))


# 첨부파일 파일명 처리
def check_filename(filename):
    reg = re.compile("[^0-9a-zA-Z_.가-힝-]")
    for s in os.path.sep, os.path.altsep:
        if s:
            filename = filename.replace(s, " ")
            filename = str(reg.sub("", "_".join(filename.split()))).strip("._")

    return filename


# 기존 첨부파일 삭제
def board_delete_attach_file(filename):
    abs_path = os.path.join(app.config["BOARD_ATTACH_FILE_PATH"], filename)
    if os.path.exists(abs_path):
        os.remove(abs_path)
        return True
    return False
