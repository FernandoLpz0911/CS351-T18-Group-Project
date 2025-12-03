from rest_framework import serializers
from django.db.models import Max
from django.contrib.auth.models import User

from .models import Block
from .merkleTree import merkle_root, hash_data 
from .skipList import update_skip_list 

# For perceptual hashing, allows for similarity checks
import imagehash
from PIL import Image

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class BlockSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Block
        fields = ['id', 'height', 'merkle_root', 'registered_image', 'image_hash', 'perceptual_hash', 'timestamp', 'owner', 'legal_name', 'ai_consent', 'items']
        read_only_fields = ['merkle_root', 'height', 'image_hash', 'perceptual_hash', 'owner', 'timestamp', 'legal_name']

    def create(self, validated_data):
        
        # calculate the height automatically
        max_height = Block.objects.aggregate(Max('height'))['height__max'] # block height has a max
        next_height = (max_height or 0) + 1
        validated_data['height'] = next_height
        
        # get the image
        image_file = validated_data.get('registered_image')
        if image_file:
            
            # check exact match
            file_content = image_file.read() 
            calculated_file_hash = hash_data(file_content)
            validated_data['image_hash'] = calculated_file_hash

            # check similarity
            try:
                image_file.seek(0) 
                pil_image = Image.open(image_file)
                
                p_hash = str(imagehash.phash(pil_image))
                validated_data['perceptual_hash'] = p_hash
            except Exception as e:
                print(f"Error generating pHash: {e}")

        # Put it in the merkle tree
        items = validated_data.get('items', [])
        items.append(f"LEGAL_OWNER:{validated_data.get('legal_name')}")
        items.append(f"AI_CONSENT:{validated_data.get('ai_consent')}")
        
        # Add the generated file hash to the leaves for a full proof of block integrity
        if validated_data.get('image_hash'):
            items.append(f"FILE_HASH:{validated_data['image_hash']}")
            
        validated_data['merkle_root'] = merkle_root(items)
        
        # Update the skipList index
        update_skip_list(validated_data['height'], validated_data['merkle_root'])
        

        # Save the data block
        return Block.objects.create(**validated_data)