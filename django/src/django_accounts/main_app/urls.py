from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import (IsLoginView,SignupView,LoginView)

app_name = "main_app"

urlpatterns = [
  path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
  path('is_login/', IsLoginView.as_view(), name='is_login'),
  path('signup/', SignupView.as_view(), name='signup'),
  path('login/', LoginView.as_view(), name='login'),
]