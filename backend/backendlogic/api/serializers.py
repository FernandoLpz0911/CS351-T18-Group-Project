# api/serializers.py
from rest_framework import serializers
from django.db.models import Max

from .models import Block
from .merkleTree import merkle_root, hash_data 
from .skipList import update_skip_list 

class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = '__all__'
        read_only_fields = ['merkle_root', 'height', 'image_hash'] # No touch

    def create(self, validated_data):
        
        # calculate the height automatically
        max_height = Block.objects.aggregate(Max('height'))['height__max'] # block height has a max
        next_height = (max_height or 0) + 1
        validated_data['height'] = next_height
        
        # get the image
        image_file = validated_data.get('registered_image')
        if image_file:
            
            # Read the file content into memory for hashing
            file_content = image_file.read() 
            calculated_file_hash = hash_data(file_content)
            validated_data['image_hash'] = calculated_file_hash

        # Put it in the merkle tree
        items = validated_data.get('items', [])
        
        # Add the generated file hash to the leaves for a full proof of block integrity
        if validated_data.get('image_hash'):
            items.append(f"FILE_HASH:{validated_data['image_hash']}")
            
        validated_data['merkle_root'] = merkle_root(items)
        
        # Update the skipList index
        update_skip_list(validated_data['height'], validated_data['merkle_root'])

        # Save the data block
        return Block.objects.create(**validated_data)