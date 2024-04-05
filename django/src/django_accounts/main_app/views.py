from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from .serializer import UserSerializer
from .models import User
from .utils import get_jwt_and_set_cookie, verify_jwt
from django.db import IntegrityError

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
    try:
      serializer = self.serializer_class(data=request.data)
      # バリデーションチェック
      if serializer.is_valid(valid_fields=self.valid_fields):
        # ユーザー作成
        try:
          user = serializer.save()  # UserSerializerのcreateメソッドを呼び出す
        except IntegrityError as e:
          # ユーザー作成時に一意性制約違反などのデータベースエラーが発生した場合
          return Response({'error': str(e)}, status=status.HTTP_409_CONFLICT)

        # JWTを発行してクッキーにセットする。そのレスポンスを返す
        response = Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        response = get_jwt_and_set_cookie(user, response)
        return response
      
      # バリデーションエラーの場合
      else: 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # その他の予期せぬエラーが発生した場合
    except Exception as e:
      return Response({'error': '予期せぬエラーが発生しました。'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
