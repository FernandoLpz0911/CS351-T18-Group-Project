# used for data objects called models which are essentially another name for database tables

from django.db import models

class Data(models.Model):
    # items to put inside merkle tree
    items = models.JSONField()

    # merkle tree hash key
    merkle_root = models.CharField(max_length=64, blank=True)
    
    # existence check using bloom filter to check bit
    itemsExist = models.BinaryField(null=True, blank=True)

    # height to track with skipList use for fast indexing
    height = models.PositiveIntegerField(unique=True)

    # basic timestamp for image
    timestamp = models.DateTimeField(auto_now_add=True)

def __str__(self):
        return f"height #{self.height}"