# Contains the functions for http requests then spits out a response

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

def api(request):
    template = loader.get_template('first.html')
    return HttpResponse(template.render())

# Create your views here.
