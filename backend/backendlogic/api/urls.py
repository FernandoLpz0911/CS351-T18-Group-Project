from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlockViewSet, IDLookupView, FileCompareView

router = DefaultRouter()
router.register(r'blocks', BlockViewSet) 

urlpatterns = [
    path('', include(router.urls)),
    path('search/id-lookup/', IDLookupView.as_view(), name='id-lookup'),        
    path('search/file-compare/', FileCompareView.as_view(), name='file-compare'), 
]