from django.test import TestCase
from django.urls import reverse
from rest_framework import status
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
  user= User.objects.create_user( username=username,
                                  email=email,
                                  password=password)
  return user

def create_jwt_headers(user):
  """
  テスト中のリクエストのヘッダに入れるjwtを作成
  """
  jwt_dict = get_jwt(user)
  return {"Authorization": JWT_HEADER+" "+jwt_dict["access"]}

class IsLoginViewsTest(TestCase):
  
  def setUp(self):
    self.is_login_url = reverse("main_app:is_login")
    self.content_type = "application/json"

  def test_is_login_view_get_with_jwt(self):
    """
    is_login_viewに有効なjwtを付与してGETメソッドを送ったときにTrueが返ってくる
    """
    test_user = create_default_user()
    headers = create_jwt_headers(test_user)
    
    response = self.client.get(self.is_login_url,
                               headers=headers,
                               content_type=self.content_type)
    
    # ステータス200が返ってくる
    self.assertEqual(response.status_code, 200)
    # レスポンスのデータが空でない
    self.assertTrue("loginFlg" in response.data)
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

    response = self.client.get(self.is_login_url,
                               headers=headers,
                               content_type=self.content_type)
    # 401エラーが返ってくる
    self.assertEqual(response.status_code, 401)

  def test_is_login_view_get_with_not_jwt(self):
    """
    is_login_viewにjwtを付与せず、GETメソッドを送ったときにFalseが返ってくる
    """
    response = self.client.get(self.is_login_url,
                               content_type=self.content_type)
    
    # ステータス200が返ってくる
    self.assertEqual(response.status_code, 200)
    # レスポンスのデータが空でない
    self.assertTrue("loginFlg" in response.data)
    # レスポンスのデータのloginFlgがFalse
    self.assertFalse(response.data.get("loginFlg"))

class SignupViewTests(TestCase):

  def setUp(self):
    self.signup_url = reverse("main_app:signup")
    self.content_type = "application/json"
    
  def test_signup_view_post(self):
    """  
    signup_viewにPOSTメソッドを送ったときにユーザーが追加されてログインされている
    """
    post_data = { "username": "Test User",
                  "email": "example@example.com",
                  "password": "password" }
    
    response = self.client.post(self.signup_url,
                                post_data,
                                content_type=self.content_type)
    
    # ステータス201が返ってくる
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    # ユーザーがデータベースに保存されている
    self.assertTrue(User.objects.filter(email="example@example.com").exists())
    # クッキーにアクセストークンとリフレッシュトークンが存在する
    self.assertTrue("Authorization" in response.cookies)
    self.assertTrue("refresh" in response.cookies)
  
  def test_signup_view_post_with_invalid_params(self):
    """
    signup_viewに無効なパラメータでPOSTメソッドを送ったときにユーザーが追加されない、ログインされない
    """
    post_data = { "username": "a"*16,
                  "email": "",
                  "password": ""}
    response = self.client.post(self.signup_url,
                                post_data,
                                content_type=self.content_type)

    # 401エラーが返ってくる
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    # カスタムエラーメッセージが適用されている
    self.assertTrue(response.content.decode().find('ユーザーネームが長すぎます'))
    self.assertTrue(response.content.decode().find('メールアドレスを入力してください'))
    self.assertTrue(response.content.decode().find('パスワードを入力してください'))
    # ユーザーがデータベースに保存されていない
    self.assertFalse(User.objects.filter(email="example@example.com").exists())
    # クッキーにアクセストークンとリフレッシュトークンが存在しない
    self.assertFalse("Authorization" in response.cookies)
    self.assertFalse("refresh" in response.cookies)

  def test_signup_view_post_with_duplicated_username(self):
    """
    signup_viewに重複したusernameでPOSTメソッドを送ったときにユーザーが追加されない、ログインされない
    """
    # ユーザーを作成
    create_default_user(
      username="Test User",
      email="original@example.com",
      password="password")

    post_data = { "username":"Test User",
                  "email":"duplicated@example.com",
                  "password":"password"}
    response = self.client.post(self.signup_url,
                                post_data,
                                content_type=self.content_type)
    # 409エラーが返ってくる
    self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
    # カスタムエラーメッセージが適用されている
    self.assertTrue(response.content.decode().find('このユーザーネームは既に使用されています'))
    # クッキーにアクセストークンとリフレッシュトークンが存在しない
    self.assertFalse("Authorization" in response.cookies)
    self.assertFalse("refresh" in response.cookies)

  def test_signup_view_post_with_duplicated_email(self):
    """
    signup_viewに重複したemailでPOSTメソッドを送ったときにユーザーが追加されない、ログインされない
    """
    # ユーザーを作成
    create_default_user(
      username="Test User",
      email="example@example.com",
      password="password")

    post_data = { "username":"Duplicated User",
                  "email":"example@example.com",
                  "password":"password"}
    response = self.client.post(self.signup_url,
                                post_data,
                                content_type=self.content_type)

    # 409エラーが返ってくる
    self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
    # カスタムエラーメッセージが適用されている
    self.assertTrue(response.content.decode().find('このメールアドレスは既に使用されています'))
    # クッキーにアクセストークンとリフレッシュトークンが存在しない
    self.assertFalse("Authorization" in response.cookies)
    self.assertFalse("refresh" in response.cookies)

class LoginViewTests(TestCase):

  def setUp(self):
    self.login_url = reverse("main_app:login")
    self.content_type = "application/json"

  def test_login_view_post_with_valid_params(self):
    """
    正しいパラメータでlogin_viewにPOSTメソッドを送ったときにログインされている
    """
    test_user = create_default_user()
    response = self.client.post(self.login_url,
                                { "email": test_user.email,
                                  "password": "password"},
                                content_type="application/json")
    # ログインに成功している
    self.assertEqual(response.status_code, 201)
    # クッキーにアクセストークンとリフレッシュトークンが存在する
    self.assertTrue(response.cookies.get("Authorization"))
    self.assertTrue(response.cookies.get("refresh"))

  def test_login_view_post_with_invalid_password(self):
    """
    誤ったメールアドレスでlogin_viewにPOSTメソッドを送ったときにログインされない
    """
    test_user = create_default_user()
    response = self.client.post(self.login_url,
                                { "email": test_user.email,
                                  "password": "ivalid_password"},
                                content_type="application/json")
    # 401エラーが返ってくる
    self.assertEqual(response.status_code, 401)
    # クッキーが空
    self.assertFalse(response.cookies)

  def test_login_view_post_with_invalid_email(self):
    """
    誤ったパスワードでlogin_viewにPOSTメソッドを送ったときにログインされない
    """
    test_user = create_default_user()
    response = self.client.post(self.login_url,
                                { "email": "invalidexample@example.com",
                                  "password": "password"},
                                content_type="application/json")
    # 401エラーが返ってくる
    self.assertEqual(response.status_code, 401)
    # クッキーが空
    self.assertFalse(response.cookies)

  def test_login_view_post_with_login(self):
    """
    ログイン中にlogin_viewにPOSTメソッドを送ったときにエラーが表示される
    """
    test_user = create_default_user()
    headers = create_jwt_headers(test_user)
    response = self.client.post(self.login_url,
                                { "email": test_user.email,
                                  "password": "password"},
                                headers=headers,
                                content_type="application/json")
    # 403エラーが返ってくる
    self.assertEqual(response.status_code, 403)
    # クッキーが空
    self.assertFalse(response.cookies)