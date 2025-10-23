# api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from django.shortcuts import get_object_or_404
from .models import Block
from .serializers import BlockSerializer
from .merkleTree import hash_data
from rest_framework.parsers import JSONParser, MultiPartParser

class BlockViewSet(viewsets.ModelViewSet):
    queryset = Block.objects.all().order_by('-height') 
    serializer_class = BlockSerializer

class IDLookupView(APIView):
    def post(self, request, *args, **kwargs):
        query_hash = request.data.get('query_hash')
        
        if not query_hash:
            return Response({'error': 'Missing query_hash'}, status=status.HTTP_400_BAD_REQUEST)

        try:

            block_data = Block.objects.get(image_hash=query_hash) 
            
            # If found, prepare data for the frontend
            serializer = BlockSerializer(block_data)
            
            response_data = {
                 'author': block_data.items[0].split(':')[-1].strip(),
                 'date_uploaded': block_data.timestamp.strftime('%Y-%m-%d %H:%M'),
                 'image_url': block_data.registered_image.url if block_data.registered_image else None,
                 'block_hash': serializer.data['merkle_root'], 
                 'hash_key': block_data.image_hash 
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Block.DoesNotExist:
            # 404 is the correct status if the resource (the block) isn't found
            return Response({'error': f'Item not registered with hash/ID: {query_hash}.'}, 
                            status=status.HTTP_404_NOT_FOUND)

class FileCompareView(APIView):
    parser_classes = [MultiPartParser] 

    def post(self, request, *args, **kwargs):
        image_file = request.data.get('image')

        if not image_file:
            return Response({'error': 'Missing image file.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Calculate the hash of the uploaded file content
            file_content = image_file.read() 
            calculated_hash = hash_data(file_content) # Use your utility function

            # Search the database using the calculated hash
            block_data = Block.objects.get(image_hash=calculated_hash)
            
            # If found, prepare data for the frontend
            serializer = BlockSerializer(block_data)

            response_data = {
                 'author': block_data.items[0].split(':')[-1].strip(),
                 'date_uploaded': block_data.timestamp.strftime('%Y-%m-%d %H:%M'),
                 'image_url': block_data.registered_image.url if block_data.registered_image else None,
                 'block_hash': serializer.data['merkle_root'], 
                 'hash_key': block_data.image_hash 
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Block.DoesNotExist:
            return Response({'error': 'File not found. Exact image was not registered.'}, 
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'An internal error occurred: {str(e)}'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)