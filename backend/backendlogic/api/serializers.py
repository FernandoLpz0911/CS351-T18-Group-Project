from rest_framework import serializers
from .models import Block
from .merkleTree import merkle_root 
from .skipList import SkipList

class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = '__all__'
        read_only_fields = ['merkle_root']  # READ ONLY, DO NOT TOUCH

    # Create capability in the database
    def create(self, data):
        items = data.get('items', [])
        height = data.get('height')

        data['merkle_root'] = merkle_root(items)    # create a merkle node with the items

        # Pass the data block's ID/metadata to your Skip List indexing function to allow faster indexing
        SkipList(height, data['merkle_root'])

        # save this block of data
        return Block.objects.create(**data)