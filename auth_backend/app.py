import os
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from flask_cors import CORS
from auth.config import Config
from auth.models import db, User

# --------------------------------
# Create app
# --------------------------------
app = Flask(__name__)
app.config.from_object(Config)

# --------------------------------
# CORS (MORA biti poslije app)
# --------------------------------
CORS(app, origins=["https://auth-frontend-mauve.vercel.app/"])

print("DATABASE_URL FROM ENV:", os.environ.get("DATABASE_URL"))

# --------------------------------
# Extensions
# --------------------------------
db.init_app(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

with app.app_context():
    db.create_all()

# --------------------------------
# Routes
# --------------------------------

@app.route("/")
def home():
    return {"message": "Auth API running"}

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if "@" not in email or "." not in email:
        return jsonify({"error": "Invalid email format"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
    "access_token": access_token,
    "message": "Login successful"
})


@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    return jsonify({"message": f"You are logged in as user {user_id}"})

@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    return jsonify({
        "id": user.id,
        "email": user.email
    })

# --------------------------------
# Run server
# --------------------------------
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 10000))
    )