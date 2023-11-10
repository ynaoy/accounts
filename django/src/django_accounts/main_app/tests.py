from django.test import TestCase
from .test.models_tests import UserModelTests
from .test.utils_tests import UserUtilsTests
from .test.views_tests import UserViewsTests

class Tests(TestCase):
  UserModelTests()
  UserUtilsTests()
  UserViewsTests()