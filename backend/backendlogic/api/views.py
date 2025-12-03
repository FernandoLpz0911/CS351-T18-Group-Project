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
from django.db import IntegrityError

# imports for user authentication using tokens
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action

class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'email': user.email,
                'full_name': f"{user.first_name} {user.last_name}"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Return the full name so the frontend can display it
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'full_name': f"{user.first_name} {user.last_name}"
        })

class BlockViewSet(viewsets.ModelViewSet):
    queryset = Block.objects.all().order_by('-height')
    serializer_class = BlockSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        user = self.request.user
        full_legal_name = f"{user.first_name} {user.last_name}"
        
        serializer.save(owner=user, legal_name=full_legal_name)

    # getter for the user to get all hashes owned by user
    @action(detail=False, methods=['get'])
    def mine(self, request):
        """Returns only blocks owned by the logged-in user"""
        if not request.user.is_authenticated:
            return Response({"error": "Not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
        
        my_blocks = Block.objects.filter(owner=request.user).order_by('-timestamp')
        serializer = self.get_serializer(my_blocks, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        try:
            # Try to create the block
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:

            # If already exists, return error
            if 'image_hash' in str(e):
                return Response(
                    {'error': 'This image has already been registered in the system.'},
                    status=status.HTTP_409_CONFLICT
                )
            # If it's some other db error, crash normally
            raise e

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
                'author': block_data.owner.username if block_data.owner else "Unknown",
                'legal_name': block_data.legal_name,  # Add this
                'ai_consent': block_data.ai_consent,  # Add this
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