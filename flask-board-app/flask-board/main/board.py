from main import *
from flask import Blueprint, send_from_directory

blueprint = Blueprint("board", __name__, url_prefix="/board")


@blueprint.route("/list")
def lists():
    # 페이지 값 (값이 없는 경우 기본값은 1)
    page = request.args.get("page", default=1, type=int)
    # 한 페이지당 몇 개의 게시물을 출력할 지
    limit = request.args.get("limit", 10, type=int)

    search = request.args.get("search", -1, type=int)
    keyword = request.args.get("keyword", type=str)

    # 최종적으로 완성된 퀴리를 만들 변수
    query = {}
    # 검색어 상태를 추가할 리스트 변수
    search_list = []

    if search == 0:
        search_list.append({"title": {"$regex": keyword}})
    elif search == 1:
        search_list.append({"contents": {"$regex": keyword}})
    elif search == 2:
        search_list.append({"title": {"$regex": keyword}})
        search_list.append({"contents": {"$regex": keyword}})
    elif search == 3:
        search_list.append({"name": {"$regex": keyword}})
    # 검색 대상이 한개라도 존재할 경우 query 변수에 $or 리스트를 쿼리한다.
    if len(search_list) > 0:
        query = {"$or": search_list}

    board = mongo.db.board
    # 게시물 내림차순 정렬 내용 추가 .sort("_id", -1)
    datas = board.find(query).sort("_id", -1).skip((page - 1) * limit).limit(limit)

    # 게시물의 총 개수
    total_count = board.find(query).count()
    # 마지막 페이지의 수
    last_page_num = math.ceil(total_count / limit)

    # 페이지 블럭을 5개씩 표기
    block_size = 5
    # 현재 블럭의 위치
    block_num = int((page - 1) / block_size)
    # 블럭의 시작 위치
    block_start = int((block_size * block_num) + 1)
    # 블럭의 끝 위치
    block_last = math.ceil(block_start + (block_size - 1))

    return render_template(
        "list.html",
        datas=datas,
        total=total_count,
        limit=limit,
        page=page,
        block_start=block_start,
        block_last=block_last,
        last_page_num=last_page_num,
        search=search,
        keyword=keyword,
    )


@blueprint.route("/view/<idx>")
def board_view(idx):
    if idx is not None:
        page = request.args.get("page")
        search = request.args.get("search")
        keyword = request.args.get("keyword")

        board = mongo.db.board
        data = board.find_one_and_update(
            {"_id": ObjectId(idx)}, {"$inc": {"view": 1}}, return_document=True
        )

        if data is not None:
            result = {
                "id": data.get("_id"),
                "writer_id": data.get("writer_id", ""),
                "name": data.get("name"),
                "title": data.get("title"),
                "contents": data.get("contents"),
                "created_at": data.get("created_at"),
                "view": data.get("view"),
                "attachfile": data.get("attachfile", ""),
            }
            return render_template(
                "view.html",
                result=result,
                page=page,
                search=search,
                keyword=keyword,
            )
    return abort(404)


@blueprint.route("/write", methods=["GET", "POST"])
@login_required
def board_write():
    if request.method == "POST":
        board = mongo.db.board
        name = request.form.get("name")
        title = request.form.get("title")
        contents = request.form.get("contents")
        created_at = round(datetime.utcnow().timestamp() * 1000)

        # 첨부 파일 저장
        filename = None
        if "attachfile" in request.files:
            file = request.files["attachfile"]
            if file and allowed_file(file.filename):
                filename = check_filename(file.filename)
                file.save(os.path.join(app.config["BOARD_ATTACH_FILE_PATH"], filename))

        post = {
            "writer_id": session.get("id"),
            "name": name,
            "title": title,
            "contents": contents,
            "created_at": created_at,
            "view": 0,
        }

        if filename is not None:
            post["attachfile"] = filename

        x = board.insert_one(post)
        return redirect(url_for("board.board_view", idx=x.inserted_id))
    else:
        return render_template("write.html")


