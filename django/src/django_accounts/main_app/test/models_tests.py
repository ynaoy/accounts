from django.test import TestCase
from django.core.exceptions import ValidationError
from ..models import User

def default_user_model(username="Test User",
                       email="example@example.com",
                       password="password"):
  user = User(  username=username, 
                email=email,
              )
  user.set_password(password)
  return user

class UserModelTests(TestCase):

  def test_create_user_with_valid_data(self):
    """
    バリデーションが通った時、ユーザーが作成されている
    """
    test_user = default_user_model()
    self.assertEqual(test_user.full_clean(), None)

  def test_create_user_with_username_over_16wards(self):
    """
    usernameが16文字以上の時、ValidationErrorが表示される
    """
    test_user = default_user_model(username="a"*16)
    try: 
      test_user.full_clean()
    except:
      self.assertRaises(ValidationError)

  def test_create_user_with_username_is_blank(self):
    """
    usernameが空の時、ValidationErrorが表示される
    """
    test_user = default_user_model(username="")
    try: 
      test_user.full_clean()
    except:
      self.assertRaises(ValidationError)
    
  def test_create_user_with_username_must_be_unieque(self):
    """
    usernameが重複した時、ValidationErrorが表示される
    """
    user = default_user_model()
    test_user = default_user_model(email="example2@example.com")
    try: 
      test_user.full_clean()
    except:
      self.assertRaises(ValidationError)

  def test_create_user_with_email_is_blank(self):
    """
    emailが空の時、ValidationErrorが表示される
    """
    test_user = default_user_model(email="")
    try: 
      test_user.full_clean()
    except:
      self.assertRaises(ValidationError)

  def test_create_user_with_email_must_be_unieque(self):
    """
    emailが重複した時、ValidationErrorが表示される
    """
    user = default_user_model()
    test_user = default_user_model(username="Test User2")
    try: 
      test_user.full_clean()
    except:
      self.assertRaises(ValidationError)

  def test_create_normal_user(self):
    """
    ユーザーが作成されたときに、is_staff, is_superuserがFalseになる
    """
    test_user = User.objects.create_user( username="test_user",
                                          email="example@example.com",
                                          password="password"
                                        )
    self.assertFalse(test_user.is_staff)
    self.assertFalse(test_user.is_superuser)

  def test_create_super_user(self):
    """
    スーパーユーザーが作成されたときに、is_staff, is_superuserがTrueになる
    """
    test_user = User.objects.create_superuser(username="test_user",
                                              email="example@example.com",
                                              password="password"
                                              )
    self.assertTrue(test_user.is_staff)
    self.assertTrue(test_user.is_superuser)

  def test_when_created_user_make_field_created_at_and_updated_at(self):
    """
    ユーザーが作成されたときに、created_at, updated_atフィールドが作成される
    """
    test_user = default_user_model()
    self.assertFalse(test_user.created_at)
    self.assertFalse(test_user.updated_at)

    test_user.save()
    self.assertTrue(test_user.created_at)
    self.assertTrue(test_user.updated_at)
  