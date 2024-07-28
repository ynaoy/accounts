from django.test import TestCase
from .test.models_tests import UserModelTests
from .test.utils_tests import UserUtilsTests
from .test.views_tests import (IsLoginViewsTest, JWTUserIDRetrievalViewTests,
  SignupViewTests, LoginViewTests, UpdateViewTests, DestroyViewTests)


class Tests(TestCase):
  UserModelTests()
  UserUtilsTests()
  IsLoginViewsTest(),
  JWTUserIDRetrievalViewTests(),
  SignupViewTests()
  LoginViewTests()
  UpdateViewTests()
  DestroyViewTests()