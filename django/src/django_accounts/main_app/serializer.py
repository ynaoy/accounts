from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
  """
   ビューとモデルの送受信、データの保存、更新、削除を管理するクラス
  """

  # メンバ変数群。モデルに保存する前のバリデーションを管理
  username = serializers.CharField(
    required=False, # リクエストの際に必須なフィールドかどうか。空文字判定はallow_blank属性で設定できる(デフォルトはFalse)
    max_length=15,
    error_messages={
      'require': 'ユーザーネームは必須です',
      'blank': 'ユーザーネームを入力してください',
      'max_length': 'ユーザーネームが長すぎます'
    }
  )
  email = serializers.EmailField(
    required=False,
    error_messages={
      'require': 'メールアドレスは必須です',
      'blank': 'メールアドレスを入力してください'
    }
  )
  password = serializers.CharField(
    required=False,
    write_only=True,
    error_messages={
      'require': 'パスワードは必須です',
      'blank': 'パスワードを入力してください'
    }
  )

  class Meta:
    """
     model : やりとりするモデル
     fields : モデルに送信できるフィールド
     extra_kwargs : バリデーションを記述できるフィールド
     extra_kwargsを使う場合、extra_kwargs{ 'validators':[] }を書かないとモデルのバリデーションが優先される
    """
    model = User
    fields = ('id', 'username', 'email', 'password')

  def __init__(self, *args, **kwargs):
    """
     追加のカスタムバリデーションが指定されていれば実行する
     特定のフィールドのrequired属性を変更できる
    """
    super().__init__(*args, **kwargs)
    # キーにフィールド名、バリューに実行するメソッドのリストの辞書型をコンテキストから取得
    custom_validators = self.context.get('custom_validators', {})
    # バリデーションを追加
    for field_name, validators in custom_validators.items():
      for validator in validators:
        self.fields[field_name].validators.append(validator)
    # キーにフィールド名、バリューにBooleanの辞書型をコンテキストから取得
    required_fields = self.context.get('required_fields', {})
    # required属性を変更
    for field_name, require in required_fields.items():
      try:
        self.fields[field_name].required = require
      except:
        continue

  def create(self, validated_data):
    """
     新しいUserインスタンスの作成。
     継承元のsaveメソッドを使うと、勝手にcreateかupdateメソッドのどちらかを実行してくれる
    """
    return User.objects.create_user(**validated_data)
  
  def update(self, instance, validated_data):
    """
     既存のUserインスタンスの更新。
    """
    instance.update_user(validated_data)
    return instance
  
  def is_valid(self, valid_fields=(), **kwargs):
    """
     このメソッドの実行後でないと継承元のsaveメソッドを使えない
     valid_fields : 継承元のis_validメソッドに渡すデータを管理できる
    """
    if valid_fields:
      self.initial_data = {k: v for k, v in self.initial_data.items() if(k in valid_fields)}
    return super().is_valid(**kwargs)
  
def username_unique_validator(value):
  """
   このユーザーネームのユーザーが既に存在すればバリデーションエラーを返す
  """
  if User.objects.filter(username=value).exists():
    raise serializers.ValidationError('このユーザーネームは既に使用されています','unique')
    
def email_unique_validator(value):
  """
   このメールアドレスのユーザーが既に存在すればバリデーションエラーを返す
  """
  if User.objects.filter(email=value).exists():
    raise serializers.ValidationError('このメールアドレスは既に使用されています','unique')

    