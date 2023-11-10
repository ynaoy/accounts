from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from .serializer import UserSerializer
from .models import User
from .utils import get_jwt_and_set_cookie, verify_jwt

class IsLoginView(RetrieveAPIView):
  """
  ログイン確認用ビュー 
  """
  permission_classes = (AllowAny,)
  queryset = User.objects.all()
  serializer_class = UserSerializer

  def get(self, request, format=None, *args, **kwargs):
    data={ "loginFlg":False}
    if(verify_jwt(request)): #jwtが間違っていたら401エラーが、jwtがセットされてなければNoneが変える
        data["loginFlg"] = True
    response = Response(data = data,
                        status = status.HTTP_200_OK,
                        content_type = "application/json")
    return response
    
class SignupView(CreateAPIView):
  """
  ユーザー登録用ビュー 
  """
  permission_classes = (AllowAny,)
  queryset = User.objects.all()
  serializer_class = UserSerializer
  valid_fields = ("username", "email", "password")

  def post(self, request, format=None, *args, **kwargs):
    serializer = self.serializer_class(data=request.data)
    if serializer.is_valid(valid_fields=self.valid_fields):
        user = serializer.save()  # UserSerializerのcreateメソッドを呼び出す

        # JWTを発行してクッキーにセットする。そのレスポンスを返す
        response = Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        response = get_jwt_and_set_cookie(user, response)
        return response
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
