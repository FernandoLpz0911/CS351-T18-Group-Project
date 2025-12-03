from PIL import Image
import hashlib
import math

class BloomFilter:
    def __init__(self, numItems, falsePositiveRate):
        self.size = self.getBloomFilterArraySize(numItems, falsePositiveRate)
        self.num_hashes = self.getNumHashes(numItems, self.size)
        self.bit_array = [0] * self.size

    def getBloomFilterArraySize(self, numItems, falsePositiveRate):
        return int(-( (numItems * math.log(falsePositiveRate))/(math.log(2)** 2) ))
    
    def getNumHashes(self, numItems, bloomFilterArraySize):
        return (bloomFilterArraySize/numItems) * (math.log(2))

    def hash(self, item, seed):
        combined_str = str(seed) + item
        encoded_str = combined_str.encode('utf-8')
        sha256_hash = hashlib.sha256(encoded_str).hexdigest()
        return int(sha256_hash, 16) % self.size

    def add(self, image_path):
        image_hash = self._hash_image(image_path)
        for seed in range(int(self.num_hashes)):
            index = self.hash(image_hash, seed)
            self.bit_array[index] = 1
    
    def check(self, image_path):
        image_hash = self._hash_image(image_path)
        for seed in range(int(self.num_hashes)):
            index = self.hash(image_hash, seed)
            if self.bit_array[index] == 0:
                return False
        return True

    def _hash_image(self, image_path):
        with Image.open(image_path) as img:
            img = img.resize((100, 100))
            return hashlib.sha256(img.tobytes()).hexdigest()