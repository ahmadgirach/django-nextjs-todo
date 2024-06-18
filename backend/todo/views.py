from django.forms import model_to_dict
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_202_ACCEPTED,
    HTTP_204_NO_CONTENT,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
)

from .models import ToDo


@api_view()
def view_todos(request):
    try:
        todos = ToDo.objects.filter(is_deleted=False).values()
        return Response({"data": todos}, HTTP_200_OK)
    except (ValueError, TypeError, Exception) as e:
        return Response({"message": e}, HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def create_todo(request):
    payload = request.data
    try:
        todo = ToDo.objects.create(
            title=payload["title"], description=payload["description"]
        )
        return Response({"data": model_to_dict(todo)}, HTTP_201_CREATED)
    except (ValueError, TypeError, Exception) as e:
        return Response(
            {"message": f"Something went wrong while creating a Todo: {e}"},
            HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["PUT"])
def edit_todo(request, pk):
    try:
        payload = request.data
        todo = ToDo.objects.get(pk=pk)
        if not todo:
            return Response(
                {"message": "Specified record doesn't exist!"}, HTTP_404_NOT_FOUND
            )
        else:
            todo.title = payload["title"]
            todo.description = payload["description"]
            todo.save()
            return Response({"data": model_to_dict(todo)}, HTTP_202_ACCEPTED)
    except (ValueError, TypeError, Exception) as e:
        return Response(
            {"message": f"Something went wrong while editing a Todo: {e}"},
            HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["DELETE"])
def delete_todo(request, pk):
    try:
        todo = ToDo.objects.get(pk=pk)
        if not todo:
            return Response(
                {"message": "Specified record doesn't exist!"}, HTTP_404_NOT_FOUND
            )
        else:
            todo.is_deleted = True
            todo.save()
            return Response(
                {"message": "Record deleted successfully!"}, HTTP_204_NO_CONTENT
            )
    except (ValueError, TypeError, Exception) as e:
        return HttpResponse(f"Something went wrong while deleting a Todo: {e}")
