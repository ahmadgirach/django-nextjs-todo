from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class ToDo(models.Model):
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=100, blank=True, null=True)
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, blank=True, null=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ["-id"]

    def __str__(self) -> str:
        return self.title
