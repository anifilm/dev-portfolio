from werkzeug.security import check_password_hash
from main import *
from flask import Blueprint

blueprint = Blueprint("member", __name__, url_prefix="/member")


@blueprint.route("/register", methods=["GET", "POST"])
def member_register():
    if request.method == "POST":
        email = request.form.get("email", type=str)
        name = request.form.get("name", type=str)
        password = request.form.get("password", type=str)
        password_re = request.form.get("password_re", type=str)

        if email == "" or name == "" or password == "" or password_re == "":
            flash("입력되지 않은 값이 있습니다.")
            return render_template("register.html")
        if password != password_re:
            flash("비밀번호가 일치하지 않습니다.")
            return render_template("register.html")

        members = mongo.db.members
        cnt = members.find({"email": email}).count()
        if cnt > 0:
            flash("이미 가입된 이메일 주소입니다.")
            return render_template("register.html")

        reg_date = round(datetime.utcnow().timestamp() * 1000)
        post = {
            "email": email,
            "name": name,
            "password": hash_password(password),
            "reg_date": reg_date,
            "logintime": "",
            "logincount": 0,
        }

        members.insert_one(post)

        return redirect(url_for("member.member_login"))
    else:
        return render_template("register.html")


@blueprint.route("/login", methods=["GET", "POST"])
def member_login():
    if request.method == "POST":
        email = request.form.get("email", type=str)
        password = request.form.get("password", type=str)

        if email == "":
            flash("이메일 주소를 입력하세요.")
            return redirect(url_for("member.member_login"))
        if password == "":
            flash("비밀번호를 입력하세요.")
            return redirect(url_for("member.member_login"))

        members = mongo.db.members
        data = members.find_one({"email": email})
        if data is None:
            flash("등록된 회원 정보를 찾을 수 없습니다.")
            return redirect(url_for("member.member_login"))
        else:
            if check_password_hash(data.get("password"), password):
                # 접속시간 및 접속횟수 업데이트
                current_utc_time = round(datetime.utcnow().timestamp() * 1000)
                members.update_one(
                    {"email": email},
                    {
                        "$set": {"logintime": current_utc_time},
                        "$inc": {"logincount": 1},
                    },
                )
                session["email"] = email
                session["name"] = data.get("name")
                session["id"] = str(data.get("_id"))
                session.permanent = True
            else:
                flash("비밀번호가 일치하지 않습니다.")
                return redirect(url_for("member.member_login"))

        next_url = request.form.get("next_url", type=str)
        if next_url is not None:
            return redirect(next_url)
        return redirect(url_for("board.lists"))
    else:
        next_url = request.args.get("next_url", type=str)
        if next_url is not None:
            return render_template("login.html", next_url=next_url)
        return render_template("login.html")


@blueprint.route("/logout")
def member_logout():
    session.pop("email", None)
    session.pop("name", None)
    session.pop("id", None)
    return redirect(url_for("board.lists"))
