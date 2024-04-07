from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
     ビューとモデルの送受信、データの保存、更新、削除を管理するクラス
    """

    # メンバ変数群。モデルに保存する前のバリデーションを管理
    username = serializers.CharField(
        required=True,
        max_length=15,
        error_messages={
            'blank': 'ユーザーネームを入力してください',
            'max_length': 'ユーザーネームが長すぎます'
        }
    )
    email = serializers.EmailField(
        required=True,
        error_messages={
            'blank': 'メールアドレスを入力してください'
        }
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        error_messages={
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
         PUT,PATCHリクエストの時にusername, email, passwordフィールドを必須にしない
        """
        super(UserSerializer, self).__init__(*args, **kwargs)
        
        request = self.context.get('request')
        if request and request.method in ['PUT', 'PATCH']:
          self.fields['username'].required = False
          self.fields['email'].required = False
          self.fields['password'].required = False

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

    def validate_username(self, value):
        """
         is_validメソッドを使う時に、その内部で実行される
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('このユーザーネームは既に使用されています','unique')
        return value

    def validate_email(self, value):
        """
         is_validメソッドを使う時に、その内部で実行される
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('このメールアドレスは既に使用されています','unique')
        return value
    
    def is_valid(self, valid_fields=(), **kwargs):
        """
         このメソッドの実行後でないと継承元のsaveメソッドを使えない
         valid_fields : 継承元のis_validメソッドに渡すデータを管理できる
        """
        if valid_fields:
            self.initial_data = {k: v for k, v in self.initial_data.items() if(k in valid_fields)}
        return super().is_valid(**kwargs)
    