from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .models import ToDo

from json import dumps, loads


def view_todos(request):
    try:
        todos = ToDo.objects.filter(is_deleted=False).values()
        return JsonResponse(list(todos), safe=False)
    except (ValueError, TypeError, Exception) as e:
        return HttpResponse(f"Something went wrong while listing Todos: {e}")


@csrf_exempt
def create_todo(request):
    payload = loads(request.body)
    try:
        todo = ToDo.objects.create(title=payload["title"], description=payload["description"])
        return JsonResponse(todo, safe=False)
    except (ValueError, TypeError, Exception) as e:
        return HttpResponse(f"Something went wrong while creating a Todo: {e}")


@csrf_exempt
def edit_todo(request, pk):
    try:
        payload = loads(request.body)
        todo = ToDo.objects.get(pk=pk)
        if todo:
            todo.title = payload["title"]
            todo.description = payload["description"]
            todo.save()
        return JsonResponse(todo, safe=False)
    except (ValueError, TypeError, Exception) as e:
        return HttpResponse(f"Something went wrong while editing a Todo: {e}")

@csrf_exempt
def delete_todo(request, pk):
    try:
        todo = ToDo.objects.get(pk=pk)
        if todo:
            todo.is_deleted = True
            todo.save()
        return JsonResponse(dumps({ "message": "Todo deleted"}), safe=False)
    except (ValueError, TypeError, Exception) as e:
        return HttpResponse(f"Something went wrong while deleting a Todo: {e}")
