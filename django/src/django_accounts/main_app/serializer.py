from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'username': {'required':False,'validators':[],},
            'email': {'required':False,'validators':[],},
            'password': {'write_only': True, 'required':False},
        }

    def create(self, validated_data):
        """
        新しいUserインスタンスを作成します。
        """
        return User.objects.create_user(**validated_data)
    
    def update(self, instance, validated_data):
        """
        既存のUserインスタンスを更新します。
        """
        instance.update_user(validated_data)
        return instance

    def is_valid(self, valid_fields=(), **kwargs):
        if valid_fields:
            self.initial_data = {k: v for k, v in self.initial_data.items() if(k in valid_fields)}
        return super().is_valid(**kwargs)

