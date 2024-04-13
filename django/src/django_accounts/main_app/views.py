from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from .serializer import UserSerializer
from .models import User
from .permissions import OnlyLogoutPerm
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
    try:
      serializer = self.serializer_class(data=request.data, context=self.get_serializer_context())
      # バリデーションチェック
      if serializer.is_valid(valid_fields=self.valid_fields):
        # ユーザー作成
        user = serializer.save()  # UserSerializerのcreateメソッドを呼び出す

        # JWTを発行してクッキーにセットする。そのレスポンスを返す
        response = Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        response = get_jwt_and_set_cookie(user, response)
        return response
      
      # バリデーションエラーの場合
      else: 
        # 二次元配列を一次元にして、バリデーションに引っかかった理由を抽出してるだけ
        validation_code_1d = [error_node.code for _ in  serializer.errors.values() for error_node in _ ]
        # バリデーションの理由によってHTTPステータスを管理
        http_status = status.HTTP_409_CONFLICT if validation_code_1d.count("unique") else status.HTTP_400_BAD_REQUEST
        return Response(serializer.errors, status=http_status)
    
    # その他の予期せぬエラーが発生した場合
    except Exception as e:
      return Response({'error': '予期せぬエラーが発生しました。'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
class LoginView(CreateAPIView):
    """
    ログイン用ビュー 
    """
    permission_classes = (AllowAny, OnlyLogoutPerm,)
    queryset = User.objects.all()
    serializer_class = UserSerializer
    valid_fields = ("email", "password",)               

    def post(self, request, format=None, *args, **kwargs):
      try:
        serializer = self.serializer_class(data=request.data, context=self.get_serializer_context())
        # バリデーションチェック
        if serializer.is_valid(valid_fields=self.valid_fields):
          # メールアドレスをキーにしてユーザーが存在するか確認
          email = serializer.validated_data["email"]
          password = serializer.validated_data["password"]
          user_list = User.objects.filter(email=email)
          # パスワード認証
          if user_list and check_password(password, user_list[0].password):
              user = user_list[0]
              # jwtを発行してクッキーにセットする。そのレスポンスを返す
              response = Response(serializer.validated_data, status=status.HTTP_201_CREATED)
              responce = get_jwt_and_set_cookie(user, response)
              return responce
          else:
              return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # その他の予期せぬエラーが発生した場合
      except Exception as e:
        return Response({'error': '予期せぬエラーが発生しました。'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
