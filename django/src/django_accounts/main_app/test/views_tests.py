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
    self.assertTrue(response.content.decode().find("[ユーザーネームが長すぎます]"))
    self.assertTrue(response.content.decode().find("[メールアドレスを入力してください]"))
    self.assertTrue(response.content.decode().find("[パスワードを入力してください]"))
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
    self.assertEqual(response.status_code, 409)
    # カスタムエラーメッセージが適用されている
    self.assertTrue(response.content.decode().find("[このユーザーネームは既に使用されています]"))
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
    self.assertEqual(response.status_code, 409)
    # カスタムエラーメッセージが適用されている
    self.assertTrue(response.content.decode().find("[このメールアドレスは既に使用されています]"))
    # クッキーにアクセストークンとリフレッシュトークンが存在しない
    self.assertFalse("Authorization" in response.cookies)
    self.assertFalse("refresh" in response.cookies)

  def test_signup_view_required_params(self):
    """  
    signup_viewに必要なパラメータを指定しなかったときにユーザーが追加されずログインされない
    """
    post_data = {}
    
    response = self.client.post(self.signup_url,
                                post_data,
                                content_type=self.content_type)
    
    # 400エラーが返ってくる
    self.assertEqual(response.status_code, 400)
    # カスタムエラーメッセージが適用されている
    self.assertTrue(response.content.decode().find("[ユーザーネームは必須です]"))
    self.assertTrue(response.content.decode().find("[メールアドレスは必須です]"))
    self.assertTrue(response.content.decode().find("[パスワードは必須です]"))
    # クッキーにアクセストークンとリフレッシュトークンが存在しない
    self.assertFalse("Authorization" in response.cookies)
    self.assertFalse("refresh" in response.cookies)

class LoginViewTests(TestCase):

  def setUp(self):
    self.login_url = reverse("main_app:login")
    self.content_type = "application/json"

  def test_login_view_post_with_valid_params(self):
    """
    適切なパラメータでlogin_viewにPOSTメソッドを送ったときにステータスコード200が返ってきて、
    ログイン状態が変わっている
    """
    test_user = create_default_user()
    response = self.client.post(self.login_url,
                                { "email": test_user.email,
                                  "password": "password"},
                                content_type=self.content_type)
    # ログインに成功している
    self.assertEqual(response.status_code, 200)
    # クッキーにアクセストークンとリフレッシュトークンが存在する
    self.assertTrue(response.cookies.get("Authorization"))
    self.assertTrue(response.cookies.get("refresh"))

  def test_login_view_post_with_valid_params(self):
    """
    バリデーションの通らないパラメータでlogin_viewにPOSTメソッドを送ったときに400エラーが返ってきて、
    ログイン状態が変わらない
    """
    test_user = create_default_user()
    response = self.client.post(self.login_url,
                                { "email": "",
                                  "password": ""},
                                content_type=self.content_type)
    # 400エラーが返ってくる
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    # カスタムエラーメッセージが適用されている
    self.assertTrue(response.content.decode().find("[メールアドレスを入力してください]"))
    self.assertTrue(response.content.decode().find("[パスワードを入力してください]"))
    # クッキーが空
    self.assertFalse(response.cookies)

  def test_login_view_post_with_invalid_password(self):
    """
    誤ったパスワードでlogin_viewにPOSTメソッドを送ったときに401エラーが帰ってきて、ログインされない
    """
    test_user = create_default_user()
    response = self.client.post(self.login_url,
                                { "email": test_user.email,
                                  "password": "ivalid_password"},
                                content_type=self.content_type)
    # 401エラーが返ってくる
    self.assertEqual(response.status_code, 401)
    self.assertTrue(response.content.decode().find("[パスワードが間違っています]"))
    # クッキーが空
    self.assertFalse(response.cookies)

  def test_login_view_post_with_invalid_email(self):
    """
    誤ったメールアドレスでlogin_viewにPOSTメソッドを送ったときに404エラーが帰ってきてログインされない
    """
    test_user = create_default_user()
    response = self.client.post(self.login_url,
                                { "email": "invalidexample@example.com",
                                  "password": "password"},
                                content_type=self.content_type)
    # 401エラーが返ってくる
    self.assertEqual(response.status_code, 404)
    self.assertTrue(response.content.decode().find("[メールアドレスが間違っています]"))
    # クッキーが空
    self.assertFalse(response.cookies)

  def test_login_view_post_with_login(self):
    """
    ログイン中にlogin_viewにPOSTメソッドを送ったときに403エラーが帰ってくる
    """
    test_user = create_default_user()
    headers = create_jwt_headers(test_user)
    response = self.client.post(self.login_url,
                                { "email": test_user.email,
                                  "password": "password"},
                                headers=headers,
                                content_type=self.content_type)
    # 403エラーが返ってくる
    self.assertEqual(response.status_code, 403)
    # クッキーが空
    self.assertFalse(response.cookies)

  def test_login_view_required_params(self):
    """  
    必要なパラメータが不足している状態でlogin_viewにPOSTメソッドを送ったときに
    400エラーが帰ってきてログインされない
    """
    post_data = {}
    
    response = self.client.post(self.login_url,
                                post_data,
                                content_type=self.content_type)
    
    # 400エラーが返ってくる
    self.assertEqual(response.status_code, 400)
    # カスタムエラーメッセージが適用されている
    self.assertTrue(response.content.decode().find("[メールアドレスは必須です]"))
    self.assertTrue(response.content.decode().find("[パスワードは必須です]"))
    # クッキーにアクセストークンとリフレッシュトークンが存在しない
    self.assertFalse("Authorization" in response.cookies)
    self.assertFalse("refresh" in response.cookies)

