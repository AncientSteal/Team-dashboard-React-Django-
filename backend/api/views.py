import datetime
import json
from json import JSONDecodeError
from typing import TYPE_CHECKING, Optional
import jwt
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.conf import settings
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from api.decorators import jwt_required

from .models import Task

User = get_user_model()

if TYPE_CHECKING:
    from api.models import CustomUser
    User = CustomUser

SECRET_KEY = settings.SECRET_KEY

# Create your views here.
@csrf_exempt
def get_tasks(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer'):
        return JsonResponse({'error': 'Invalid authorization header'}, status=401)

    try:
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(id=user_id)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
        return JsonResponse({'error': 'Unauthorized: Invalid token'}, status=401)

    tasks = Task.objects.filter(assigned_to=user).select_related('assigned_to')
    task_list = []
    for task in tasks:
        task_list.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': task.status,
            'deadline': task.deadline.isoformat() if task.deadline else None,
            'created_at': task.created_at.isoformat(),
            'updated_at': task.updated_at.isoformat() if task.updated_at else None,
            'assigned_to': {
                'id': task.assigned_to.id,
                'name': task.assigned_to.username,
                'email': task.assigned_to.email,
            }
        })
    return JsonResponse({'status': 'success', 'tasks': task_list})

@csrf_exempt
def login_user(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user: Optional[User] = authenticate(username=username, password=password)

        if user is not None:
            now = datetime.datetime.now(datetime.timezone.utc)
            payload = {
                'user_id': user.id,
                'exp': now + datetime.timedelta(days=1)
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
            avatar_path = user.avatar_url.url if user.avatar_url else ''

            return JsonResponse({
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'position': user.position,
                    'avatar_url': avatar_path,
                }
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

    except JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    except Exception as e:
        return JsonResponse({'error': f'Backend error: {str(e)}'}, status=500)

def get_profile(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Bearer'):
        return JsonResponse({'error': 'Invalid authorization header'}, status=401)

    try:
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(id=user_id)
        avatar_path = user.avatar_url.url if user.avatar_url else ''
        cover_path = user.cover.url if user.cover else ''

        return JsonResponse({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'position': user.position,
            'avatar_url': avatar_path,
            'cover_url': cover_path,
            'bio': user.bio,
        })

    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Expired token'}, status=401)
    except (jwt.InvalidTokenError, User.DoesNotExist):
        return JsonResponse({'error': 'Invalid token'}, status=401)

@csrf_exempt
def registration_user(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        now = datetime.datetime.now(datetime.timezone.utc)
        payload = {
            'user_id': user.id,
            'exp': now + datetime.timedelta(days=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        avatar_path = user.avatar_url.url if user.avatar_url else ''
        return JsonResponse({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'position': user.position,
                'avatar_url': avatar_path,
            }
        }, status=201)

    except JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Registration error: {str(e)}'}, status=500)

@csrf_exempt
def update_profile(request):
    if request.method != 'PUT':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer'):
        return JsonResponse({'error': 'Invalid authorization header'}, status=401)

    try:
        token = auth_header.split(' ')[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(id=user_id)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
        return JsonResponse({'error': 'Unauthorized: Invalid token'}, status=401)

    try:
        if request.META.get('CONTENT_TYPE', '').startswith('multipart/form-data'):
            put_data, put_files = request.parse_file_upload(request.META, request)
        else:
            return JsonResponse({'error': 'Invalid content type. Expected multipart/form-data'}, status=400)

        username = put_data.get('username')
        position = put_data.get('position')
        bio = put_data.get('bio')

        if not username:
            return JsonResponse({'error': 'Missing username'}, status=400)
        if User.objects.filter(username=username).exclude(id=user.id).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        user.username = username
        user.position = position
        user.bio = bio

        if 'avatar_url' in put_files:
            user.avatar_url = put_files['avatar_url']
        if 'cover' in put_files:
            user.cover = put_files['cover']

        user.save()

        avatar_path = user.avatar_url.url if user.avatar_url else ''
        cover_path = user.cover.url if user.cover else ''

        return JsonResponse({
            'status': 'success',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'position': user.position,
                'avatar_url': avatar_path,
                'cover_url': cover_path,
                'bio': user.bio,
            }
        }, status=200)

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return JsonResponse({
            'error': f'Server error during update: {str(e)}',
            'traceback': traceback.format_exc()  # <-- Вы увидите точную строку падения
        }, status=500)

@csrf_exempt
@jwt_required
def create_task(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    user = request.user

    try:
        data = json.loads(request.body)
        title = data.get('title')
        description = data.get('description')
        deadline_str = data.get('deadline')
        status = data.get('status')

        deadline = None
        if deadline_str:
            deadline = parse_datetime(deadline_str)

        task = Task.objects.create(
            title=title.strip(),
            description=description.strip(),
            status=status,
            deadline=deadline,
            assigned_to=user,
        )

        return JsonResponse({
            'status': 'success',
            'task': {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'deadline': task.deadline.isoformat() if task.deadline else None,
                'status': task.status,
                'created_at': task.created_at.isoformat(),
                'updated_at': task.updated_at.isoformat() if task.updated_at else None,
                'assigned_to': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            }
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Server error during create: {str(e)}'}, status=500)

@csrf_exempt
@jwt_required
def update_task(request):
    if request.method != 'PUT':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    user = request.user

    try:
        data = json.loads(request.body)
        task_id = data.get('id')

        if not task_id:
            return JsonResponse({'error': 'Missing task ID'}, status=400)

        task = Task.objects.get(id=task_id, assigned_to=user)

    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    try:
        title = data.get('title', task.title)
        description = data.get('description', task.description)
        deadline_str = data.get('deadline')
        status = data.get('taskStatus', task.status)
        deadline = task.deadline if task.deadline else None
        if deadline_str:
            deadline = parse_datetime(deadline_str)

        task.title = title.strip() if title else ""
        task.description = description.strip() if description else ""
        task.status = status if status else "todo"
        task.deadline = deadline if deadline else None

        task.save()

        return JsonResponse({
            'status': 'success',
            'task': {
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'deadline': task.deadline.isoformat() if task.deadline else None,
                'status': task.status,
                'created_at': task.created_at.isoformat(),
                'updated_at': task.updated_at.isoformat() if task.updated_at else None,
                'assigned_to': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            }
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f'Server error during update: {str(e)}'}, status=500)

@csrf_exempt
@jwt_required
def delete_task(request):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    user = request.user

    try:
        data = json.loads(request.body)
        task_id = data.get('task_id')

        if not task_id:
            return JsonResponse({'error': 'Missing task ID'}, status=400)

        task = Task.objects.get(id=task_id, assigned_to=user)

    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    try:
        task.delete()

        return JsonResponse({
            'status': 'success',
            'task_id': task.id,
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f'Server error during delete task: {str(e)}'}, status=500)
