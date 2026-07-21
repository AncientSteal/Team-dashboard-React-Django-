from functools import wraps
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings
from django.http import JsonResponse

User = get_user_model()
SECRET_KEY = settings.SECRET_KEY

def jwt_required(view_func):
    @wraps(view_func)
    def _wrapper_view(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer'):
            return JsonResponse({'error': f'Invalid authorization header'}, status=401)
        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(id=payload['user_id'])
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
            return JsonResponse({'error': f'Unauthorized: Invalid token'}, status=401)

        request.user = user

        return view_func(request, *args, **kwargs)
    return _wrapper_view