@blueprint.route("/edit/<idx>", methods=["GET", "POST"])
@login_required
def board_edit(idx):
    board = mongo.db.board
    data = board.find_one({"_id": ObjectId(idx)})

    if request.method == "POST":
        title = request.form.get("title")
        contents = request.form.get("contents")

        if session.get("id") != data.get("writer_id"):
            flash("해당 글의 수정 권한이 없습니다.")
            return redirect(url_for("board.board_view", idx=idx))

        filename = data.get("attachfile")

        # 새로 첨부된 파일명이 있다면
        if "attachfile" in request.files:
            # 기존 첨부파일 삭제
            board_delete_attach_file(filename)
            # 새로운 첨부 파일을 저장
            file = request.files["attachfile"]
            if file and allowed_file(file.filename):
                filename = check_filename(file.filename)
                file.save(os.path.join(app.config["BOARD_ATTACH_FILE_PATH"], filename))
            print("새로 등록된 파일 있음:", filename)

        board.update_one(
            {"_id": ObjectId(idx)},
            {
                "$set": {
                    "title": title,
                    "contents": contents,
                    "attachfile": filename,
                }
            },
        )
        flash("글이 수정 되었습니다.")
        return redirect(url_for("board.board_view", idx=idx))

    if data is None:
        flash("해당 게시물이 존재하지 않습니다.")
        return redirect(url_for("board.lists"))
    else:
        if session.get("id") != data.get("writer_id"):
            flash("해당 글의 수정 권한이 없습니다.")
            return redirect(url_for("board.board_view", idx=idx))

    return render_template("edit.html", data=data)


@blueprint.route("/delete/<idx>")
@login_required
def board_delete(idx):
    board = mongo.db.board
    data = board.find_one({"_id": ObjectId(idx)})

    if session.get("id") != data.get("writer_id"):
        flash("해당 글의 삭제 권한이 없습니다.")
        return redirect(url_for("board.board_view", idx=idx))

    # 첨부파일이 있다면 해당 파일 삭제
    filename = data.get("attachfile")
    if filename is not None:
        board_delete_attach_file(filename)

    board.delete_one({"_id": ObjectId(idx)})
    flash("글이 삭제 되었습니다.")

    return redirect(url_for("board.lists"))


# 파일 업로드
@blueprint.route("/upload_image", methods=["POST"])
def upload_image():
    if request.method == "POST":
        file = request.files["image"]
        if file and allowed_file(file.filename):
            filename = "{}.{}".format(random_generator(12), get_file_extension(file.filename))
            print(filename)
            savefilepath = os.path.join(app.config["BOARD_IMAGE_PATH"], filename)
            file.save(savefilepath)
            return url_for("board.board_images", filename=filename)


@blueprint.route("/images/<filename>")
def board_images(filename):
    return send_from_directory(app.config["BOARD_IMAGE_PATH"], filename)


@blueprint.route("/files/<filename>")
def board_files(filename):
    return send_from_directory(
        app.config["BOARD_ATTACH_FILE_PATH"], filename, as_attachment=True
    )


# 댓글 목록 가져오기 (ajax)
@blueprint.route("/comment_list/<board_id>")
def comment_list(board_id):
    c_comment = mongo.db.comment
    comments = c_comment.find({"board_id": str(board_id)}).sort("_id", -1)

    comment_lists = []
    for c in comments:
        owner = True if c.get("writer_id") == session.get("id") else False
        comment_lists.append(
            {
                "id": str(c.get("_id")),
                "board_id": c.get("board_id"),
                "writer_id": c.get("writer_id"),
                "name": c.get("name"),
                "comment": c.get("comment"),
                "created_at": format_datetime(c.get("created_at")),
                "owner": owner,
            }
        )
    return jsonify(error="success", comment_lists=comment_lists)


# 댓글 작성
@blueprint.route("/comment_write", methods=["POST"])
@login_required
def comment_write():
    if request.method == "POST":
        writer_id = session.get("id")
        name = session.get("name")

        board_id = request.form.get("board_id")
        comment = request.form.get("comment")
        created_at = round(datetime.utcnow().timestamp() * 1000)

        c_comment = mongo.db.comment

        post = {
            "board_id": str(board_id),
            "writer_id": writer_id,
            "name": name,
            "comment": comment,
            "created_at": created_at,
        }

        c_comment.insert_one(post)
        return redirect(url_for("board.board_view", idx=board_id))


# 댓글 수정
@blueprint.route("/comment_edit", methods=["POST"])
@login_required
def comment_edit():
    if request.method == "POST":
        idx = request.form.get("id")
        comment = request.form.get("comment")

        c_comment = mongo.db.comment
        data = c_comment.find_one({"_id": ObjectId(idx)})

        if data.get("writer_id") == session.get("id"):
            c_comment.update_one(
                {"_id": ObjectId(idx)},
                {"$set": {"comment": comment}},
            )
            return jsonify(error="success")
        else:
            return jsonify(error="error")

    return abort(404)


# 댓글 삭제
@blueprint.route("/comment_delete", methods=["POST"])
@login_required
def comment_delete():
    if request.method == "POST":
        idx = request.form.get("id")

        c_comment = mongo.db.comment
        data = c_comment.find_one({"_id": ObjectId(idx)})

        if data.get("writer_id") == session.get("id"):
            c_comment.delete_one({"_id": ObjectId(idx)})
            return jsonify(error="success")
        else:
            return jsonify(error="error")

    return abort(404)
