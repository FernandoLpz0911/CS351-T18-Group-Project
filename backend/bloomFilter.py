from PIL import Image
import hashlib
import math

class BloomFilter:

    # BloomFilter 
    #
    # Has data members
    #   size: size of bitarray, determines how many items we can accomodate checking for
    #
    #   num_hashes: number of hashes we do, needed to minimise collisions
    #
    #   falsePositiveRate: selected acceptable false positive rate, a bloom filter will never 
    #   have a false negative but can have false positives, since it's only checking if the corresponding hash
    #   has bits in the bit_array activated (array of all 0s, if activated turn element to 1), 
    #   if no bits are activated at all we know for sure that it doesn't exist.
    #   But even if it exists, it's possible a different item has activated the bit in the bit array
    #

    def __init__(self, numItems, falsePositiveRate):
        self.size = self.getBloomFilterArraySize(numItems, falsePositiveRate)
        self.num_hashes = self.getNumHashes(numItems, self.size)

        self.bit_array = [0] * self.size

    # Helper function to determine size of the bit array
    def getBloomFilterArraySize(self, numItems, falsePositiveRate):
        bloomFilterArraySize = int(   -( (numItems * math.log(falsePositiveRate))/(math.log(2)** 2) )   )
        return bloomFilterArraySize
    
    # Helper function to determine number of hashes needed to minimise collsions
    def getNumHashes(self, numItems, bloomFilterArraySize):
        numHashes = (bloomFilterArraySize/numItems) * (math.log(2))
        return numHashes
    

    def hash(self, item, seed):
        # Step 1: Create the combined string of seed and item
        combined_str = str(seed) + item
        
        # Step 2: Encode the combined string to bytes
        encoded_str = combined_str.encode('utf-8')
        
        # Step 3: Create the SHA256 hash of the encoded string
        sha256_hash = hashlib.sha256(encoded_str).hexdigest()
        
        # Step 4: Convert the hexadecimal hash to an integer
        hash_int = int(sha256_hash, 16)
        
        # Step 5: Compute the final index within the bit array size
        index = hash_int % self.size

        return index
    

    def add(self, image_path):

        # Generate seeds, up to the number of hashes we need
        # Normally we would use multiple hash functions, but
        # since we are using only 1, we will instead use multiple seeds
        # for variance

         # Get a unique hash for the image
        image_hash = self._hash_image(image_path)

        # Run the hash function as many times as we need (calculated earlier)
        # while also generating a new seed to be used for the hash (between 0 and number of hashes needed)
        # num_hashes will be determined by the number of items we have in total that we will add
        for seed in range(int(self.num_hashes)):

            # Get the index of the bit array to check based of the hash function
            index = self.hash(image_hash, seed)

            # Set the bit to 1
            self.bit_array[index] = 1
    

    def check(self, image_path):
        # Almost same process as adding item, except instead of setting the bit
        # to 1 to indicate the item exists, we will check the bit at the index to see if
        # it is 0 (item does not exist) or 1 (item exists)

        # Get a unique hash for the image
        image_hash = self._hash_image(image_path)

        # Run the hash function as many times as we need (calculated earlier)
        # while also generating a new seed to be used for the hash (between 0 and number of hashes needed)
        # num_hashes will be determined by the number of items we have in total that we will add
        for seed in range(int(self.num_hashes)):

            # Get the index of the bit array to check based of the hash function
            index = self.hash(image_hash, seed)

            # If the bit (element at the index of bit array) is 0, then the item guareenteed does not exist
            if self.bit_array[index] == 0:
                return False
            
        return True  # Otherwise, it may exist, as bit is flipped, but it could be from other item

    # We need to standardize the data so that we can reliably hash and retrieve it (when checking later)
    def _hash_image(self, image_path):

        # Open image, convert to a fixed size, and create a hash
        with Image.open(image_path) as img:

            # Resize to a fixed dimension
            img = img.resize((100, 100))

            # Convert image to bytes
            img_bytes = img.tobytes()  

            # Create a hash of the image bytes
            return hashlib.sha256(img_bytes).hexdigest()  

# Example usage
# n = number of items
# p = acceptable postive rate
#
# bloom = BloomFilter(n, p)
# bloom.add("pathname_to_image.jp/png/etc")
# print(bloom.check("pathname_to_image.jpg/png/etc")) # Will return true if we added it earlier, or false if not added


# Example real test
#
# n = 20000  # Number of items
# p = 0.01   # Acceptable false positive rate
# bloom = BloomFilter(n, p)

# We have the pictures in the same directory, so we can just use the filename but if
# they are in different directory, we'll need the pathname to it
#
# print("Adding parrow-9617024_640.jpg") 
# bloom.add("sparrow-9617024_640.jpg")

# print("Checking if we added parrow-9617024_640.jpg")
# print(bloom.check("sparrow-9617024_640.jpg"))  # Expected Output: True

# print("Checking if we added louvre-7146800_640.jpg")
# print(bloom.check("louvre-7146800_640.jpg"))  # Expected Output: False

# print("Adding louvre-7146800_640.jpg")
# bloom.add("louvre-7146800_640.jpg")

# print("Checking if we added louvre-7146800_640.jpg")
# print(bloom.check("louvre-7146800_640.jpg"))  # Expected Output: True