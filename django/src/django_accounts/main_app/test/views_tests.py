from django.test import TestCase
from django.urls import reverse
from unittest import skip
from ..models import User
from ..utils import get_jwt
import os

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

def create_jwt_headers(user):
  """
  テスト中のリクエストのヘッダに入れるjwtを作成
  """
  jwt_dict = get_jwt(user)
  return {"Authorization": JWT_HEADER+" "+jwt_dict["access"]}

class UserViewsTests(TestCase):
  
  def test_is_login_view_get_with_jwt(self):
    """
    is_login_viewに有効なjwtを付与してGETメソッドを送ったときにTrueが返ってくる
    """
    test_user = create_default_user()
    headers = create_jwt_headers(test_user)
    
    response = self.client.get(reverse("main_app:is_login"),
                               headers=headers,
                               content_type="application/json")
    
    # ステータス200が返ってくる
    self.assertEqual(response.status_code, 200)
    # レスポンスのデータが空でない
    self.assertTrue(response.data)
    # レスポンスのデータのloginFlgがTrue
    self.assertTrue(response.data.get("loginFlg"))

  def test_is_login_view_get_with_invalid_jwt(self):
    """
    is_login_viewに無効なjwtを付与してGETメソッドを送ったときに401エラーが返ってくる
    """
    test_user = create_default_user()
    headers = create_jwt_headers(test_user)
    # 無効なトークンにする
    headers["Authorization"] += "invalid"

    response = self.client.get(reverse("main_app:is_login"),
                               headers=headers,
                               content_type="application/json")
    # 401エラーが返ってくる
    self.assertEqual(response.status_code, 401)

  def test_is_login_view_get_with_not_jwt(self):
    """
    is_login_viewにjwtを付与せず、GETメソッドを送ったときにFalseが返ってくる
    """
    response = self.client.get(reverse("main_app:is_login"),
                               content_type="application/json")
    
    # ステータス200が返ってくる
    self.assertEqual(response.status_code, 200)
    # レスポンスのデータが空でない
    self.assertTrue(response.data)
    # レスポンスのデータのloginFlgがFalse
    self.assertFalse(response.data.get("loginFlg"))