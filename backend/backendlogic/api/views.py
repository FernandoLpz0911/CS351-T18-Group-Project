# Contains the functions for http requests then spits out a response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Block
from .serializers import BlockSerializer
from rest_framework.parsers import JSONParser, MultiPartParser

class BlockViewSet(viewsets.ModelViewSet):
    # This query retrieves all blocks, ordered by block_height descending
    queryset = Block.objects.all().order_by('-height') 
    
    # Links the view to your custom logic in BlockSerializer
    serializer_class = BlockSerializer

class IDLookupView(APIView):

    # Only allow POST requests for searching
    def post(self, request, *args, **kwargs):

        # Get the hash/ID from the JSON request
        query_hash = request.data.get('query_hash')
        
        if not query_hash:
            return Response({'error': 'Missing query_hash'}, status=status.HTTP_400_BAD_REQUEST)

        # Logic to search the database for the hash/ID
        
        # Mock Response for testing:
        if query_hash == 'valid-hash-123':
            return Response({'author': 'User Alpha', 'date_uploaded': '2025-10-22', 'block_hash': 'abcdef123...'})
        else:
            return Response({'error': 'Item not registered or invalid ID.'}, status=status.HTTP_404_NOT_FOUND)

class FileCompareView(APIView):

    # Allows receiving files
    parser_classes = [MultiPartParser] 

    def post(self, request, *args, **kwargs):
        image_file = request.data.get('image')

        if not image_file:
            return Response({'error': 'Missing image file.'}, status=status.HTTP_400_BAD_REQUEST)

        #  Logic to calculate the hash of the uploaded image file
        #  read the file contents and use hash_data function

        # Logic to search the database for that calculated hash

        # Mock Success Response for testing:
        return Response({'author': 'User Beta', 'date_uploaded': '2025-10-21', 'block_hash': 'zyxwvu456...'})

