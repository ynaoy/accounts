from django.test import TestCase
from unittest import skip
from ..models import User
from ..utils import get_jwt, get_jwt_and_set_cookie, verify_jwt
from rest_framework import status
from rest_framework.response import Response
from django.http import HttpRequest
from rest_framework.request import Request
from rest_framework.exceptions import AuthenticationFailed
import os

# 環境変数を読み込む
JWT_HEADER = os.environ.get("JWT_AUTH_HEADER_TYPES")

def create_default_user(username="Test User",
                       email="example@example.com",
                       password="password"):
  """
 ユーザーを作成する
  """
  user= User.objects.create_user(username=username,
                                 email=email,
                                 password=password)
  return user

class UserUtilsTests(TestCase):

  def setUp(self):
    self.user = create_default_user()

  def test_get_jwt_with_valid_user(self):
    """
    有効なユーザーを引数にしてget_jwt(user)関数を実行するとjwtが返ってくる
    """
    jwt = get_jwt(self.user)
    self.assertTrue(jwt["access"])
    self.assertTrue(jwt["refresh"])

  def test_get_jwt_with_invalid_user(self):
    """
    無効なユーザーを引数にしてget_jwt(user)関数を実行すると空のオブジェクトが返ってくる
    """
    jwt = get_jwt("")
    # jwtが空
    self.assertFalse(jwt)

  def test_get_jwt_and_set_cookie_with_valid_params(self):
    """
    有効なユーザーとレスポンスを引数にしてget_jwt_and_set_cookie(user,responce)を実行すると
    クッキーにjwtトークンがセットされる
    """
    response = Response(status=status.HTTP_200_OK)
    response = get_jwt_and_set_cookie(self.user, response)
    self.assertTrue(response.cookies.get("Authorization"))
    self.assertTrue(response.cookies.get("refresh"))

  def test_get_jwt_and_set_cookie_with_invalid_params(self):
    """
    無効なユーザーを引数にしてget_jwt_and_set_cookie(user,responce)を実行すると
    クッキーにjwtトークンがセットされない
    """
    response = Response(status=status.HTTP_200_OK)
    response = get_jwt_and_set_cookie("", response)
    # クッキーが空
    self.assertFalse(response.cookies)

  def test_verify_jwt_with_valid_jwt(self):
    """
    jwtがセットされたリクエストを引数にしてverify_jwt(request)を実行すると
    解凍されたjwtが返ってくる
    """
    request = Request(HttpRequest())
    jwt = get_jwt(self.user)
    request.META["HTTP_AUTHORIZATION"]= JWT_HEADER+" "+jwt["access"]
    raw_jwt = verify_jwt(request)
    # 認証されると(UserModel,payload)が返ってくる
    self.assertTrue(raw_jwt)

  def test_verify_jwt_with_invalid_jwt(self):
    """
    無効なjwtがセットされたリクエストを引数にしてverify_jwt(request)を実行すると
    401エラーが返ってくる
    """
    request = Request(HttpRequest())
    jwt = get_jwt(self.user)
    # jwtを無効にする
    jwt["access"] += "invalid"

    request.META["HTTP_AUTHORIZATION"]= JWT_HEADER+" "+jwt["access"]
    # 認証に失敗すると401エラーが返ってくる
    with self.assertRaises(AuthenticationFailed):
      verify_jwt(request)

  def test_verify_jwt_with_not_jwt(self):
    """
    jwtがセットされていないリクエストを引数にしてverify_jwt(request)を実行すると
    Noneが返ってくる
    """
    request = Request(HttpRequest())
    raw_jwt = verify_jwt(request)
    # Noneが返ってくる
    self.assertFalse(raw_jwt)