class UpdateViewTests(TestCase):

  def setUp(self):
    self.content_type = "application/json"

  def test_update_view_patch_with_valid_params_and_login(self):
    """
    ログイン時に適切なパラメータでupdate_viewにPATCHメソッドを送ったときにステータスコード200が返ってきて、
    ユーザーネームとパスワードが変更されている
    """
    test_user = create_default_user()
    headers = create_jwt_headers(test_user)
    response = self.client.patch(reverse("main_app:update", args=[test_user.pk]),
                                { "username": "Changed User",
                                  "email": "changedemail@example.com"},
                                content_type=self.content_type,
                                headers = headers)
    # ステータス200が返ってくる
    self.assertEqual(response.status_code, 200)
    # ユーザーネームとパスワードが変わっている
    test_user = User.objects.get(pk=test_user.pk) # 再度ユーザーオブジェクトを取得
    self.assertEqual(test_user.username, "Changed User")
    self.assertEqual(test_user.email, "changedemail@example.com")

  def test_update_view_patch_with_valid_params_and_not_login(self):
    """
    非ログイン時に適切なパラメータでupdate_viewにPATCHメソッドを送ったときに
    ユーザーの情報が更新されず、401エラーが返ってくる
    """
    test_user = create_default_user()
    response = self.client.patch(reverse("main_app:update", args=[test_user.pk]),
                                { "username":"Changed User",
                                  "email":"changedemail@example.com"},
                                content_type=self.content_type)
    self.assertEqual(response.status_code, 401)
    # ユーザーネームとパスワードが変わっていない
    test_user = User.objects.get(pk=test_user.pk) # 再度ユーザーオブジェクトを取得
    self.assertNotEqual(test_user.username, "Changed User")
    self.assertNotEqual(test_user.email, "changedemail@example.com")

  def test_update_view_patch_with_not_my_path(self):
    """
    ログイン時に間違ったPKのパスにPATCHメソッドを送ったときに
    ユーザーの情報が更新されず、403エラーが返ってくる
    """
    test_user = create_default_user()
    headers = create_jwt_headers(test_user)
    another_user = create_default_user(username="another_user", email="anotheremail@example.com")
    response = self.client.patch(reverse("main_app:update", args=[another_user.pk]),
                                { "username":"Changed User",
                                  "email":"changedemail@example.com"},
                                content_type=self.content_type,
                                headers = headers)
    self.assertEqual(response.status_code, 403)
    # ユーザーネームとパスワードが変わっていない
    test_user = User.objects.get(pk=test_user.pk) # 再度ユーザーオブジェクトを取得
    self.assertNotEqual(test_user.username, "Changed User")
    self.assertNotEqual(test_user.email, "changedemail@example.com")

  def test_update_view_patch_with_not_valid_params(self):
    """
    ログイン時に無効なパラメータでupdate_viewにPATCHメソッドを送ったときに
    ユーザーの情報が更新されず、409エラーが返ってくる
    """
    test_user = create_default_user()
    headers = create_jwt_headers(test_user)
    another_user = create_default_user(username="another_user", email="anotheremail@example.com")
    response = self.client.patch(reverse("main_app:update", args=[test_user.pk]),
                                { "username":another_user.username,
                                  "email":another_user.email},
                                content_type=self.content_type,
                                headers = headers)
    self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
    # ユーザーネームとパスワードが変わっていない
    test_user = User.objects.get(pk=test_user.pk) # 再度ユーザーオブジェクトを取得
    self.assertNotEqual(test_user.username, another_user.username)
    self.assertNotEqual(test_user.email, another_user.email)
    self.assertTrue(response.content.decode().find("[このユーザーネームは既に使用されています]"))
    self.assertTrue(response.content.decode().find("[このメールアドレスは既に使用されています]"))
