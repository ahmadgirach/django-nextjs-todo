from flask import Flask, request
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
  pass


db = SQLAlchemy(model_class=Base)

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///todos.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

marsh = Marshmallow(app)
api = Api(app)
db.init_app(app)


class ToDo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    description = db.Column(db.String(100), nullable=True)
    is_completed = db.Column(db.Boolean, default=False)

    def __str__(self) -> str:
        return self.name


class ToDoSchema(marsh.Schema):
    class Meta:
        fields = ("id", "name", "description", "is_completed")


todo_schema = ToDoSchema()
todos_schema = ToDoSchema(many=True)


with app.app_context():
    db.create_all()


class TodoResource(Resource):
    def get(self):
        todos = ToDo.query.all()
        return todos_schema.dump(todos), 200

    def post(self):
        payload = request.json
        todo = ToDo(
            name=payload["name"],
            description=payload["description"],
            is_completed=payload["is_completed"],
        )
        db.session.add(todo)
        db.session.commit()
        return todo_schema.dump(todo), 201


class TodoIndividualResource(Resource):
    def get(self, todo_id):
        todo = ToDo.query.get_or_404(todo_id)
        return todo_schema.dump(todo), 200

    def put(self, todo_id):
        todo = ToDo.query.get_or_404(todo_id)

        payload = request.json

        if "name" in payload:
            todo.name = payload["name"]
        if "description" in payload:
            todo.description = payload["description"]
        if "is_completed" in payload:
            todo.is_completed = payload["is_completed"]

        db.session.commit()

        return todo_schema.dump(todo), 202

    def delete(self, todo_id):
        todo = ToDo.query.get_or_404(todo_id)
        db.session.delete(todo)
        db.session.commit()
        return "", 204


api.add_resource(TodoResource, "/todos")
api.add_resource(TodoIndividualResource, "/todos/<int:todo_id>")


if __name__ == "__main__":
    app.run(debug=True)
