from django.test import TestCase
from .test.models_tests import UserModelTests
from .test.utils_tests import UserUtilsTests

class Tests(TestCase):
  UserModelTests()
  UserUtilsTests()