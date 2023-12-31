from django.db import models
from django.contrib.auth.models import (BaseUserManager,
                                        AbstractBaseUser,
                                        PermissionsMixin)
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    def _create_user(self, username, email, password, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(
            username=username,
            email=email,
            password=password,
            **extra_fields,
        )

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields['is_active'] = True
        extra_fields['is_staff'] = True
        extra_fields['is_superuser'] = True
        return self._create_user(
            username=username,
            email=email,
            password=password,
            **extra_fields,
        )
    
    def update_user(self, fields):
        for key, value in fields.items():
            if(key=="password"):
                self.set_password(value)
            else:
                if(key=="email") : 
                    value = self.normalize_email(value)
                setattr(self, key, value)
        self.save(using=self._db)
        return self

class User(AbstractBaseUser, PermissionsMixin):

    username = models.CharField(
        verbose_name=_("username"),
        max_length=15,
        blank=False,
        unique=True
    )
    email = models.EmailField(
        verbose_name=_("email"),
        blank=False,
        unique=True
    )
    is_superuser = models.BooleanField(
        verbose_name=_("is_superuer"),
        default=False
    )
    is_staff = models.BooleanField(
        verbose_name=_('is_staff'),
        default=False,
    )
    is_active = models.BooleanField(
        verbose_name=_('is_active'),
        default=True,
    )
    created_at = models.DateTimeField(
        verbose_name=_("created_at"),
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        verbose_name=_("updateded_at"),
        auto_now=True
    )

    objects = UserManager()

    USERNAME_FIELD = 'email' # ログイン時、ユーザー名の代わりにemailを使用
    REQUIRED_FIELDS = ['username']  # スーパーユーザー作成時にusernameも設定する

    def __str__(self):
        return self.username
