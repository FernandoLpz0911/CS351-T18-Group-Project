# Contains the functions for http requests then spits out a response

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from rest_framework import viewsets
from .models import Block
from .serializers import BlockSerializer

class BlockViewSet(viewsets.ModelViewSet):
    # This query retrieves all blocks, ordered by block_height descending
    queryset = Block.objects.all().order_by('-height') 
    
    # Links the view to your custom logic in BlockSerializer
    serializer_class = BlockSerializer

def api(request):
    template = loader.get_template('first.html')
    return HttpResponse(template.render())

# Create your views here.
