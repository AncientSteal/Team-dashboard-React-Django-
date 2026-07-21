import json
import jwt
from django.http import HttpResponse, JsonResponse
from django.test import TestCase, Client, RequestFactory
from django.urls import reverse
from django.conf import settings
from api.models import Task
from django.contrib.auth import get_user_model
from api.decorators import jwt_required
User = get_user_model()

class UpdateTaskTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@mail.com',
            password='securepassword'
        )
        self.task = Task.objects.create(
            title='Old Title',
            description='old description',
            status="todo",
            assigned_to=self.user,
        )
        self.token = jwt.encode({"user_id": self.user.id}, settings.SECRET_KEY, algorithm='HS256')
        self.headers = {
            "Authorization": f"Bearer {self.token}",
        }

    def test_successful_update_task(self):
        """Проверяет успешное обновление задачи (Валидный сценарий)"""
        payload = {
            "id": self.task.id,
            "title": "Title",
            "description": "Updated description text",
            "taskStatus": "in_progress",
            "deadline": "2026-12-30T23:59:59Z"
        }

        response = self.client.put(
            reverse("update_task"),
            data=json.dumps(payload),
            content_type='application/json',
            headers=self.headers
        )

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.content)
        self.assertEqual(response_data["status"], 'success')
        self.assertEqual(response_data["task"]["title"], 'Title')
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Title')
        self.assertEqual(self.task.description, 'Updated description text')
        self.assertEqual(self.task.status, 'in_progress')

    def test_unsuccessful_update_task(self):
        """Проверяет, что без токена сервер вернет ошибку 401 (Невалидный сценарий)"""
        payload = {"id": self.task.id, "title": "Crush"}
        response = self.client.put(
            reverse("update_task"),
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 401)

    def test_wrong_user_update_task(self):
        """Проверяет, что пользователь не может изменять чужие задачи (Невалидный сценарий)"""
        wrong_user = User.objects.create_user(
            username='wronguser',
            email='wrong@mail.com',
            password='securepassword'
        )
        wrong_token = jwt.encode({"user_id": wrong_user.id}, settings.SECRET_KEY, algorithm='HS256')
        wrong_headers = {
            "Authorization": f"Bearer {wrong_token}",
        }
        payload = {
            "id": self.task.id,
            "title": "Title",
            "description": "Updated description text",
            "taskStatus": "in_progress",
            "deadline": "2026-12-30T23:59:59",
        }
        response = self.client.put(
            reverse("update_task"),
            data=json.dumps(payload),
            content_type='application/json',
            headers=wrong_headers,
        )
        self.assertEqual(response.status_code, 404)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, "Old Title")

class DeleteTaskTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@mail.com',
            password='securepassword'
        )
        self.task = Task.objects.create(
            title='Old Title',
            description='old description',
            status="todo",
            assigned_to=self.user,
        )
        self.token = jwt.encode({"user_id": self.user.id}, settings.SECRET_KEY, algorithm='HS256')
        self.headers = {
            "Authorization": f"Bearer {self.token}",
        }

    def test_successful_task_delete(self):
        """Проверяет успешное удаление задачи"""
        payload = {
            "task_id": self.task.id
        }

        response = self.client.delete(
            reverse("delete_task"),
            data=json.dumps(payload),
            content_type='application/json',
            headers=self.headers
        )

        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(response_data["status"], 'success')
        task_exists = Task.objects.filter(id=self.task.id).exists()
        self.assertFalse(task_exists)

@jwt_required
def dummy_view(request):
    return JsonResponse({
        'status': 'success',
        'user_id': request.user.id,
    })

class JWTRequiredDecoratorTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@.com',
            password='passwordTest1'
        )
        self.valid_token = jwt.encode({"user_id": self.user.id}, settings.SECRET_KEY, algorithm='HS256')
        self.headers = {
            "Authorization": f"Bearer {self.valid_token}",
        }

    def test_decorator_valid_token(self):
        """Декоратор должен пропускать валидный токен и отдавать request.user"""
        request = self.factory.get('/dummy-url', headers=self.headers)
        response = dummy_view(request)

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['user_id'], self.user.id)

    def test_decorator_missing_header(self):
        """Декоратор должен вернуть ошибку 401, если заголовок отсутствует"""
        request = self.factory.get('/dummy-url')
        response = dummy_view(request)
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content)
        self.assertEqual(data['error'], 'Invalid authorization header')

    def test_decorator_invalid_token(self):
        """Декоратор должен вернуть 401, если строка токена неверна"""
        request = self.factory.get('/dummy-url', headers={"Authorization": "Bearer wrong token"})
        response = dummy_view(request)
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content)
        self.assertEqual(data['error'], 'Unauthorized: Invalid token')

    def test_decorator_no_user(self):
        """Декоратор должен вернуть 401, если пользователя нет в БД"""
        wrong_token = jwt.encode({"user_id": -1}, settings.SECRET_KEY, algorithm='HS256')
        request = self.factory.get('/dummy-url', headers={"Authorization": f"Bearer {wrong_token}"})
        response = dummy_view(request)

        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content)
        self.assertEqual(data['error'], 'Unauthorized: Invalid token')